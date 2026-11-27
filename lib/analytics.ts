declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

type Params = Record<string, unknown>;
const trackedLeadReferences = new Set<string>();

/** Fire after a buyer enquiry has been saved successfully. */
export function trackLead(params: Params & { reference: string }) {
  if (typeof window === 'undefined') return;
  if (!params.reference || trackedLeadReferences.has(params.reference)) return;
  trackedLeadReferences.add(params.reference);
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: 'generate_lead', enquiry_ref: params.reference });
  window.fbq?.('track', 'Lead', params);
  window.gtag?.('event', 'generate_lead', { ...params, enquiry_ref: params.reference });
}

/** Fire when a visitor opens an enquiry flow or contacts sales. */
export function trackContact(params: Params = {}) {
  if (typeof window === 'undefined') return;
  window.fbq?.('track', 'Contact', params);
  window.gtag?.('event', 'contact', params);
}

/** Fire an additional named event in both analytics services. */
export function trackEvent(name: string, params: Params = {}) {
  if (typeof window === 'undefined') return;
  window.fbq?.('trackCustom', name, params);
  window.gtag?.('event', name, params);
}

export {};
