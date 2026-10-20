'use client';

import { useEffect } from 'react';
import { startContentReveals } from './animations/content-reveals';
import { startApartCards } from './animations/apart-cards';
import { whenNear } from '@/lib/when-near';

export default function ClientEffects() {
  useEffect(() => {
    let active = true;
    let cleanup = [];
    const crane=document.querySelector('logistics-crane');
    const stopCrane=crane?whenNear(crane,()=>{
      import('./animations/crane-section').catch(error=>console.error('Unable to start crane animation',error));
    },Math.max(1200,window.innerHeight*2)):()=>{};
    async function start() {
      await import('./animations/about-us');
      if (!active) return;
      cleanup = [startContentReveals(), startApartCards()];
    }
    start().catch(error => console.error('Unable to start About animations', error));
    return () => { active = false; stopCrane(); cleanup.forEach(stop => stop?.()); };
  }, []);
  return null;
}
