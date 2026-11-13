import { NextResponse } from 'next/server';
import Database from '@/lib/db/index';
import { PERMISSIONS, requirePermission } from '@/lib/auth/permissions';
import { assertDrawerCashAvailable, assertSessionOpen, requireOpenSession } from '@/lib/business-day/service';
import { reverseBill } from '@/lib/loyalty/service';
import { isDatabaseNoise } from '@/lib/api/errors';
import { fromMinor, toMinor } from '@/lib/payments/money';

const REFUND_METHODS = new Set(['cash', 'online']);

/**
 * POST { reason, credit_refund_method? } — void (cancel) a paid bill.
 *
 * Cash / online parts are refunded. The credit part is split by what the customer still owes:
 *   - still owed      -> a 'reversal' entry removes it from the customer's credit balance
 *   - already paid off -> refunded as money (credit_refund_method: cash, default, or online),
 *                         never left behind as a negative balance
 * Products return to stock, loyalty is reversed and the customer's visit / spend totals drop.
 */
export async function POST(request, { params }) {
  try {
    const db = Database.getInstance();
    const user = await requirePermission(request, db, PERMISSIONS.BILLING_CORRECT);
    const data = await request.json();
    const reason = String(data.reason || '').replace(/[<>]/g, '').trim();
    if (reason.length < 5) throw new Error('Write the reason for cancelling this bill (at least 5 characters)');
    const creditRefundMethod = String(data.credit_refund_method || 'cash').toLowerCase();
    if (!REFUND_METHODS.has(creditRefundMethod)) throw new Error('Refund method must be cash or online');
    const key = String(request.headers.get('idempotency-key') || data.idempotency_key || '').trim();
    if (!key) throw new Error('Idempotency-Key is required');
    const prior = await db.get('SELECT id FROM financial_corrections WHERE idempotency_key=?', [key]);
    if (prior) return NextResponse.json({ correctionId: prior.id, duplicate: true });

    const { id } = await params;
    const scope = await requireOpenSession(db);
    const result = await db.transaction(async (tx) => {
      await assertSessionOpen(tx, scope.sessionId);
      const bill = await tx.get('SELECT * FROM salon_bills WHERE id=? FOR UPDATE', [Number(id)]);
      if (!bill) throw Object.assign(new Error('Bill not found'), { status: 404 });
      if (bill.status !== 'paid') throw new Error('Only a paid bill can be corrected');
      const allocations = await tx.all('SELECT method, amount FROM salon_payment_allocations WHERE bill_id=? ORDER BY id', [bill.id]);

      // How much of this bill's credit is still owed. Collections are not tied to a bill, so
      // whatever the customer's balance can't cover was already paid and must go back to them.
      const creditMinor = allocations.filter((a) => a.method === 'credit').reduce((sum, a) => sum + toMinor(a.amount), 0);
      let stillOwedMinor = 0;
      if (creditMinor > 0) {
        await tx.get('SELECT id FROM customers WHERE id=? FOR UPDATE', [bill.customer_id]);
        const balance = await tx.get('SELECT COALESCE(SUM(debit-credit),0) AS balance FROM customer_credit_ledger WHERE customer_id=?', [bill.customer_id]);
        stillOwedMinor = Math.min(creditMinor, Math.max(0, toMinor(balance.balance)));
      }
      const paidCreditMinor = creditMinor - stillOwedMinor;

      const refunds = allocations
        .filter((a) => a.method !== 'credit')
        .map((a) => ({ method: a.method, amountMinor: toMinor(a.amount) }));
      if (paidCreditMinor > 0) refunds.push({ method: creditRefundMethod, amountMinor: paidCreditMinor });
      const cashRefund = fromMinor(refunds.filter((r) => r.method === 'cash').reduce((sum, r) => sum + r.amountMinor, 0));
      await assertDrawerCashAvailable(tx, cashRefund, { label: 'bill refund' });

      const correction = await tx.run(
        `INSERT INTO financial_corrections(source_type,source_id,correction_type,amount,reason,metadata,business_day_id,store_session_id,created_by,idempotency_key)
         VALUES ('salon_bill',?,'void',?,?,?::jsonb,?,?,?,?)`,
        [bill.id, bill.grand_total, reason, JSON.stringify({ billNumber: bill.bill_number, creditReversed: fromMinor(stillOwedMinor), creditRefunded: fromMinor(paidCreditMinor) }),
          scope.businessDayId, scope.sessionId, user.id, key],
      );

      if (stillOwedMinor > 0) {
        await tx.run(
          `INSERT INTO customer_credit_ledger(customer_id,bill_id,entry_type,debit,credit,note,business_day_id,created_by,idempotency_key)
           VALUES (?,?,'reversal',0,?,?,?,?,?)`,
          [bill.customer_id, bill.id, fromMinor(stillOwedMinor), reason, scope.businessDayId, user.id, `${key}:credit`],
        );
      }
      for (let i = 0; i < refunds.length; i += 1) {
        await tx.run(
          `INSERT INTO payment_refunds(bill_id,correction_id,method,amount,business_day_id,store_session_id,created_by,idempotency_key)
           VALUES (?,?,?,?,?,?,?,?)`,
          [bill.id, correction.lastInsertRowid, refunds[i].method, fromMinor(refunds[i].amountMinor), scope.businessDayId, scope.sessionId, user.id, `${key}:refund:${i}`],
        );
      }

      const products = await tx.all("SELECT item_id, quantity, name FROM salon_bill_items WHERE bill_id=? AND item_type='product'", [bill.id]);
      for (const item of products) {
        const product = await tx.get('SELECT current_stock FROM salon_products WHERE id=? FOR UPDATE', [item.item_id]);
        if (!product) continue;
        const next = Number(product.current_stock) + Number(item.quantity);
        await tx.run('UPDATE salon_products SET current_stock=?, updated_at=NOW() WHERE id=?', [next, item.item_id]);
        await tx.run(
          `INSERT INTO inventory_movements(product_id,movement_type,quantity,previous_stock,new_stock,notes) VALUES (?,'adjustment',?,?,?,?)`,
          [item.item_id, item.quantity, product.current_stock, next, `Void ${bill.bill_number}: ${reason}`],
        );
      }

      // Undo what billing added to the customer's totals; the category follows the same rule.
      if (bill.customer_id) {
        await tx.run(`
          UPDATE customers
          SET total_visits = GREATEST(COALESCE(total_visits, 0) - 1, 0),
              total_spent = GREATEST(COALESCE(total_spent, 0) - ?, 0),
              customer_category = CASE
                WHEN GREATEST(COALESCE(total_spent, 0) - ?, 0) >= 50000 THEN 'VIP Customer'
                WHEN GREATEST(COALESCE(total_visits, 0) - 1, 0) >= 2 THEN 'Returning Customer'
                ELSE 'New Customer'
              END,
              updated_at = NOW()
          WHERE id = ?
        `, [bill.grand_total, bill.grand_total, bill.customer_id]);
      }

      await reverseBill(tx, { billId: bill.id, actorId: user.id, reason });
      await tx.run("UPDATE salon_bills SET status='cancelled' WHERE id=?", [bill.id]);
      return {
        correctionId: correction.lastInsertRowid,
        billNumber: bill.bill_number,
        cashRefund,
        creditReversed: fromMinor(stillOwedMinor),
        creditRefunded: fromMinor(paidCreditMinor),
      };
    });
    return NextResponse.json({ message: 'Bill voided with an immutable correction and refund record', ...result }, { status: 201 });
  } catch (error) {
    if (isDatabaseNoise(error?.message)) console.error('Bill void failed:', error);
    const message = isDatabaseNoise(error?.message) ? 'Unable to cancel the bill. Nothing was changed.' : (error.message || 'Unable to correct bill');
    return NextResponse.json({ error: message, code: error.code }, { status: error.status || (/not found/i.test(error.message) ? 404 : 400) });
  }
}
