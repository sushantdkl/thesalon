/**
 * Finds active users whose PIN is still one of the published demo PINs and gives each a new
 * random 6-digit PIN. Real PINs are never touched (bcrypt can't be reversed, so the only thing
 * this can recognise is a known demo value).
 *
 *   node --env-file=.env.local scripts/rotate-demo-pins.mjs           # dry run: lists who
 *   node --env-file=.env.local scripts/rotate-demo-pins.mjs --apply   # changes + prints PINs
 *
 * The new PINs are printed ONCE. Hand them to each staff member, then clear your terminal.
 * Their open sessions are signed out so the old PIN stops working everywhere at once.
 */
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import pg from 'pg';
import { poolConfig } from './migration-utils.mjs';

const DEMO_PINS = ['1111', '2222', '3333', '4444', '5555', '111111', '222222', '333333', '444444', '555555', '1234', '123456', '0000', '000000'];
const apply = process.argv.includes('--apply');

const client = new pg.Client(poolConfig());
await client.connect();
try {
  const users = (await client.query('SELECT id, username, full_name, password_hash FROM users WHERE is_active = TRUE ORDER BY id')).rows;
  const weak = users.filter((user) => user.password_hash && DEMO_PINS.some((pin) => bcrypt.compareSync(pin, user.password_hash)));
  if (!weak.length) {
    console.log('No active user is on a demo PIN. Nothing to do.');
  } else if (!apply) {
    console.log('Still on a demo PIN (run again with --apply to replace):');
    for (const user of weak) console.log(`  ${user.username}  (${user.full_name})`);
  } else {
    await client.query('BEGIN');
    const issued = [];
    for (const user of weak) {
      const pin = String(crypto.randomInt(100000, 1000000));
      await client.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [bcrypt.hashSync(pin, 10), user.id]);
      await client.query('DELETE FROM sessions WHERE user_id = $1', [user.id]);
      issued.push({ username: user.username, name: user.full_name, pin });
    }
    await client.query('COMMIT');
    console.log('New PINs (shown once):');
    for (const row of issued) console.log(`  ${row.username.padEnd(14)} ${row.pin}   ${row.name}`);
  }
  console.log('\nAnyone NOT listed keeps their own PIN. If it is under 6 digits, reset it in Admin → Employees.');
} catch (error) {
  await client.query('ROLLBACK').catch(() => {});
  throw error;
} finally {
  await client.end();
}
