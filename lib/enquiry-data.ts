export const enquiryFieldLimits = { name: 100, company: 150, email: 180, phone: 40, buyerCountry: 100, country: 100, destinationDetails: 150, product: 200, grade: 150, quantity: 100, application: 200, service: 150, purpose: 150, frequency: 100, certifications: 250, message: 3000, sourcePath: 300 } as const;
export type EnquiryData = Record<keyof typeof enquiryFieldLimits, string> & { requestId: string };

function obviousJunk(value: string) {
  const letters = value.toLowerCase().replace(/[^a-z]/g, '');
  const randomCase = value.split(/\s+/).some(word => word.length >= 12 && (word.match(/[A-Z]/g)?.length || 0) >= 5 && (word.match(/[a-z]/g)?.length || 0) >= 5);
  return /(.)\1{4,}/.test(letters)
    || /(qwerty|asdfgh|zxcvbn|12345678)/.test(value.toLowerCase())
    || (letters.length >= 9 && !/[aeiouy]/.test(letters))
    || randomCase;
}

export function validateEnquiry(input: unknown): { data: EnquiryData; error?: never } | { error: string; data?: never } {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { error: 'Please check the enquiry details.' };
  const record = input as Record<string, unknown>;
  const data = {} as EnquiryData;
  for (const [field, limit] of Object.entries(enquiryFieldLimits)) {
    const value = record[field] ?? '';
    if (typeof value !== 'string' || value.length > limit) return { error: `Please check the ${field} field.` };
    data[field as keyof typeof enquiryFieldLimits] = value.trim();
  }
  if (!data.name || !data.email || !data.buyerCountry || !data.product || !data.quantity) return { error: 'Name, email, your country, product and quantity are required.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return { error: 'Please enter a valid email address.' };
  if (!/\d/.test(data.quantity)) return { error: 'Please enter a numeric quantity, such as 50 kg.' };
  if ([data.name, data.buyerCountry, data.product].some(obviousJunk)) return { error: 'Please enter meaningful name, country and product details.' };
  // Keep the historical shipping_market database column for existing records.
  // The simplified form submits the optional destination as one field.
  data.country = '';
  if (typeof record.requestId !== 'string' || !/^[a-zA-Z0-9-]{16,80}$/.test(record.requestId)) return { error: 'Please reload the form and try again.' };
  data.requestId = record.requestId;
  if (data.sourcePath && (!data.sourcePath.startsWith('/') || data.sourcePath.startsWith('//'))) data.sourcePath = '';
  return { data };
}
