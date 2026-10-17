'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import mapPoints from '@/lib/footer-map-points.json';

export default function FooterParticleMap() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current, canvas = canvasRef.current;
    if (!host || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const particles = mapPoints.map(([u,v]) => ({u,v,x:0,y:0,vx:0,vy:0}));
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0, height = 0, frame = 0, lastTime = 0, visible = false;
    const pointer = {x:0,y:0,active:false};

    function paint(now: number) {
      if (!ctx || !canvas) return;
      frame = 0;
      const step = lastTime ? Math.min((now-lastTime)/16.67,2) : 1;
      lastTime = now;
      const radius = Math.max(45, Math.min(width*.22,100));
      const damping = Math.pow(.82,step);
      let unsettled = false;
      ctx.clearRect(0,0,width,height);
      ctx.fillStyle = '#104e87';
      ctx.beginPath();
      for (const p of particles) {
        const homeX=p.u*width, homeY=p.v*height;
        if (!motion.matches) {
          if (pointer.active) {
            const dx=p.x-pointer.x, dy=p.y-pointer.y, distance=Math.hypot(dx,dy);
            if (distance<radius) {
              const force=Math.pow(1-distance/radius,2)*2.4*step;
              p.vx+=(distance>.1?dx/distance:Math.cos(p.u*100))*force;
              p.vy+=(distance>.1?dy/distance:Math.sin(p.u*100))*force;
            }
          }
          p.vx=(p.vx+(homeX-p.x)*.025*step)*damping;
          p.vy=(p.vy+(homeY-p.y)*.025*step)*damping;
          p.x+=p.vx*step; p.y+=p.vy*step;
        } else { p.x=homeX; p.y=homeY; p.vx=p.vy=0; }
        if (Math.abs(p.x-homeX)+Math.abs(p.y-homeY)+Math.abs(p.vx)+Math.abs(p.vy)>.04) unsettled=true;
        const size=Math.max(.65,Math.min(width/700,1.35));
        ctx.moveTo(p.x+size,p.y); ctx.arc(p.x,p.y,size,0,Math.PI*2);
      }
      ctx.fill();
      if (visible && !document.hidden && !motion.matches && (pointer.active||unsettled)) frame=requestAnimationFrame(paint);
      else lastTime=0;
    }
    function wake() { if (!frame && visible && !document.hidden) frame=requestAnimationFrame(paint); }
    function resize() {
      if (!host || !canvas || !ctx) return;
      cancelAnimationFrame(frame); frame=0; lastTime=0;
      const bounds=host.getBoundingClientRect(); width=bounds.width; height=bounds.height;
      const ratio=Math.min(devicePixelRatio,2);
      canvas.width=Math.round(width*ratio); canvas.height=Math.round(height*ratio);
      ctx.setTransform(ratio,0,0,ratio,0,0);
      for (const p of particles) {p.x=p.u*width;p.y=p.v*height;p.vx=p.vy=0;}
      paint(performance.now()); host.dataset.ready='true';
    }
    function move(event: PointerEvent) {
      if (!host || motion.matches) return;
      const rect=host.getBoundingClientRect();
      pointer.x=event.clientX-rect.left; pointer.y=event.clientY-rect.top; pointer.active=true; wake();
    }
    function leave() { pointer.active=false; wake(); }
    function release(event: PointerEvent) { if(event.pointerType==='touch') leave(); }
    function visibility() { if (document.hidden) {cancelAnimationFrame(frame);frame=0;lastTime=0;} else wake(); }
    const sizing=new ResizeObserver(resize);
    const intersection=new IntersectionObserver(([entry])=>{
      visible=entry.isIntersecting;
      if (visible) wake(); else {pointer.active=false;cancelAnimationFrame(frame);frame=0;lastTime=0;}
    });
    sizing.observe(host); intersection.observe(host); resize();
    host.addEventListener('pointermove',move); host.addEventListener('pointerleave',leave);
    host.addEventListener('pointercancel',leave); host.addEventListener('pointerup',release);
    document.addEventListener('visibilitychange',visibility); motion.addEventListener('change',resize);
    return () => {
      sizing.disconnect(); intersection.disconnect(); cancelAnimationFrame(frame);
      host.removeEventListener('pointermove',move);host.removeEventListener('pointerleave',leave);host.removeEventListener('pointercancel',leave);
      host.removeEventListener('pointerup',release);
      document.removeEventListener('visibilitychange',visibility);motion.removeEventListener('change',resize);
      delete host.dataset.ready;
    };
  }, []);

  return <div className="footer-particle-map" ref={hostRef}>
    <Image className="footer-map-fallback" src="/images/world-map.png" alt="" width={1204} height={610}/>
    <canvas ref={canvasRef} role="img" aria-label="Interactive world map — dots repel from the pointer and return to their positions"/>
  </div>;
}
