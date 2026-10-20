'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

function LoadingView({path}:{path:string}) {
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    // The admin has its own loading state and must not inherit a hidden
    // overlay's scroll lock. Media is never allowed to block the whole site.
    if(path.startsWith('/admin'))return;
    let timer:ReturnType<typeof setTimeout>;
    const previousOverflow=document.documentElement.style.overflow;
    document.documentElement.style.overflow='hidden';
    const start=performance.now();
    const inspect=()=>{
      const elapsed=performance.now()-start;
      // Phones show the loader briefly; a video/3D asset
      // must never hold the whole page behind a loading overlay on slow data.
      let ready=document.fonts.status==='loaded';
      if(path==='/'){
        const hero=document.querySelector<HTMLElement>('.home-video-stage');
        ready=ready&&((document.querySelector<HTMLVideoElement>('.home-hero-video')?.readyState??0)>=2||hero?.dataset.videoState==='fallback'||matchMedia('(prefers-reduced-motion: reduce)').matches);
      }
      if(path==='/about')ready=ready&&!!document.querySelector('logistics-about')?.shadowRoot?.querySelector('canvas');
      if(path==='/products')ready=ready&&document.querySelector<HTMLElement>('.product-stage')?.dataset.assetsReady==='true';
      if(path==='/contact')ready=ready&&!!document.querySelector('.globe-ready');
      if(path==='/services')ready=ready&&[...document.querySelectorAll<HTMLImageElement>('main img')].filter(img=>img.fetchPriority==='high').every(img=>img.complete);
      if((ready&&elapsed>=350)||elapsed>=1500){document.documentElement.style.overflow=previousOverflow;setLoading(false);return;}
      timer=setTimeout(inspect,100);
    };
    timer=setTimeout(inspect,100);
    return()=>{clearTimeout(timer);document.documentElement.style.overflow=previousOverflow;};
  },[path]);
  if(!loading||path.startsWith('/admin'))return null;
  return <div className="route-loader" role="status" aria-live="polite"><Image src="/images/panvibes-logo-transparent.png" alt="" width={210} height={80} unoptimized/><p>PanVibes Exim</p><div className="loader-line" aria-hidden="true"><i/></div><span>Preparing your view</span></div>;
}

export default function RouteLoader(){
  const pathname=usePathname();
  return <LoadingView key={pathname} path={pathname}/>;
}
