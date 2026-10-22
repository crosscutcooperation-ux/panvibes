'use client';
import NextLink, { useLinkStatus } from 'next/link';
import { createPortal } from 'react-dom';
import type { ComponentProps } from 'react';

function PendingNavigation(){
  const {pending}=useLinkStatus();
  return pending?createPortal(<div className="navigation-loading" role="status" aria-live="polite"><span className="navigation-spinner" aria-hidden="true"/><span>Loading PanVibes…</span></div>,document.body):null;
}

// Track the framework's real navigation lifecycle, including cancellation and
// rapid successive links. Cached instant transitions need no cosmetic delay.
export default function SiteLink({children,...props}:ComponentProps<typeof NextLink>){
  return <NextLink {...props}>{children}<PendingNavigation/></NextLink>;
}
