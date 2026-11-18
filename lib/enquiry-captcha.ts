import 'server-only';

type Verdict = { success?: boolean; score?: number; action?: string; hostname?: string };

export async function verifyEnquiryCaptcha(input: unknown, request: Request) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return true;
  if (!input || typeof input !== 'object' || Array.isArray(input)) return false;
  const token = (input as Record<string, unknown>).recaptchaToken;
  if (typeof token !== 'string' || token.length < 20 || token.length > 4096) return false;
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
    });
    if (!response.ok) return false;
    const verdict = await response.json() as Verdict;
    const host = new URL(`http://${request.headers.get('host') || new URL(request.url).host}`).hostname;
    return verdict.success === true && typeof verdict.score === 'number' && verdict.score >= 0.5
      && verdict.action === 'enquiry_submit' && verdict.hostname === host;
  } catch {
    return false;
  }
}
