import { adminSession } from '@/lib/admin-auth';
import { notificationTable } from '@/lib/mailer';
import { enquiryCsv } from '@/lib/enquiry-csv';

export async function GET() {
  if (!await adminSession()) return Response.json({ error: 'Please sign in.' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  const db = notificationTable();
  const rows = db.prepare("SELECT e.*,COALESCE(n.status,'not sent') AS email_status,n.sent_at FROM enquiries e LEFT JOIN enquiry_notifications n ON n.reference=e.reference ORDER BY e.created_at DESC,e.id DESC").all();
  return new Response(enquiryCsv(rows), { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="PanVibes-Enquiries-${new Date().toISOString().slice(0, 10)}.csv"`, 'Cache-Control': 'no-store, private', 'X-Content-Type-Options': 'nosniff', 'X-Robots-Tag': 'noindex, nofollow' } });
}
