'use client';

import { useEffect, useRef } from 'react';

// Artwork: Floating Ship Animated Cursor, supplied by the user.
// Original creator: Sweezy Cursors (https://sweezy-cursors.com/).
export default function ShipCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current!;
    const root = document.documentElement;
    const mouse = matchMedia('(any-hover: hover) and (any-pointer: fine)');
    const sprite = new Image();
    const pointer = new Image();
    let ready = false, disposed = false, x = 0, y = 0, seen = false, frame = 0;
    let target: Element | null = null, hitTest = false;

    const hide = () => {
      cursor.hidden = true;
      delete root.dataset.shipCursor;
    };

    const update = (target: Element | null) => {
      if (!ready || !mouse.matches || !seen || document.hidden || !target) {
        hide();
        return;
      }
      // Keep native text carets and resize handles, and use the supplied PNG
      // cursor inside native dialogs, whose top layer covers document overlays.
      if (target.closest('input,textarea,[contenteditable]:not([contenteditable="false"]),[role="textbox"],:disabled,[aria-disabled="true"]')) {
        hide();
        return;
      }
      if (target.closest('dialog[open]')) {
        cursor.hidden = true;
        root.dataset.shipCursor = 'dialog';
        return;
      }
      const interactive = !!target.closest('a,button,summary,select,[role="button"],[role="link"],label[for]');
      const variant = interactive ? 'pointer' : 'ship';
      if (cursor.dataset.variant !== variant) cursor.dataset.variant = variant;
      const hotX = interactive ? 6.125 : 4.375;
      const hotY = interactive ? 7.875 : .875;
      cursor.style.transform = `translate3d(${x-hotX}px,${y-hotY}px,0)`;
      cursor.hidden = false;
      if (root.dataset.shipCursor !== 'active') root.dataset.shipCursor = 'active';
    };

    const schedule = () => {
      if (frame || disposed) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (hitTest) target = seen ? document.elementFromPoint(x,y) : null;
        hitTest = false; update(target);
      });
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') { seen = false; hide(); return; }
      seen = true; x = event.clientX; y = event.clientY;
      target = event.target instanceof Element ? event.target : null;hitTest = false;schedule();
    };
    const refresh = () => { if (!seen) return; hitTest = true; schedule(); };
    const leave = () => { seen = false; hide(); };
    const press = (event: PointerEvent) => {
      if(event.pointerType === 'mouse') cursor.dataset.pressed = 'true';
    };
    const release = () => { delete cursor.dataset.pressed; };
    const loaded = () => {
      if(disposed) return;
      ready = sprite.complete && sprite.naturalWidth > 0 && pointer.complete && pointer.naturalWidth > 0;
      refresh();
    };
    sprite.onload = loaded; pointer.onload = loaded;
    sprite.onerror = hide; pointer.onerror = hide;
    sprite.src = '/cursors/ship-sprite.webp';
    pointer.src = '/cursors/ship-pointer.png';
    window.addEventListener('pointermove',move,{passive:true});
    document.addEventListener('pointerleave',leave);
    window.addEventListener('blur',leave);
    window.addEventListener('scroll',refresh,{passive:true,capture:true});
    window.addEventListener('pointerdown',press,{passive:true});
    window.addEventListener('pointerup',release,{passive:true});
    window.addEventListener('pointercancel',release,{passive:true});
    document.addEventListener('visibilitychange',refresh);
    mouse.addEventListener('change',refresh);

    return () => {
      disposed = true; cancelAnimationFrame(frame); hide();
      sprite.onload = null; pointer.onload = null; sprite.onerror = null; pointer.onerror = null;
      window.removeEventListener('pointermove',move);
      document.removeEventListener('pointerleave',leave);
      window.removeEventListener('blur',leave);
      window.removeEventListener('scroll',refresh,true);
      window.removeEventListener('pointerdown',press);
      window.removeEventListener('pointerup',release);
      window.removeEventListener('pointercancel',release);
      document.removeEventListener('visibilitychange',refresh);
      mouse.removeEventListener('change',refresh);
    };
  },[]);

  return <div ref={cursorRef} className="ship-cursor" aria-hidden="true" hidden><span className="ship-cursor-art" /></div>;
}
