'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { company, navigation } from "@/lib/site-content";
import { Brand, Pill } from "./ui";
import { initialHeaderScroll, nextHeaderScroll } from '@/lib/header-scroll';
import { enquiryContact } from '@/lib/enquiry-contact';
import { startHeaderContrast } from '@/lib/header-contrast';
export default function Navbar() {
  const [menuOpen,setMenuOpen]=useState(false);
  const menuButton=useRef<HTMLButtonElement>(null);
  const headerRef=useRef<HTMLElement>(null);
  const pathname=usePathname();
  const isActive=(href:string)=>href==='/'?pathname==='/':pathname===href||pathname.startsWith(`${href}/`);
  useEffect(()=>{
    const header=headerRef.current!;
    const scrollY=()=>Math.max(0,Math.min(window.scrollY,Math.max(0,document.documentElement.scrollHeight-innerHeight)));
    let state=initialHeaderScroll(scrollY()),frame=0;
    header.dataset.hidden='false';
    const update=()=>{
      frame=0;
      state=nextHeaderScroll(state,scrollY(),menuOpen||Boolean(header.querySelector(':focus-visible')));
      header.dataset.hidden=String(state.hidden&&!matchMedia('(max-width:991px)').matches);
    };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
    const reveal=()=>{state=initialHeaderScroll(scrollY());header.dataset.hidden='false';};
    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',schedule);
    header.addEventListener('focusin',reveal);
    return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);header.removeEventListener('focusin',reveal);};
  },[pathname,menuOpen]);
  useEffect(()=>{
    if(!menuOpen)return;
    const previousOverflow=document.documentElement.style.overflow;
    document.documentElement.style.overflow='hidden';
    const focusFrame=requestAnimationFrame(()=>headerRef.current?.querySelector<HTMLAnchorElement>('.site-mobile-menu a')?.focus());
    const close=(event:KeyboardEvent)=>{
      if(event.key==='Escape'){setMenuOpen(false);menuButton.current?.focus();}
      if(event.key==='Tab'){
        const controls=[...headerRef.current!.querySelectorAll<HTMLElement>('.header-brand,.site-menu-toggle,.site-mobile-menu a')];
        const first=controls[0],last=controls.at(-1);
        if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
        else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
      }
    };
    const outside=(event:PointerEvent)=>{if(!headerRef.current?.contains(event.target as Node))setMenuOpen(false);};
    const wide=matchMedia('(min-width:1101px)');
    const resize=()=>{if(wide.matches)setMenuOpen(false);};
    window.addEventListener('keydown',close);
    document.addEventListener('pointerdown',outside);wide.addEventListener('change',resize);
    return()=>{cancelAnimationFrame(focusFrame);document.documentElement.style.overflow=previousOverflow;window.removeEventListener('keydown',close);document.removeEventListener('pointerdown',outside);wide.removeEventListener('change',resize);};
  },[menuOpen]);
  useEffect(()=>startHeaderContrast(headerRef.current!,menuOpen),[pathname,menuOpen]);
  return (
    <header ref={headerRef} className="site-header home-header unified-header" data-tone="blue" data-route={pathname} data-menu-open={menuOpen}>
      <svg width="0" height="0" aria-hidden="true" style={{position:'absolute'}}><defs><filter id="panvibes-light-logo" colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 1  -0.62 0 0 0 1  -0.80 0 0 0 1  0 0 0 1 0"/></filter></defs></svg>
      <div className="news-bar"><span>PanVibes: International export-import organization</span></div>
      <div className="header-main">
        <Link href="/" className="header-brand" aria-label="PanVibes home" onClick={()=>setMenuOpen(false)}><Brand /></Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map(item=><Link href={item.href} key={item.href} aria-current={isActive(item.href)?'page':undefined}>{item.label}</Link>)}
        </nav>
        <button ref={menuButton} className="site-menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="site-mobile-menu" onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?'Close':'Menu'} <span aria-hidden="true"><svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d={menuOpen?'M5 5l10 10M15 5 5 15':'M4 5h12M4 10h12M4 15h12'}/></svg></span></button>
        <div className="header-documents">
          <Pill className="pill-white" href={company.brochure} newTab>Download E-brochure</Pill>
          <Pill className="pill-white" href={company.profile} newTab>Company profile</Pill>
        </div>
      </div>
      <nav id="site-mobile-menu" className="site-mobile-menu" aria-label="Mobile navigation" hidden={!menuOpen}>
        {navigation.map(item=><Link href={item.href} key={item.href} aria-current={isActive(item.href)?'page':undefined} onClick={()=>setMenuOpen(false)}>{item.label}<span aria-hidden="true">↗</span></Link>)}
        <div className="mobile-documents"><a href={company.brochure} target="_blank" rel="noopener noreferrer">Download E-brochure ↗</a><a href={company.profile} target="_blank" rel="noopener noreferrer">Company profile ↗</a><a className="mobile-whatsapp" href={`https://wa.me/${enquiryContact.phone}`} target="_blank" rel="noopener noreferrer">WhatsApp ↗</a></div>
      </nav>
    </header>
  );
}
