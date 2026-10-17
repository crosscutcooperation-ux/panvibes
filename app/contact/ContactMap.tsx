'use client';
import { useEffect, useState } from 'react';
import Globe from '@/components/Globe';
import { officeLocation } from '@/lib/office-location';
const officeEmbed='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3147.123378816829!2d73.01078787425185!3d19.078838751885296!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c168b615608d%3A0xc4724ace45d87091!2sAkshar%20Business%20Park!5e1!3m2!1sen!2sin!4v1762769523621!5m2!1sen!2sin';
export default function ContactMap(){
  const [phase,setPhase]=useState<'globe'|'zooming'|'map'>('globe');
  const [mapReady,setMapReady]=useState(false);
  useEffect(()=>{if(phase!=='zooming')return;const timer=window.setTimeout(()=>setPhase('map'),matchMedia('(prefers-reduced-motion: reduce)').matches?50:officeLocation.mapRevealDelayMs);return()=>clearTimeout(timer);},[phase]);
  return <div className="contact-atlas" data-map-phase={phase}><div className="atlas-top mono"><span>PanVibes / Global connections</span><span>IN ↗</span></div>
    <Globe variant="contact" focusOffice={phase!=='globe'} active={phase!=='map'}/>
    {phase!=='globe'&&<div className="atlas-map-layer"><iframe title="PanVibes head office at Akshar Business Park" src={officeEmbed} onLoad={()=>setMapReady(true)} allowFullScreen referrerPolicy="no-referrer-when-downgrade"/>{!mapReady&&<div className="atlas-map-loading" role="status">Opening office map…</div>}</div>}
    <div className="atlas-bottom"><div><p className="mono">Our home. Your global partner.</p><strong>Navi Mumbai, India</strong><span>{phase==='map'?'Akshar Business Park, Vashi':'A world of possibilities. Within reach.'}</span></div><button type="button" disabled={phase==='zooming'} aria-busy={phase==='zooming'} onClick={()=>{if(phase==='map'){setPhase('globe');setMapReady(false);}else setPhase('zooming');}}>{phase==='map'?'3D globe':phase==='zooming'?'Zooming to office…':'Office map'} <span>↗</span></button></div>
  </div>;
}
