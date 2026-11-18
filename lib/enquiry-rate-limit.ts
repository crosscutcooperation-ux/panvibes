import 'server-only';
import { createHash } from 'node:crypto';
import { isIP } from 'node:net';
import { database } from './enquiry-db';

const windowMs = 60_000;
const maxAttempts = 2;

export function limitEnquiry(request: Request, requestId: string) {
  const forwarded = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '';
  const ip = isIP(forwarded) ? forwarded : 'local';
  const ipHash = createHash('sha256').update(ip).digest('hex');
  const db = database();
  db.exec(`CREATE TABLE IF NOT EXISTS enquiry_rate_attempts (
    ip_hash TEXT NOT NULL, request_id TEXT NOT NULL, at_ms INTEGER NOT NULL,
    PRIMARY KEY (ip_hash, request_id)
  ); CREATE INDEX IF NOT EXISTS enquiry_rate_attempts_at ON enquiry_rate_attempts(at_ms);`);
  const now = Date.now();
  db.exec('BEGIN IMMEDIATE');
  try {
    db.prepare('DELETE FROM enquiry_rate_attempts WHERE at_ms <= ?').run(now - windowMs);
    if (db.prepare('SELECT 1 FROM enquiry_rate_attempts WHERE ip_hash=? AND request_id=?').get(ipHash, requestId)) {
      db.exec('COMMIT');
      return true;
    }
    const count = db.prepare('SELECT count(*) AS total FROM enquiry_rate_attempts WHERE ip_hash=?').get(ipHash) as { total: number };
    if (count.total >= maxAttempts) {
      db.exec('COMMIT');
      return false;
    }
    db.prepare('INSERT INTO enquiry_rate_attempts (ip_hash,request_id,at_ms) VALUES (?,?,?)').run(ipHash, requestId, now);
    db.exec('COMMIT');
    return true;
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}
