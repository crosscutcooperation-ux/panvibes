'use client';
import { useId, useRef, useState, type FormEvent } from 'react';
import { company, services } from '@/lib/site-content';
import { normalizeShippingMarket, shippingCoverage, shippingMarkets } from '@/lib/shipping';

export default function EnquiryForm({ query = "" }: { query?: string }) {
  const purposeId = useId();
  const params = new URLSearchParams(query);
  const prefill = (key: string) => (params.get(key) || '').slice(0, 200);
  const service = params.get('product') ? 'Product sourcing' : params.get('service') || '';
  const validService = ['Product sourcing', 'General enquiry', ...services.map(item => item.title.join(' '))].find(option => option.toLowerCase() === service.toLowerCase()) || '';
  const result = useRef<HTMLDivElement>(null);
  const [subject, setSubject] = useState('General');
  const [draft, setDraft] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [reference, setReference] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const requestId = useRef<string | null>(null);
  async function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const data = new FormData(event.currentTarget);
    const fields = [
      ['Enquiry', 'service'], ['Request', 'purpose'], ['Name', 'name'], ['Company', 'company'], ['Buyer country', 'buyerCountry'],
      ['Email', 'email'], ['WhatsApp / phone', 'phone'], ['Product required', 'product'], ['Grade / form', 'grade'],
      ['Quantity & unit', 'quantity'], ['Application', 'application'], ['Delivery country / region', 'country'], ['Delivery city / European country', 'destinationDetails'],
      ['Purchase frequency', 'frequency'], ['Required tests / certifications', 'certifications'],
    ];
    const body = `Hello PanVibes Exim,\n\n${data.get('message') || 'Please review my requirement below and share the relevant details.'}\n\n${fields.map(([label, key]) => `${label}: ${data.get(key) || 'To discuss'}`).join('\n')}`;
    setSubmitting(true); setError('');
    requestId.current ||= crypto.randomUUID();
    try {
      const response = await fetch('/api/enquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...Object.fromEntries(data), requestId: requestId.current, sourcePath: window.location.pathname }), signal: AbortSignal.timeout(20_000) });
      const saved = await response.json();
      if (!response.ok) throw new Error(saved.error || 'Your enquiry could not be saved. Please try again.');
      setReference(saved.reference);
      setDraft(`${body}\n\nEnquiry reference: ${saved.reference}`);
      setSubject(`${saved.reference} — ${String(data.get('product') || data.get('service') || 'General')}`);
      setCopyStatus('');
      requestAnimationFrame(() => { result.current?.focus(); result.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' }); });
    } catch (failure) {
      setError(failure instanceof Error && failure.name !== 'TimeoutError' ? failure.message : 'The connection timed out. Please try again.');
    } finally { setSubmitting(false); }
  }
  return <form className="contact-form enquiry-form" onSubmit={prepare} onChange={() => { setDraft(''); setReference(''); setError(''); requestId.current = null; }} aria-busy={submitting}>
    <fieldset className="enquiry-fieldset" disabled={submitting}>
    <p className="contact-form-wide contact-form-note">{shippingCoverage} Submit your requirement to save it for the PanVibes team. You will receive an enquiry reference on this screen.</p>
    <label>Your name <span>*</span><input name="name" autoComplete="name" required maxLength={100} placeholder="Full name" /></label>
    <label>Company <span>*</span><input name="company" autoComplete="organization" required maxLength={150} placeholder="Your organisation" /></label>
    <label>Email address <span>*</span><input name="email" type="email" autoComplete="email" required maxLength={180} placeholder="you@company.com" /></label>
    <label>WhatsApp / phone<input name="phone" type="tel" autoComplete="tel" maxLength={40} placeholder="Include country code" /></label>
    <label>Buyer country <span>*</span><input name="buyerCountry" autoComplete="country-name" required maxLength={100} placeholder="Where your company is based" /></label>
    <label>Delivery country / region <span>*</span><select name="country" defaultValue={normalizeShippingMarket(prefill('country'))} required><option value="">Select a shipping destination</option>{shippingMarkets.map(market => <option key={market.name}>{market.name}</option>)}</select></label>
    <label>Delivery city / European country<input name="destinationDetails" maxLength={150} placeholder="e.g. London, Dubai or France" /></label>
    <label>Product required<input name="product" defaultValue={prefill('product')} maxLength={200} placeholder="e.g. Ginger powder or Ferric Chloride" /></label>
    <label>Grade / form<input name="grade" maxLength={150} placeholder="e.g. Organic powder, 5+ or purity" /></label>
    <label>Quantity &amp; unit<input name="quantity" maxLength={100} placeholder="e.g. 500 kg or 2 metric tons" /></label>
    <label>Application<input name="application" maxLength={200} placeholder="e.g. Seasoning manufacture" /></label>
    <label>I’m interested in<select name="service" defaultValue={validService}><option value="">Select an enquiry</option><option>Product sourcing</option>{services.map(item => <option key={item.title.join(' ')}>{item.title.join(' ')}</option>)}<option>General enquiry</option></select></label>
    <label>Request type<input name="purpose" defaultValue={prefill('purpose').slice(0,150)} maxLength={150} list={purposeId} placeholder="Quote, sample, specifications…" /><datalist id={purposeId}><option value="Bulk quotation" /><option value="COA and specifications" /><option value="Sample request" /><option value="Product catalogue" /></datalist></label>
    <label>Purchase frequency<select name="frequency" defaultValue=""><option value="">Select if known</option><option>One-time order</option><option>Monthly</option><option>Quarterly</option><option>Recurring — to discuss</option></select></label>
    <label>Required tests / certifications<input name="certifications" maxLength={250} placeholder="e.g. Organic scope, COA, residue report" /></label>
    <label className="contact-form-wide">Additional requirements<textarea name="message" maxLength={3000} rows={3} placeholder="Packaging, delivery date, specifications or any other requirements…" /></label>
    <div className="contact-form-action"><p>Your details are saved for our team when you submit.</p><button className="contact-submit" type="submit" disabled={submitting}>{submitting ? 'Saving enquiry…' : 'Submit enquiry'} <span aria-hidden="true">↗</span></button></div>
    </fieldset>
    {error && <p className="contact-form-wide enquiry-error" role="alert">{error} You can also email <a href={`mailto:${company.email}`}>{company.email}</a>.</p>}
    {draft && <div className="contact-draft" ref={result} tabIndex={-1} role="status"><strong>Enquiry saved. Reference: {reference}</strong><p>Your requirement has been stored for the PanVibes team. Keep this reference for follow-up. You can also send or copy an email summary below.</p><pre className="contact-draft-preview">{draft}</pre><a href={`mailto:${company.email}?subject=${encodeURIComponent(`B2B enquiry — ${subject}`)}&body=${encodeURIComponent(draft)}`}>Open email draft ↗</a><button type="button" onClick={async () => { try { await navigator.clipboard.writeText(draft); setCopyStatus('Copied. Paste the enquiry into your email.'); } catch { setCopyStatus('Copy was unavailable. Select the draft text above to copy it manually.'); } }}>Copy enquiry</button><small>{company.email}</small>{copyStatus && <p>{copyStatus}</p>}</div>}
  </form>;
}
