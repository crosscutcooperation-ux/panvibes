import 'server-only';
import { createHash } from 'node:crypto';

const buckets = new Map<string, { count: number; expires: number }>();
export function guardRequest(request: Request, scope: string, limit: number) {
  const origin = request.headers.get('origin');
  if (origin) {
    let sameHost = false;
    try { sameHost = new URL(origin).host === (request.headers.get('host') || new URL(request.url).host); } catch { /* Invalid origins are rejected. */ }
    if (!sameHost) return Response.json({ error: 'Please submit from this website.' }, { status: 403 });
  }
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
  const key = createHash('sha256').update(`${scope}:${ip}`).digest('hex');
  const now = Date.now();
  for (const [id, entry] of buckets) if (entry.expires < now) buckets.delete(id);
  const bucket = buckets.get(key) || { count: 0, expires: now + 60_000 };
  if (bucket.count >= limit) return Response.json({ error: 'Please wait a moment before trying again.' }, { status: 429, headers: { 'Retry-After': '60' } });
  bucket.count++; buckets.set(key, bucket);
  return null;
}
