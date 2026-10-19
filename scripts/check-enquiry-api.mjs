import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';
import nextEnv from '@next/env';

nextEnv.loadEnvConfig(process.cwd());
const base = process.env.SITE_URL || 'http://127.0.0.1:3001';
const requestId = randomUUID();
const input = { requestId, name: 'API verification', company: 'PanVibes integration check', email: 'check@example.invalid', buyerCountry: 'UK', country: 'Europe', destinationDetails: 'France', product: 'Turmeric Powder', grade: '3% Curcumin', quantity: '500 kg', message: 'Automated persistence check', sourcePath: '/products/turmeric-powder' };
const post = (path, body, extra = {}) => fetch(base + path, { method: 'POST', headers: { 'Content-Type': 'application/json', ...extra }, body: JSON.stringify(body) });
let db;
try {
  const created = await post('/api/enquiries', input);
  assert.equal(created.status, 201); const record = await created.json();
  assert.match(record.reference, /^PV-\d{8}-[A-F\d]{8}$/);
  const duplicate = await post('/api/enquiries', input); assert.equal(duplicate.status, 201);
  assert.equal((await duplicate.json()).reference, record.reference, 'Retries must reuse one saved enquiry');
  db = new DatabaseSync(resolve(process.env.SQLITE_PATH || './data/panvibes.sqlite'));
  const row = db.prepare('SELECT * FROM enquiries WHERE request_id=?').get(requestId);
  assert.equal(row.reference, record.reference); assert.equal(row.shipping_market, 'Europe');
  assert.equal(row.destination_details, 'France'); assert.equal(row.product, 'Turmeric Powder'); assert.equal(row.grade, '3% Curcumin');
  assert.equal(db.prepare('SELECT count(*) AS count FROM enquiries WHERE request_id=?').get(requestId).count, 1);
  assert.equal((await post('/api/enquiries', { ...input, country: 'Canada' })).status, 400);
  assert.equal((await post('/api/enquiries', { ...input, email: 'not-an-email' })).status, 400);
  assert.equal((await post('/api/enquiries', input, { Origin: 'https://unrelated.invalid' })).status, 403);
  assert.equal((await post('/api/enquiries', { ...input, message: 'x'.repeat(17000) })).status, 413);
  assert.equal((await fetch(base + '/api/enquiries')).status, 405, 'Enquiries must not have a public read endpoint');
  assert.equal((await fetch(base + '/data/panvibes.sqlite')).status, 404);
  console.log('PASS: SQLite persistence, unique reference, duplicate retry, saved fields, validation and private storage.');
  const policy = await (await post('/api/chat', { message: 'Can you ship makhana to Canada?' })).json();
  assert.equal(policy.mode, 'catalog'); assert.match(policy.text, /only to India, the UK, the USA, Europe and the UAE/);
  const ai = await (await post('/api/chat', { message: 'Which forms of ginger are in your catalog?' })).json();
  assert.equal(ai.mode, 'gemini', 'Live Gemini connection must answer a catalog question');
  assert.ok(ai.text.length > 20); assert.ok(ai.links.every(link => link.href.startsWith('/') || link.href.startsWith('mailto:')));
  assert.ok(!JSON.stringify(ai).includes(process.env.GEMINI_API_KEY));
  console.log('PASS: live server-side Gemini answer, exact shipping policy and no exposed API key.');
} finally {
  if (db) { db.prepare('DELETE FROM enquiries WHERE request_id=?').run(requestId); db.close(); }
}
