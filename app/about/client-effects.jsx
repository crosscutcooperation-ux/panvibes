'use client';

import { useEffect } from 'react';
import { startContentReveals } from './animations/content-reveals';
import { startApartCards } from './animations/apart-cards';

export default function ClientEffects() {
  useEffect(() => {
    let active = true;
    let cleanup = [];
    async function start() {
      await Promise.all([import('./animations/about-us'), import('./animations/crane-section')]);
      if (!active) return;
      cleanup = [startContentReveals(), startApartCards()];
    }
    start().catch(error => console.error('Unable to start About animations', error));
    return () => { active = false; cleanup.forEach(stop => stop?.()); };
  }, []);
  return null;
}
