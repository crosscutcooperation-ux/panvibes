'use client';
import Image from 'next/image';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type Part='video'|'journey'|'globe'|'fonts';
type LoadingContext={ staticView:boolean; report:(part:Part,value:number)=>void; fail:(message:string)=>void };
const Context=createContext<LoadingContext|null>(null);
export function useHomeLoading(){const value=useContext(Context);if(!value)throw new Error('Home animation needs its loading boundary');return value;}

export default function HomeExperience({children}:{children:ReactNode}){
  const [parts,setParts]=useState({video:0,journey:0,globe:0,fonts:0});
  const [error,setError]=useState('');
  const [staticView,setStaticView]=useState(false);
  const content=useRef<HTMLDivElement>(null);
  const report=useCallback((part:Part,value:number)=>setParts(previous=>previous[part]===value?previous:{...previous,[part]:Math.max(0,Math.min(1,value))}),[]);
  const fail=useCallback((message:string)=>setError(message),[]);
  const value=useMemo(()=>({staticView,report,fail}),[staticView,report,fail]);
  const loading=!staticView&&Object.values(parts).some(value=>value<1);
  const percent=Math.floor((parts.video*.55+parts.journey*.35+parts.globe*.07+parts.fonts*.03)*100);
  useEffect(()=>{let cancelled=false;document.fonts.ready.then(()=>{if(!cancelled)report('fonts',1);});return()=>{cancelled=true;};},[report]);
  useEffect(()=>{
    if(!loading){const frame=requestAnimationFrame(()=>ScrollTrigger.refresh());return()=>cancelAnimationFrame(frame);}
    const html=document.documentElement,previous=html.style.overflow;
    html.style.overflow='hidden';
    const surfaces=[content.current,...document.querySelectorAll<HTMLElement>('.site-header,.support-dock,.enquiry-global-button')].filter((element):element is HTMLElement=>!!element);
    const inert=surfaces.map(element=>element.inert);surfaces.forEach(element=>{element.inert=true;});
    return()=>{html.style.overflow=previous;surfaces.forEach((element,index)=>{element.inert=inert[index];});};
  },[loading]);
  return <Context.Provider value={value}>
    <div ref={content} className="home-experience" data-home-ready={!loading}>{children}</div>
    {loading&&<div className="home-loader" role="dialog" aria-modal="true" aria-labelledby="home-loader-title">
      <div className="home-loader-inner">
        <Image src="/images/panvibes-logo-ffad64e4ba54.webp" width={240} height={90} alt="PanVibes Exim" loading="eager" fetchPriority="high" unoptimized/>
        <p className="home-loader-eyebrow">Quality · Trust · Global</p>
        <h2 id="home-loader-title">Preparing your journey.</h2>
        <p className="home-loader-message" role="status">{error||'Getting the opening film and journey ready for smooth scrolling.'}</p>
        <div className="home-loader-progress" role="progressbar" aria-label="Loading the animation" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}><span style={{transform:`scaleX(${percent/100})`}}/></div>
        <span className="home-loader-percent" aria-hidden="true">{percent}%</span>
        {error&&<div className="home-loader-actions"><button type="button" onClick={()=>window.location.reload()}>Retry loading</button><button type="button" onClick={()=>setStaticView(true)}>Continue without animation</button></div>}
      </div>
    </div>}
    <noscript><style>{'.home-loader{display:none!important}'}</style></noscript>
  </Context.Provider>;
}
