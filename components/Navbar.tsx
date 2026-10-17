'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { company, navigation } from "@/lib/site-content";
import { Brand, Pill } from "./ui";
import { initialHeaderScroll, nextHeaderScroll } from '@/lib/header-scroll';
import { enquiryContact } from '@/lib/enquiry-contact';
export default function Navbar() {
  const [light,setLight]=useState(false);
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
        const controls=[...headerRef.current!.querySelectorAll<HTMLElement>('.header-brand,.mobile-quick-links a,.site-menu-toggle,.site-mobile-menu a')];
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
  useEffect(()=>{
    let frame=0;
    const update=()=>{
      frame=0;
      const x=innerWidth/2,y=Math.min(85,innerHeight/4);
      const sections=[...document.querySelectorAll<HTMLElement>('[data-header-theme="light"],logistics-about,logistics-crane,.apart-section,.product-stage,.motion-orbit,.motion-service-track')];
      const overDark=sections.some(section=>{const box=section.getBoundingClientRect();return getComputedStyle(section).visibility!=='hidden'&&box.height>0&&box.top<=y&&box.bottom>y&&box.left<=x&&box.right>=x;});
      const hero=document.querySelector<HTMLElement>('.home-video-stage');
      const journey=document.querySelector<HTMLElement>('.trade-journey-v2');
      if(pathname==='/'&&hero&&hero.getBoundingClientRect().bottom>y){setLight(hero.style.getPropertyValue('--hero-nav-text')!=='#104e87');}
      else if(pathname==='/'&&journey&&journey.getBoundingClientRect().top<=y&&journey.getBoundingClientRect().bottom>y){setLight(Number(journey.dataset.phase??0)>=16);}
      else setLight(overDark);
    };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
    schedule();window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);window.addEventListener('panvibes:header-tone',schedule);
    const observer=new MutationObserver(schedule);observer.observe(document.body,{childList:true,subtree:true});
    return()=>{cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);window.removeEventListener('panvibes:header-tone',schedule);};
  },[pathname]);
  return (
    <header ref={headerRef} className="site-header home-header unified-header" data-tone={light?'light':'blue'} data-route={pathname} data-menu-open={menuOpen}>
      <div className="news-bar"><span>PanVibes: International export-import organization</span></div>
      <div className="header-main">
        <Link href="/" className="header-brand" aria-label="PanVibes home" onClick={()=>setMenuOpen(false)}><Brand /></Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map(item=><Link href={item.href} key={item.href} aria-current={isActive(item.href)?'page':undefined}>{item.label}</Link>)}
        </nav>
        <nav className="mobile-quick-links" aria-label="Mobile quick links">
          <Link href="/products" aria-current={isActive('/products')?'page':undefined} onClick={()=>setMenuOpen(false)}>Products</Link>
          <Link href="/blog" aria-current={isActive('/blog')?'page':undefined} onClick={()=>setMenuOpen(false)}>Blog</Link>
          <a className="header-whatsapp" href={`https://wa.me/${enquiryContact.phone}`} target="_blank" rel="noopener noreferrer" aria-label="Chat with PanVibes on WhatsApp" title="WhatsApp"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 11.6a8 8 0 0 1-11.9 7L4 20l1.4-4.1A8 8 0 1 1 20 11.6Z" stroke="currentColor" strokeWidth="1.6"/><path d="M9 7.7c-.6-.3-1.4.6-1.2 1.5.4 2.2 3.5 5.4 5.8 5.9.9.2 1.9-.7 1.6-1.3l-1.5-1c-.4-.2-.8.6-1.2.5-.8-.2-2.5-1.9-2.7-2.8-.1-.4.7-.8.5-1.2L9 7.7Z" fill="currentColor"/></svg></a>
        </nav>
        <button ref={menuButton} className="site-menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="site-mobile-menu" onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?'Close':'Menu'} <span aria-hidden="true">{menuOpen?'−':'+'}</span></button>
        <div className="header-documents">
          <Pill className="pill-white" href={company.brochure}>Download E-brochure</Pill>
          <Pill className="pill-white" href={company.profile}>Company profile</Pill>
        </div>
      </div>
      <nav id="site-mobile-menu" className="site-mobile-menu" aria-label="Mobile navigation" hidden={!menuOpen}>
        {navigation.map(item=><Link href={item.href} key={item.href} aria-current={isActive(item.href)?'page':undefined} onClick={()=>setMenuOpen(false)}>{item.label}<span aria-hidden="true">↗</span></Link>)}
        <div className="mobile-documents"><a href={company.brochure}>Download E-brochure ↗</a><a href={company.profile}>Company profile ↗</a></div>
      </nav>
    </header>
  );
}
