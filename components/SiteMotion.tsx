"use client";
import { useEffect, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ServiceDetails from './ServiceDetails';
gsap.registerPlugin(ScrollTrigger);
export default function SiteMotion({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Native wheel, keyboard and touch scrolling share one position. Each
    // scene keeps its own scrub easing without a second scroll controller
    // pulling externally changed scroll positions back to its old target.
    let cancelled = false;
    const refresh = () => { if (!cancelled) ScrollTrigger.refresh(); };
    document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => {
      cancelled = true;
      window.removeEventListener("load", refresh);
    };
  }, []);
  return <ServiceDetails><div className="site-root">{children}</div></ServiceDetails>;
}
