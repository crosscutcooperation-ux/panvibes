import { isIP } from 'node:net';

// HTTPS is always secure. An initial deployment may explicitly allow a single
// numeric host over HTTP until its domain is connected; other hosts keep the
// normal secure-cookie policy. The trusted proxy supplies the protocol.
export function adminCookieSecure(hostname: string, protocol: string, httpHost?: string) {
  if (protocol.replace(/:$/, '').toLowerCase() === 'https') return true;
  if (/^(localhost|127\.0\.0\.1|\[::1\])$/.test(hostname)) return false;
  return !(isIP(hostname) && hostname === httpHost);
}
