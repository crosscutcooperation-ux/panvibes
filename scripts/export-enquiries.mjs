import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import nextEnv from '@next/env';

nextEnv.loadEnvConfig(process.cwd());
const db = new DatabaseSync(resolve(process.env.SQLITE_PATH || './data/panvibes.sqlite'), { readOnly: true });
try {
  const enquiries = db.prepare('SELECT * FROM enquiries ORDER BY created_at DESC').all();
  const output = resolve(process.argv[2] || './data/enquiries-export.json');
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, JSON.stringify(enquiries, null, 2) + '\n', { mode: 0o600 });
  console.log(`Exported ${enquiries.length} enquiries to ${output}. Keep this file private.`);
} finally { db.close(); }
