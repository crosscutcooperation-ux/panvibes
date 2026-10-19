import { DatabaseSync } from 'node:sqlite';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';

// Track only requests created in this automated browser context.
export function trackTestEnquiries(page) {
  const ids = new Set();
  page.on('request', request => {
    if (request.method() === 'POST' && new URL(request.url()).pathname === '/api/enquiries') {
      try { ids.add(request.postDataJSON().requestId); } catch { /* No valid request body. */ }
    }
  });
  return () => {
    const path = resolve(process.env.SQLITE_PATH || './data/panvibes.sqlite');
    if (!ids.size || !existsSync(path)) return;
    const db = new DatabaseSync(path);
    try { for (const id of ids) db.prepare('DELETE FROM enquiries WHERE request_id=?').run(id); }
    finally { db.close(); }
  };
}
