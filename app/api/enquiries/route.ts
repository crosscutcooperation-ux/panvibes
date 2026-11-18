import { validateEnquiry } from '@/lib/enquiry-data';
import { saveEnquiry } from '@/lib/enquiry-db';
import { guardRequest } from '@/lib/request-guard';
import { notifyEnquiry } from '@/lib/mailer';
import { limitEnquiry } from '@/lib/enquiry-rate-limit';
import { verifyEnquiryCaptcha } from '@/lib/enquiry-captcha';

export async function POST(request: Request) {
  const rejected = guardRequest(request, 'enquiry', 10);
  if (rejected) return rejected;
  if (!request.headers.get('content-type')?.includes('application/json')) return Response.json({ error: 'Please submit a valid enquiry form.' }, { status: 415 });
  const text = await request.text();
  if (text.length > 16_000) return Response.json({ error: 'The enquiry is too long.' }, { status: 413 });
  let input: unknown;
  try { input = JSON.parse(text); } catch { return Response.json({ error: 'Please check your enquiry and try again.' }, { status: 400 }); }
  const trap = input && typeof input === 'object' && !Array.isArray(input) ? (input as Record<string, unknown>).website : undefined;
  if (trap !== undefined && (typeof trap !== 'string' || trap.trim() !== '')) return Response.json({ error: 'Please check your enquiry and try again.' }, { status: 400 });
  const validation = validateEnquiry(input);
  if (validation.error) return Response.json({ error: validation.error }, { status: 400 });
  try {
    if (!limitEnquiry(request, validation.data!.requestId)) return Response.json({ error: 'Please wait a minute before submitting another enquiry.' }, { status: 429, headers: { 'Retry-After': '60' } });
    if (!await verifyEnquiryCaptcha(input, request)) return Response.json({ error: 'Spam check failed. Please try again or email us directly.' }, { status: 403 });
    const saved = saveEnquiry(validation.data!);
    const emailDelivery = await notifyEnquiry(saved.reference);
    return Response.json({ ...saved, emailDelivery }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch {
    console.error('Enquiry storage failed. Check the configured SQLite directory and write access.');
    return Response.json({ error: 'Your enquiry could not be saved. Please try again or contact us by email.' }, { status: 503 });
  }
}
