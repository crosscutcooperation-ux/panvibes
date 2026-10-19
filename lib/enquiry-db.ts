import 'server-only';
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import type { EnquiryData } from './enquiry-data';

const globalDatabase = globalThis as typeof globalThis & { panvibesEnquiries?: DatabaseSync };
function database() {
  if (globalDatabase.panvibesEnquiries) return globalDatabase.panvibesEnquiries;
  const path = resolve(/* turbopackIgnore: true */ process.env.SQLITE_PATH || './data/panvibes.sqlite');
  mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT, reference TEXT NOT NULL UNIQUE,
      request_id TEXT NOT NULL UNIQUE, created_at TEXT NOT NULL,
      name TEXT NOT NULL, company TEXT NOT NULL, email TEXT NOT NULL,
      phone TEXT NOT NULL, buyer_country TEXT NOT NULL, shipping_market TEXT NOT NULL,
      destination_details TEXT NOT NULL, product TEXT NOT NULL, grade TEXT NOT NULL,
      quantity TEXT NOT NULL, application TEXT NOT NULL, service TEXT NOT NULL,
      purpose TEXT NOT NULL, frequency TEXT NOT NULL, certifications TEXT NOT NULL,
      message TEXT NOT NULL, source_path TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'new'
    );
    CREATE INDEX IF NOT EXISTS enquiries_created_at ON enquiries(created_at);
  `);
  globalDatabase.panvibesEnquiries = db;
  return db;
}

export function saveEnquiry(data: EnquiryData) {
  const db = database();
  const createdAt = new Date().toISOString();
  const reference = `PV-${createdAt.slice(0, 10).replaceAll('-', '')}-${randomUUID().slice(0, 8).toUpperCase()}`;
  db.prepare(`INSERT INTO enquiries (reference,request_id,created_at,name,company,email,phone,buyer_country,shipping_market,destination_details,product,grade,quantity,application,service,purpose,frequency,certifications,message,source_path)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(request_id) DO NOTHING`).run(reference, data.requestId, createdAt, data.name, data.company, data.email, data.phone, data.buyerCountry, data.country, data.destinationDetails, data.product, data.grade, data.quantity, data.application, data.service, data.purpose, data.frequency, data.certifications, data.message, data.sourcePath);
  return db.prepare('SELECT reference,created_at AS createdAt FROM enquiries WHERE request_id=?').get(data.requestId) as { reference: string; createdAt: string };
}
