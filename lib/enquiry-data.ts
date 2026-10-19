import { normalizeShippingMarket } from './shipping';

export const enquiryFieldLimits = { name: 100, company: 150, email: 180, phone: 40, buyerCountry: 100, country: 100, destinationDetails: 150, product: 200, grade: 150, quantity: 100, application: 200, service: 150, purpose: 150, frequency: 100, certifications: 250, message: 3000, sourcePath: 300 } as const;
export type EnquiryData = Record<keyof typeof enquiryFieldLimits, string> & { requestId: string };

export function validateEnquiry(input: unknown): { data: EnquiryData; error?: never } | { error: string; data?: never } {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { error: 'Please check the enquiry details.' };
  const record = input as Record<string, unknown>;
  const data = {} as EnquiryData;
  for (const [field, limit] of Object.entries(enquiryFieldLimits)) {
    const value = record[field] ?? '';
    if (typeof value !== 'string' || value.length > limit) return { error: `Please check the ${field} field.` };
    data[field as keyof typeof enquiryFieldLimits] = value.trim();
  }
  if (!data.name || !data.company || !data.email || !data.buyerCountry) return { error: 'Name, company, email and buyer country are required.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return { error: 'Please enter a valid email address.' };
  data.country = normalizeShippingMarket(data.country);
  if (!data.country) return { error: 'Choose India, UK, USA, Europe or UAE as the delivery destination.' };
  if (typeof record.requestId !== 'string' || !/^[a-zA-Z0-9-]{16,80}$/.test(record.requestId)) return { error: 'Please reload the form and try again.' };
  data.requestId = record.requestId;
  if (data.sourcePath && (!data.sourcePath.startsWith('/') || data.sourcePath.startsWith('//'))) data.sourcePath = '';
  return { data };
}
