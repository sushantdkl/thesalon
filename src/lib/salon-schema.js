import { refreshServerCalendarSystem } from './dates/calendar-setting.js';

export async function ensureSalonSchema() {
  // PostgreSQL base schema is applied via docs/postgresql-schema.sql before deployment.
  // Do not run PostgreSQL schema changes from normal API requests on cPanel.
  // Apply docs/migrations/2026-07-21-normalize-usernames-for-passenger.sql once.
}

export async function getAuthUser(request, db) {
  const header = request.headers.get('authorization') || '';
  const token = header.replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;

  return await db.get(`
    SELECT u.id, u.username, u.full_name, u.role
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token = ? AND s.expires_at > NOW() AND u.is_active = TRUE
  `, [token]);
}

export async function requireAuth(request, db) {
  const user = await getAuthUser(request, db);
  if (!user) {
    const error = new Error('Unauthorized');
    error.status = 401;
    throw error;
  }
  // Report periods ("This Month") follow Settings → Calendar; keep the cached value current.
  await refreshServerCalendarSystem(db);
  return user;
}

export async function requireRole(request, db, roles) {
  const user = await requireAuth(request, db);
  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!allowed.includes(user.role)) {
    const error = new Error('Access denied');
    error.status = 403;
    throw error;
  }
  return user;
}

export function cleanText(value, fallback = '') {
  if (value === null || value === undefined) return fallback;
  return String(value).replace(/[<>]/g, '').trim();
}
