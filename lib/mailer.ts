import 'server-only';
import nodemailer from 'nodemailer';
import { database } from './enquiry-db';

function transporter() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) throw new Error('SMTP_NOT_CONFIGURED');
  const port = Number(process.env.SMTP_PORT || 465);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com', port,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465,
    requireTLS: process.env.SMTP_REQUIRE_TLS !== 'false' && port !== 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    connectionTimeout: 8000, greetingTimeout: 8000, socketTimeout: 12000,
    disableFileAccess: true, disableUrlAccess: true,
  });
}

export async function sendMail(to: string, subject: string, text: string, replyTo?: string) {
  const transport = transporter();
  try {
    const result = await transport.sendMail({ from: { name: 'PanVibes Exim', address: process.env.SMTP_FROM || process.env.SMTP_USER! }, to, replyTo, subject, text });
    if (!result.accepted.length) throw new Error('SMTP_RECIPIENT_REJECTED');
    return String(result.messageId);
  } finally { transport.close(); }
}

export function notificationTable() {
  const db = database();
  db.exec(`PRAGMA foreign_keys=ON; CREATE TABLE IF NOT EXISTS enquiry_notifications (
    reference TEXT PRIMARY KEY REFERENCES enquiries(reference) ON DELETE CASCADE, status TEXT NOT NULL DEFAULT 'pending',
    attempts INTEGER NOT NULL DEFAULT 0, attempted_at INTEGER NOT NULL DEFAULT 0,
    sent_at TEXT, message_id TEXT, error_code TEXT
  )`);
  return db;
}

export async function notifyEnquiry(reference: string): Promise<'sent' | 'pending' | 'failed'> {
  const db = notificationTable();
  const enquiry = db.prepare('SELECT * FROM enquiries WHERE reference=?').get(reference);
  if (!enquiry) throw new Error('ENQUIRY_NOT_FOUND');
  db.prepare('INSERT INTO enquiry_notifications(reference) VALUES(?) ON CONFLICT DO NOTHING').run(reference);
  const claimed = db.prepare(`UPDATE enquiry_notifications SET status='sending',attempts=attempts+1,attempted_at=?,error_code=NULL
    WHERE reference=? AND (status IN ('pending','failed') OR (status='sending' AND attempted_at<?))`).run(Date.now(), reference, Date.now() - 120_000);
  if (!claimed.changes) return db.prepare('SELECT status FROM enquiry_notifications WHERE reference=?').get(reference)?.status === 'sent' ? 'sent' : 'pending';
  const labels: Record<string, string> = { reference: 'Reference', created_at: 'Received (UTC)', name: 'Name', company: 'Company', email: 'Email', phone: 'Phone / WhatsApp', buyer_country: 'Buyer country', shipping_market: 'Delivery market', destination_details: 'Delivery country / city', product: 'Product', grade: 'Grade / form', quantity: 'Quantity', application: 'Application', service: 'Service', purpose: 'Request type', frequency: 'Purchase frequency', certifications: 'Tests / certifications', message: 'Message', source_path: 'Website page' };
  const body = 'New website enquiry\n\n' + Object.entries(labels).map(([key, label]) => `${label}: ${enquiry[key] || 'Not provided'}`).join('\n') + '\n\nSign in to /admin on the PanVibes website to review enquiries and download CSV.';
  try {
    if (!process.env.ENQUIRY_RECIPIENT) throw new Error('RECIPIENT_NOT_CONFIGURED');
    const id = await sendMail(process.env.ENQUIRY_RECIPIENT, `PanVibes enquiry ${reference} - ${String(enquiry.product || enquiry.service || 'General').replace(/[\r\n]/g, ' ')}`, body, String(enquiry.email));
    db.prepare("UPDATE enquiry_notifications SET status='sent',sent_at=?,message_id=? WHERE reference=?").run(new Date().toISOString(), id, reference);
    return 'sent';
  } catch (error) {
    const code = error && typeof error === 'object' && 'code' in error ? String(error.code).slice(0, 60) : 'SMTP_UNAVAILABLE';
    db.prepare("UPDATE enquiry_notifications SET status='failed',error_code=? WHERE reference=?").run(code, reference);
    console.warn('Enquiry email delivery unavailable; enquiry retained for admin retry.');
    return 'failed';
  }
}
