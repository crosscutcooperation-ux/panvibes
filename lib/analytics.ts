declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

type Params = Record<string, unknown>;

/** Fire after a buyer enquiry has been saved successfully. */
export function trackLead(params: Params = {}) {
  if (typeof window === 'undefined') return;
  window.fbq?.('track', 'Lead', params);
  window.gtag?.('event', 'generate_lead', params);
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
