'use client';

import Script from 'next/script';

const configuredGaId = process.env.NEXT_PUBLIC_GA_ID;
const configuredPixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
const GA_ID = configuredGaId && /^G-[A-Z0-9]{4,20}$/.test(configuredGaId) ? configuredGaId : undefined;
const PIXEL_ID = configuredPixelId && /^\d{5,20}$/.test(configuredPixelId) ? configuredPixelId : undefined;

export default function Analytics() {
  return <>
    {GA_ID && <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', ${JSON.stringify(GA_ID)});
      `}</Script>
    </>}
    {PIXEL_ID && <Script id="fb-pixel" strategy="afterInteractive">{`
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
  </>;
}
