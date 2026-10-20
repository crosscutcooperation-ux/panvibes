'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';

const EnquiryForm = dynamic(() => import('./EnquiryForm'), {
  loading: () => <p role="status">Loading enquiry form…</p>,
});

export type EnquiryRequest = { product?: string; purpose?: string; service?: string; country?: string };
const EnquiryContext = createContext<(request?: EnquiryRequest) => void>(() => {});
export const useEnquiry = () => useContext(EnquiryContext);

export default function EnquiryProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<EnquiryRequest | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!request) return;
    const modal = dialog.current!;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden'; modal.showModal();
    return () => { modal.close(); document.documentElement.style.overflow = previous; };
  }, [request]);
  const query = new URLSearchParams(Object.entries(request || {}).filter(([, value]) => value !== undefined) as [string, string][]).toString();
  return <EnquiryContext.Provider value={next => setRequest(next || {})}>{children}
    <dialog ref={dialog} className="enquiry-dialog" aria-labelledby="inline-enquiry-title" onCancel={event => { event.preventDefault(); setRequest(null); }} onClick={event => {
      if (event.target !== event.currentTarget) return;
      const box = event.currentTarget.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) setRequest(null);
    }}>
      {request && <div className="enquiry-dialog-body"><button className="enquiry-dialog-close" type="button" aria-label="Close enquiry form" autoFocus onClick={() => setRequest(null)}>×</button>
        <p className="buyer-eyebrow">PanVibes Exim / Talk to our team</p><h2 id="inline-enquiry-title">Enquiry form</h2>
        {request.product && <p className="enquiry-dialog-product">{request.product}</p>}
        <EnquiryForm key={query} query={query}/>
      </div>}
    </dialog>
  </EnquiryContext.Provider>;
}
