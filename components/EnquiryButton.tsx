'use client';
import { useEnquiry, type EnquiryRequest } from './EnquiryProvider';
import type { ReactNode } from 'react';
import { trackContact } from '@/lib/analytics';

export default function EnquiryButton({ children, className = 'buyer-button', ...request }: EnquiryRequest & { children: ReactNode; className?: string }) {
  const open = useEnquiry();
  return <button type="button" className={className} onClick={() => { trackContact({ source: 'enquiry_button' }); open(request); }}>{children}</button>;
}
