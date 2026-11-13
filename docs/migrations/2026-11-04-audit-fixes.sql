-- Audit fixes (Nov 2026). Forward-only, safe to re-run, no schema removed.
--
-- 1. Index for the expired-session cleanup that now runs on every login.
-- 2. Customer totals repair: bills voided BEFORE this release never took their visit and
--    spend back off the customer, so total_visits / total_spent / customer_category were
--    inflated. Voids made by the new code record "creditReversed" in the correction's
--    metadata and already adjust the totals, so they are skipped here — running this after
--    the new code is live never subtracts a void twice.
--
-- Not changed here (see docs/MIGRATION_GUIDE.md §10): negative customer credit balances left by
-- old voids of already-paid credit bills. They are real money owed to the customer and need a
-- human decision, so they are only reported.

BEGIN;

CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions (expires_at);

-- Old-style voids, per customer. Marked as repaired so a re-run is a no-op.
CREATE TEMP TABLE legacy_void_totals ON COMMIT DROP AS
SELECT b.customer_id, COUNT(*)::int AS visits, COALESCE(SUM(b.grand_total), 0) AS spent, ARRAY_AGG(fc.id) AS correction_ids
FROM financial_corrections fc
JOIN salon_bills b ON b.id = fc.source_id
WHERE fc.source_type = 'salon_bill'
  AND fc.correction_type = 'void'
  AND b.status = 'cancelled'
  AND b.customer_id IS NOT NULL
  AND fc.metadata ->> 'creditReversed' IS NULL
  AND fc.metadata ->> 'statsRepaired' IS NULL
GROUP BY b.customer_id;

UPDATE customers c
SET total_visits = GREATEST(COALESCE(c.total_visits, 0) - v.visits, 0),
    total_spent = GREATEST(COALESCE(c.total_spent, 0) - v.spent, 0),
    customer_category = CASE
      WHEN GREATEST(COALESCE(c.total_spent, 0) - v.spent, 0) >= 50000 THEN 'VIP Customer'
      WHEN GREATEST(COALESCE(c.total_visits, 0) - v.visits, 0) >= 2 THEN 'Returning Customer'
      ELSE 'New Customer'
    END,
    updated_at = NOW()
FROM legacy_void_totals v
WHERE c.id = v.customer_id;

UPDATE financial_corrections fc
SET metadata = COALESCE(fc.metadata, '{}'::jsonb) || '{"statsRepaired": true}'::jsonb
FROM legacy_void_totals v
WHERE fc.id = ANY (v.correction_ids);

COMMIT;
