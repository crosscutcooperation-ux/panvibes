'use client';

import { trackContact } from '@/lib/analytics';
import type { AnchorHTMLAttributes } from 'react';

type TrackedContactLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  source?: string;
};

export default function TrackedContactLink({ source = 'whatsapp', onClick, ...props }: TrackedContactLinkProps) {
  return <a {...props} onClick={event => {
    trackContact({ source });
    onClick?.(event);
  }} />;
}
