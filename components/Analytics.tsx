'use client';

import Script from 'next/script';
import { useEffect, useState, useSyncExternalStore } from 'react';
import './cookie-consent.css';

const configuredGaId = process.env.NEXT_PUBLIC_GA_ID;
const configuredPixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
const GA_ID = configuredGaId && /^G-[A-Z0-9]{4,20}$/.test(configuredGaId) ? configuredGaId : undefined;
const PIXEL_ID = configuredPixelId && /^\d{5,20}$/.test(configuredPixelId) ? configuredPixelId : undefined;
const storageKey = 'panvibes-cookie-consent-v1';
const consentLifetime = 180 * 24 * 60 * 60 * 1000;
type Choice = { analytics: boolean; advertising: boolean };

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('panvibes:consent-change', callback);
  return () => { window.removeEventListener('storage', callback); window.removeEventListener('panvibes:consent-change', callback); };
}
function snapshot() { try { return localStorage.getItem(storageKey); } catch { return null; } }
function serverSnapshot() { return 'loading'; }
function storedChoice(raw: string | null): Choice | null {
  try {
    const saved = JSON.parse(raw || 'null');
    return saved?.version === 1 && typeof saved.analytics === 'boolean' && typeof saved.advertising === 'boolean' && typeof saved.savedAt === 'number' && Date.now() - saved.savedAt < consentLifetime
      ? { analytics: saved.analytics, advertising: saved.advertising } : null;
  } catch { return null; }
}

function removeTrackingCookies() {
  const names = document.cookie.split(';').map(part => part.trim().split('=')[0]).filter(name => /^(_ga|_gid|_gat|_fbp|_fbc)(_|$)/.test(name));
  const host = window.location.hostname;
  const domains = [host, `.${host}`];
  for (const name of names) {
    document.cookie = `${name}=; Max-Age=0; path=/`;
    for (const domain of domains) document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}`;
  }
}

export default function Analytics() {
  const raw = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const [sessionChoice, setSessionChoice] = useState<Choice | null>(null);
  const choice = sessionChoice || storedChoice(raw);
  const [draft, setDraft] = useState<Choice>({ analytics: false, advertising: false });
  const [manualOpen, setManualOpen] = useState(false);
  const open = raw !== 'loading' && (manualOpen || choice === null);

  useEffect(() => {
    const show = () => { setDraft(choice || { analytics: false, advertising: false }); setManualOpen(true); };
    window.addEventListener('panvibes:cookie-settings', show);
    return () => window.removeEventListener('panvibes:cookie-settings', show);
  }, [choice]);

  function save(next: Choice) {
    const withdrawn = (choice?.analytics && !next.analytics) || (choice?.advertising && !next.advertising);
    try { localStorage.setItem(storageKey, JSON.stringify({ version: 1, ...next, savedAt: Date.now() })); window.dispatchEvent(new Event('panvibes:consent-change')); } catch { /* Preference remains active for this visit. */ }
    setSessionChoice(next); setDraft(next); setManualOpen(false);
    if (withdrawn) { removeTrackingCookies(); window.location.reload(); }
  }

  return <>
    {choice?.analytics && GA_ID && <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', ${JSON.stringify(GA_ID)});
      `}</Script>
    </>}
    {choice?.advertising && PIXEL_ID && <Script id="fb-pixel" strategy="afterInteractive">{`
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window,document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', ${JSON.stringify(PIXEL_ID)});
      fbq('track', 'PageView');
    `}</Script>}
    {open && <section className="cookie-consent" aria-label="Cookie choices">
      <div><strong>Your privacy choices</strong><p>We use optional analytics and advertising cookies only if you allow them. You can change your choice at any time. <a href="/privacy">Read our Privacy Policy</a>.</p></div>
      <div className="cookie-consent-options">
        <label><input type="checkbox" checked={draft.analytics} onChange={event => setDraft(current => ({ ...current, analytics: event.target.checked }))} /> Analytics (Google Analytics 4)</label>
        <label><input type="checkbox" checked={draft.advertising} onChange={event => setDraft(current => ({ ...current, advertising: event.target.checked }))} /> Advertising (Meta Pixel)</label>
      </div>
      <div className="cookie-consent-actions"><button type="button" onClick={() => save({ analytics: false, advertising: false })}>Reject optional</button><button type="button" onClick={() => save(draft)}>Save choices</button><button type="button" onClick={() => save({ analytics: true, advertising: true })}>Accept all</button></div>
    </section>}
  </>;
}
