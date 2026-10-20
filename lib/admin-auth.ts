import 'server-only';
import { createHash, createHmac, randomBytes, randomInt, scryptSync, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { database } from './enquiry-db';
import { sendMail } from './mailer';

export const adminCookie = 'panvibes_admin';
const sessionLifetime = 8 * 60 * 60;
const digest = (value: string) => createHash('sha256').update(value).digest('hex');

function authDatabase() {
  const db = database();
  db.exec(`CREATE TABLE IF NOT EXISTS admin_account (
    id INTEGER PRIMARY KEY CHECK(id=1), username TEXT NOT NULL, password_hash TEXT NOT NULL,
    reset_email TEXT NOT NULL, secret TEXT NOT NULL, password_version INTEGER NOT NULL DEFAULT 1
  );
  CREATE TABLE IF NOT EXISTS admin_sessions (token_hash TEXT PRIMARY KEY, version INTEGER NOT NULL, expires_at INTEGER NOT NULL);
  CREATE TABLE IF NOT EXISTS admin_reset (id INTEGER PRIMARY KEY CHECK(id=1), code_hash TEXT NOT NULL, expires_at INTEGER NOT NULL, attempts INTEGER NOT NULL DEFAULT 0, issued_at INTEGER NOT NULL);
  CREATE TABLE IF NOT EXISTS admin_login_attempts (bucket TEXT PRIMARY KEY, failures INTEGER NOT NULL, expires_at INTEGER NOT NULL);`);
  if (process.env.ADMIN_USERNAME && process.env.ADMIN_INITIAL_PASSWORD_HASH && process.env.ADMIN_RESET_EMAIL) {
    db.prepare('INSERT INTO admin_account(id,username,password_hash,reset_email,secret) VALUES(1,?,?,?,?) ON CONFLICT(id) DO NOTHING').run(process.env.ADMIN_USERNAME, process.env.ADMIN_INITIAL_PASSWORD_HASH, process.env.ADMIN_RESET_EMAIL, randomBytes(32).toString('hex'));
  }
  db.prepare('DELETE FROM admin_sessions WHERE expires_at<?').run(Date.now());
  db.prepare('DELETE FROM admin_login_attempts WHERE expires_at<?').run(Date.now());
  return db;
}

type Account = { username: string; password_hash: string; reset_email: string; secret: string; password_version: number };
function account() { return authDatabase().prepare('SELECT * FROM admin_account WHERE id=1').get() as Account | undefined; }
function equal(a: string, b: string) { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); }
function passwordHash(password: string, salt = randomBytes(16).toString('hex')) { return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`; }

export async function adminSession() {
  const token = (await cookies()).get(adminCookie)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const db = authDatabase();
  const session = db.prepare('SELECT a.username FROM admin_sessions s JOIN admin_account a ON a.id=1 AND a.password_version=s.version WHERE s.token_hash=? AND s.expires_at>?').get(digest(token), Date.now());
  return session ? { username: String(session.username) } : null;
}

export async function loginAdmin(username: string, password: string, request: Request) {
  const db = authDatabase(), user = account();
  if (!user) return { error: 'Administrator login has not been configured.', status: 503 };
  const bucket = digest(`login:${username.toLowerCase()}`);
  const attempts = db.prepare('SELECT failures FROM admin_login_attempts WHERE bucket=?').get(bucket);
  if (attempts && Number(attempts.failures) >= 8) return { error: 'Too many attempts. Try again in 15 minutes.', status: 429 };
  const [salt] = user.password_hash.split(':');
  const valid = equal(passwordHash(password, salt), user.password_hash) && equal(username, user.username);
  if (!valid) {
    db.prepare('INSERT INTO admin_login_attempts VALUES(?,1,?) ON CONFLICT(bucket) DO UPDATE SET failures=failures+1').run(bucket, Date.now() + 15 * 60_000);
    return { error: 'The username or password is incorrect.', status: 401 };
  }
  db.prepare('DELETE FROM admin_login_attempts WHERE bucket=?').run(bucket);
  const token = randomBytes(32).toString('hex');
  db.prepare('INSERT INTO admin_sessions VALUES(?,?,?)').run(digest(token), user.password_version, Date.now() + sessionLifetime * 1000);
  const url = new URL(request.url);
  const hostname = new URL('http://' + (request.headers.get('host') || url.host)).hostname;
  const local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(hostname);
  (await cookies()).set(adminCookie, token, { httpOnly: true, sameSite: 'strict', secure: !local || url.protocol === 'https:', path: '/', maxAge: sessionLifetime });
  return { username: user.username };
}

export async function logoutAdmin() {
  const cookie = (await cookies()).get(adminCookie)?.value;
  if (cookie) authDatabase().prepare('DELETE FROM admin_sessions WHERE token_hash=?').run(digest(cookie));
  (await cookies()).delete(adminCookie);
}

export async function requestAdminReset(username: string) {
  const db = authDatabase(), user = account();
  const generic = { message: 'If the username is correct, a reset code has been sent to the configured info email. The code expires in 10 minutes.' };
  if (!user || !equal(username, user.username)) return generic;
  const previous = db.prepare('SELECT issued_at FROM admin_reset WHERE id=1').get();
  if (previous && Date.now() - Number(previous.issued_at) < 60_000) return generic;
  const code = String(randomInt(100000, 1000000));
  const codeHash = createHmac('sha256', user.secret).update(code).digest('hex');
  db.prepare('INSERT INTO admin_reset VALUES(1,?,?,0,?) ON CONFLICT(id) DO UPDATE SET code_hash=excluded.code_hash,expires_at=excluded.expires_at,attempts=0,issued_at=excluded.issued_at').run(codeHash, Date.now() + 10 * 60_000, Date.now());
  try {
    await sendMail(user.reset_email, 'PanVibes admin password reset code', `Your PanVibes admin reset code is: ${code}\n\nIt expires in 10 minutes and can be used once. Enter it on the password reset screen at /admin. If you did not request this code, ignore this email. Your password has not changed.`);
  } catch {
    db.prepare('DELETE FROM admin_reset WHERE id=1 AND code_hash=?').run(codeHash);
    return { error: 'The reset email could not be sent. Please try again later.', status: 503 };
  }
  return generic;
}

export async function resetAdminPassword(username: string, code: string, password: string) {
  const db = authDatabase(), user = account();
  const row = db.prepare('SELECT * FROM admin_reset WHERE id=1').get();
  const failure = { error: 'The reset code is invalid or expired. Request a new code.', status: 400 };
  if (!user || !row || Number(row.expires_at) < Date.now() || Number(row.attempts) >= 5) return failure;
  db.prepare('UPDATE admin_reset SET attempts=attempts+1 WHERE id=1').run();
  const codeHash = createHmac('sha256', user.secret).update(code).digest('hex');
  if (!equal(username, user.username) || !equal(codeHash, String(row.code_hash))) return failure;
  if (password.length < 12 || password.length > 128) return { error: 'Use a password of 12 to 128 characters.', status: 400 };
  db.exec('BEGIN IMMEDIATE');
  try {
    db.prepare('UPDATE admin_account SET password_hash=?,password_version=password_version+1 WHERE id=1').run(passwordHash(password));
    db.exec('DELETE FROM admin_sessions; DELETE FROM admin_reset; DELETE FROM admin_login_attempts; COMMIT;');
  } catch (error) { db.exec('ROLLBACK'); throw error; }
  await logoutAdmin();
  return { message: 'Password changed. Sign in with your new password.' };
}
