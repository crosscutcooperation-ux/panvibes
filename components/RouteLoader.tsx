'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

function LoadingView({path}:{path:string}) {
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    let frame=0;
    const previousOverflow=document.documentElement.style.overflow;
    document.documentElement.style.overflow='hidden';
    const start=performance.now();
    const inspect=()=>{
      const elapsed=performance.now()-start;
      // Phones show the loader briefly; a video/3D asset
      // must never hold the whole page behind a loading overlay on slow data.
      if(window.matchMedia('(max-width: 991px), (pointer: coarse)').matches && elapsed>350){
        document.documentElement.style.overflow=previousOverflow;setLoading(false);return;
      }
      let ready=document.fonts.status==='loaded';
      if(path==='/')ready=ready&&(document.querySelector<HTMLVideoElement>('.home-hero-video')?.readyState??0)>=2;
      if(path==='/about')ready=ready&&!!document.querySelector('logistics-about')?.shadowRoot?.querySelector('canvas');
      if(path==='/products')ready=ready&&document.querySelector<HTMLElement>('.product-stage')?.dataset.assetsReady==='true';
      if(path==='/contact')ready=ready&&!!document.querySelector('.globe-ready');
      if(path==='/services')ready=ready&&[...document.querySelectorAll<HTMLImageElement>('main img')].filter(img=>img.fetchPriority==='high').every(img=>img.complete);
      if((ready&&elapsed>350)||elapsed>6500){document.documentElement.style.overflow=previousOverflow;setLoading(false);return;}
      frame=requestAnimationFrame(inspect);
    };
    frame=requestAnimationFrame(inspect);
    return()=>{cancelAnimationFrame(frame);document.documentElement.style.overflow=previousOverflow;};
  },[path]);
  if(!loading)return null;
  return <div className="route-loader" role="status" aria-live="polite"><div className="loader-mark" aria-hidden="true">p<span>↗</span></div><p>PanVibes Exim</p><div className="loader-line" aria-hidden="true"><i/></div><span>Preparing your view</span></div>;
}

export default function RouteLoader(){
  const pathname=usePathname();
  return <LoadingView key={pathname} path={pathname}/>;
}
