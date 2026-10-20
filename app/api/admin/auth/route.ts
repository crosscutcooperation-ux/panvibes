import { adminSession, loginAdmin, logoutAdmin, requestAdminReset, resetAdminPassword } from '@/lib/admin-auth';
import { guardRequest } from '@/lib/request-guard';

const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' } });
export async function GET() { return json({ user: await adminSession() }); }
export async function POST(request: Request) {
  if (!request.headers.get('content-type')?.includes('application/json')) return json({ error: 'Use the administrator form.' }, 415);
  if (request.headers.get('sec-fetch-site') === 'cross-site') return json({ error: 'Use the administrator form on this website.' }, 403);
  const raw = await request.text();
  if (raw.length > 3000) return json({ error: 'The request is too long.' }, 413);
  let input;
  try { input = JSON.parse(raw); } catch { return json({ error: 'Check the form and try again.' }, 400); }
  const { action, username = '', password = '', code = '' } = input || {};
  if (![username, password, code].every(value => typeof value === 'string') || username.length > 100 || password.length > 128 || code.length > 10) return json({ error: 'Check the form fields.' }, 400);
  const limits: Record<string, number> = { login: 8, logout: 20, 'reset-request': 3, 'reset-confirm': 8 };
  if (typeof action !== 'string' || !Object.hasOwn(limits, action)) return json({ error: 'Unknown action.' }, 400);
  const rejected = guardRequest(request, `admin-${action}`, limits[action]);
  if (rejected) return rejected;
  try {
    const result = action === 'login' ? await loginAdmin(username, password, request)
      : action === 'reset-request' ? await requestAdminReset(username)
      : action === 'reset-confirm' ? await resetAdminPassword(username, code, password)
      : (await logoutAdmin(), { message: 'Signed out.' });
    return json(result, 'status' in result ? Number(result.status) : 200);
  } catch { console.error('Administrator action unavailable.'); return json({ error: 'The action could not be completed. Please try again.' }, 503); }
}
