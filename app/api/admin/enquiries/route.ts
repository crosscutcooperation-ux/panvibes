import { adminSession } from '@/lib/admin-auth';
import { notificationTable, notifyEnquiry } from '@/lib/mailer';
import { guardRequest } from '@/lib/request-guard';
const headers = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' };
export async function GET(request: Request) {
  if (!await adminSession()) return Response.json({ error: 'Please sign in.' }, { status: 401, headers });
  const db = notificationTable(), params = new URL(request.url).searchParams;
  const search = (params.get('search') || '').slice(0, 200);
  const page = Math.max(1, Math.min(1_000_000, Math.trunc(Number(params.get('page'))) || 1));
  const status = ['new', 'reviewed', 'closed'].includes(params.get('status') || '') ? params.get('status')! : '';
  const where = `WHERE (?='' OR e.status=?) AND (?='' OR e.name LIKE ? OR e.company LIKE ? OR e.email LIKE ? OR e.product LIKE ? OR e.reference LIKE ?)`;
  const values = [status, status, search, ...Array(5).fill(`%${search}%`)];
  const count = Number(db.prepare(`SELECT COUNT(*) AS n FROM enquiries e ${where}`).get(...values)!.n);
  const summary = db.prepare(`SELECT COUNT(*) AS total,COALESCE(SUM(status='new'),0) AS unread,COALESCE(SUM(created_at>=?),0) AS week FROM enquiries`).get(new Date(Date.now()-7*24*60*60_000).toISOString());
  const failedEmails = Number(db.prepare("SELECT COUNT(*) AS n FROM enquiries e LEFT JOIN enquiry_notifications n ON n.reference=e.reference WHERE n.status='failed' OR n.reference IS NULL").get()!.n);
  const rows = db.prepare(`SELECT e.*,COALESCE(n.status,'not sent') AS email_status,n.sent_at,n.error_code FROM enquiries e LEFT JOIN enquiry_notifications n ON n.reference=e.reference ${where} ORDER BY e.created_at DESC,e.id DESC LIMIT 25 OFFSET ?`).all(...values, (page - 1) * 25);
  return Response.json({ summary: { ...summary, failedEmails }, rows, count, page, pages: Math.max(1, Math.ceil(count / 25)) }, { headers });
}
export async function POST(request: Request) {
  if (!await adminSession()) return Response.json({ error: 'Please sign in.' }, { status: 401, headers });
  const rejected = guardRequest(request, 'admin-enquiries', 30); if (rejected) return rejected;
  if (!request.headers.get('content-type')?.includes('application/json')) return Response.json({ error: 'Invalid request.' }, { status: 415, headers });
  const raw = await request.text(); if (raw.length > 1000) return Response.json({ error: 'Invalid request.' }, { status: 413, headers });
  let input; try { input = JSON.parse(raw); } catch { return Response.json({ error: 'Invalid request.' }, { status: 400, headers }); }
  if (typeof input?.reference !== 'string' || !/^PV-\d{8}-[A-F0-9]{8}$/.test(input.reference)) return Response.json({ error: 'Invalid reference.' }, { status: 400, headers });
  const db = notificationTable();
  if (!db.prepare('SELECT id FROM enquiries WHERE reference=?').get(input.reference)) return Response.json({ error: 'Enquiry not found.' }, { status: 404, headers });
  if (input.action === 'retry-email') return Response.json({ emailDelivery: await notifyEnquiry(input.reference) }, { headers });
  if (!['new', 'reviewed', 'closed'].includes(input.status)) return Response.json({ error: 'Invalid status.' }, { status: 400, headers });
  db.prepare('UPDATE enquiries SET status=? WHERE reference=?').run(input.status, input.reference);
  return Response.json({ saved: true }, { headers });
}
