export const csvFields: Record<string, string> = { id: 'Record ID', request_id: 'Submission ID', reference: 'Reference', created_at: 'Received UTC', status: 'Status', name: 'Name', company: 'Company', email: 'Email', phone: 'Phone', buyer_country: 'Buyer country', shipping_market: 'Delivery market', destination_details: 'Delivery country or city', product: 'Product', grade: 'Grade or form', quantity: 'Quantity', application: 'Application', service: 'Service', purpose: 'Request type', frequency: 'Purchase frequency', certifications: 'Tests or certifications', message: 'Message', source_path: 'Source page', email_status: 'Email delivery', sent_at: 'Email sent UTC' };
function cell(value: unknown) {
  let text = String(value ?? '');
  // Prevent spreadsheet formula execution, including after leading whitespace.
  if (/^[\s\uFEFF]*[=+@-]|^[\t\r\n]/.test(text)) text = "'" + text;
  return '"' + text.replaceAll('"', '""') + '"';
}
export function enquiryCsv(rows: Record<string, unknown>[]) {
  return '\uFEFF' + [Object.values(csvFields).map(cell).join(','), ...rows.map(row => Object.keys(csvFields).map(key => cell(row[key])).join(','))].join('\r\n') + '\r\n';
}
