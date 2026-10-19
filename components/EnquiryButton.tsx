'use client';
import { useEnquiry, type EnquiryRequest } from './EnquiryProvider';
import type { ReactNode } from 'react';

export default function EnquiryButton({ children, className = 'buyer-button', ...request }: EnquiryRequest & { children: ReactNode; className?: string }) {
  const open = useEnquiry();
  return <button type="button" className={className} onClick={() => open(request)}>{children}</button>;
}
