"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Globe from "./Globe";
import { Tempo } from "./TransportVisuals";
import { Arrow } from "./ui";
import { company, stats, services, industries, destinations } from "@/lib/site-content";
import { JOURNEY_DURATION, JOURNEY_SCREENS, mix, segment, smooth, roadPresentation, shipHandoff } from "@/lib/journey-motion";
import { brandTheme } from "@/lib/brand-theme";
import { useServiceDetails } from './ServiceDetails';
import EnquiryButton from './EnquiryButton';
import { whenNear } from '@/lib/when-near';
import { useHomeLoading } from './HomeExperience';
import { prepareJourneyDownloads } from '@/lib/home-assets';
import { preparedAsset } from '@/lib/prepared-assets';
import { createJourneyScene } from '@/lib/journey-scene';

gsap.registerPlugin(ScrollTrigger);
export default function Journey() {
  const openDetails=useServiceDetails();
  const root=useRef<HTMLElement>(null);
  const vehicleHost=useRef<HTMLDivElement>(null);
  const [globeActive,setGlobeActive]=useState(false);
  const [assetsReady,setAssetsReady]=useState(false);
  const {staticView,report,fail}=useHomeLoading();
  const globePrepared=useCallback((ready:boolean)=>report('globe',ready?1:0),[report]);
  const globeFallback=useCallback(()=>report('globe',1),[report]);
  useEffect(()=>{
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
    const compact=window.matchMedia('(max-width: 991px), (pointer: coarse)');
    const run=()=>{
    const el=root.current!, host=vehicleHost.current!;
    let cancelled=false, active=false;report('journey',0);setAssetsReady(false);
    const downloads=new AbortController();
    let dispose=()=>{};
    if(reduced.matches||staticView){
      report('journey',1);report('globe',1);
      const stopAssets=whenNear(el,()=>setAssetsReady(true),Math.max(1200,window.innerHeight*2));
      const observer=new IntersectionObserver(([entry])=>setGlobeActive(entry.isIntersecting));
      observer.observe(el.querySelector(".motion-orbit")!);
      return()=>{stopAssets();observer.disconnect();};
    }
    function setup(){
      let scene:ReturnType<typeof import('@/lib/journey-scene').createJourneyScene>|undefined;
      let releaseAssets:(()=>void)|undefined;
      el.classList.add("continuous-motion");
      const stage=el.querySelector<HTMLElement>(".motion-stage")!;
      const paper=el.querySelector<HTMLElement>(".motion-paper")!;
      const lane=el.querySelector<HTMLElement>(".arrival-lane")!;
      const statRows=[...el.querySelectorAll<HTMLElement>(".motion-stat")];
      const track=el.querySelector<HTMLElement>(".motion-service-track")!;
      const serviceFloor=el.querySelector<HTMLElement>(".motion-service-floor")!;
      const road=el.querySelector<SVGSVGElement>(".motion-road")!;
      const roadPaths=[...road.querySelectorAll<SVGPathElement>("path")];
      const industry=el.querySelector<HTMLElement>(".motion-industries")!;
      const industryTrack=el.querySelector<HTMLElement>(".motion-industry-track")!;
      const ocean=el.querySelector<HTMLElement>(".motion-ocean")!;
      const oceanTexture=el.querySelector<HTMLElement>(".motion-ocean-texture")!;
      const ship=el.querySelector<HTMLElement>(".motion-ship")!;
      const globe=el.querySelector<HTMLElement>(".motion-globe")!;
      const worldCopy=el.querySelector<HTMLElement>(".motion-world-copy")!;
      const clouds=[...el.querySelectorAll<HTMLElement>(".motion-cloud")];
      const progress=el.querySelector<HTMLElement>(".motion-progress i")!;
      const progressLabel=el.querySelector<HTMLElement>(".motion-progress")!;
      let layout={w:0,h:0,statHeight:0,rowSteps:[] as number[],trackWidth:0,industryHeight:0};
      const measure=()=>{
        const w=stage.clientWidth,h=stage.clientHeight;
        const rowSteps=statRows.map(row=>row.offsetHeight+Math.min(40,h*.045));
        layout={w,h,rowSteps,statHeight:rowSteps.reduce((total,step)=>total+step,0),trackWidth:track.scrollWidth,industryHeight:industryTrack.scrollHeight};
      };
      measure();
      const clock={time:0};
      const draw=()=>{
        const t=clock.time,{w,h,statHeight,rowSteps,trackWidth,industryHeight}=layout;
        const compact=w<=991;
        el.dataset.phase=t.toFixed(2);
        lane.style.transform=`translateY(${-h*1.7*smooth(segment(t,6,8))}px)`;
        let statY=h*.52-segment(t,0,6.3)*(statHeight+h*.52);
        statRows.forEach((row,index)=>{row.style.transform=`translateY(${statY}px)`;statY+=rowSteps[index];});
        // A phone blends into the ocean as one surface, rather than lifting
        // two white side panels across the ship and its container.
        const paperExit=smooth(segment(t,compact?32.9:33.25,compact?33.6:33.95));
        paper.style.transform=compact?'none':`translateY(${-h*paperExit}px)`;
        paper.style.opacity=String(compact?1-paperExit:1);
        const floorTop=mix(1,.32,smooth(segment(t,16,compact?17.1:17.5)));
        serviceFloor.style.top=`${floorTop*100}%`;
        serviceFloor.style.height=`${mix(.68,.28,smooth(segment(t,24,26)))*100}%`;
        serviceFloor.style.transform=`translateY(${-h*1.3*smooth(segment(t,26,28))}px)`;
        serviceFloor.style.visibility=t<24?"visible":"hidden";
        const trackIn=smooth(segment(t,compact?16:17,compact?17.1:18));
        const trackTop=h<500&&w>h?.41:.39;
        track.style.top=compact?`${(floorTop+trackTop-.32)*100}%`:'';
        const trackTravel=segment(t,18,23.7)*(trackWidth-w+w*.045);
        track.style.transform=`translate(${w*(1-trackIn)-trackTravel-w*1.2*smooth(segment(t,23.7,25))}px,0)`;
        track.style.visibility=t>=16&&t<26?"visible":"hidden";
        road.style.visibility=t>=24?"visible":"hidden";
        // Truck and road use the same circular bend and tangent angle.
        const bendY=-h*1.6*smooth(segment(t,28,29));
        const bendLayout=roadPresentation(t,w,h);
        const bend=`M ${-w} ${bendLayout.y} L ${bendLayout.x} ${bendLayout.y} A ${bendLayout.radius} ${bendLayout.radius} 0 0 1 ${bendLayout.endX} ${bendLayout.y+bendLayout.radius} L ${bendLayout.endX} ${h*4}`;
        roadPaths.forEach((path,i)=>{
          path.setAttribute("d",bend);
          path.setAttribute("stroke-width",String(i===0?bendLayout.laneWidth:i===1?bendLayout.laneWidth-4:i===2?bendLayout.laneWidth-10:2));
        });
        road.style.transform=`translate(0,${bendY}px)`;
        roadPaths[3].style.strokeDashoffset=String(-t*100);
        industry.style.transform=`translateY(${h*(1-smooth(segment(t,28,29)))-h*1.4*smooth(segment(t,31.8,33.2))}px)`;
        industry.style.visibility=t>=27.5&&t<33.5?"visible":"hidden";
        industryTrack.style.transform=`translateY(${-segment(t,29,31.8)*(industryHeight-h*.75)}px)`;
        // As the chassis rolls away, its container stays centred on the ship's deck.
        const fullShipZoom=Math.min(.135,h*.78/w*731/3579);
        const handoff=shipHandoff(t,w,h);
        const shipZoom=Math.exp(mix(Math.log(1),Math.log(fullShipZoom),smooth(segment(t,33.95,35.8))))*(1-smooth(segment(t,36,37.5)));
        ship.style.width=`${t<33.95?handoff.shipWidth:w*shipZoom}px`;
        ship.style.left=`${w*.5+(t<33.95?handoff.shipWidth*(.5-364.5/731):w*shipZoom*(.5-364.5/731))}px`;
        ship.style.top=`${t<33.95?handoff.y:h*.5}px`;
        ship.style.transform=`translate(-50%,-50%)`;
        oceanTexture.style.opacity=String(1-smooth(segment(t,35.1,36)));
        ocean.style.visibility=t<37.5?"visible":"hidden";
        globe.style.transform=`scale(${mix(2.4,1,smooth(segment(t,35.7,38)))})`;
        worldCopy.style.transform=`translateX(${w*(1-smooth(segment(t,37,38.5)))}px)`;
        clouds.forEach((cloud,i)=>{
          const p=segment(t,35,37.6); const x=(i===0?-1:1)*w*mix(.85,-.1,segment(t,35,36));
          cloud.style.visibility=p>0&&p<1?"visible":"hidden";
          cloud.style.opacity=String(compact?.3*Math.sin(Math.PI*p):1);
          cloud.style.transform=`translate(${x+(i===0?-1:1)*w*2*smooth(segment(t,36,37.6))}px,${-h*.1}px) scale(${mix(1,2,p)})`;
        });
        progress.style.transform=`scaleX(${t/JOURNEY_DURATION})`;
        progressLabel.style.color=(t>=16.1&&t<28)||t>=33?"#fff":brandTheme.blue;
        const nextActive=t>34.5;
        if(active!==nextActive){active=nextActive;setGlobeActive(active);}
        // Avoid a second renderer once the sea has shrunk beyond a pixel.
        host.style.visibility=t<34?"visible":"hidden";
        if(t<34)scene?.draw(t,w,h);
        stage.dataset.layout=compact?"compact":"wide";
      };
      const animation=gsap.to(clock,{time:JOURNEY_DURATION,ease:"none",onUpdate:draw,
        scrollTrigger:{id:"panvibes-journey",trigger:el,pin:stage,start:"top top",end:()=>"+="+stage.clientHeight*(compact.matches?19:JOURNEY_SCREENS),scrub:compact.matches?.25:.35,invalidateOnRefresh:true,onRefresh:self=>{el.dataset.scrollStart=String(self.start);el.dataset.scrollEnd=String(self.end);measure();draw();}}});
      const resize=new ResizeObserver(()=>{measure();draw();});[stage,track,industryTrack,...statRows].forEach(node=>resize.observe(node));
      draw();ScrollTrigger.refresh();
      let stalled:ReturnType<typeof setTimeout>;
      const heartbeat=()=>{clearTimeout(stalled);stalled=setTimeout(()=>{downloads.abort();if(!cancelled)fail('Loading paused because the connection stopped. Retry, or continue with the still view.');},30000);};
      heartbeat();
      async function prepare(){
        try{
          releaseAssets=await prepareJourneyDownloads(compact.matches,downloads.signal,value=>{heartbeat();report('journey',value*.9);});
          if(cancelled){releaseAssets();return;}
          scene=createJourneyScene(host);await scene.prepare();
          if(cancelled)return;
          setAssetsReady(true);
          await new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())));
          await Promise.all([...stage.querySelectorAll<HTMLImageElement>('img')].map(image=>image.decode()));
          if(cancelled)return;
          await document.fonts.ready;
          measure();ScrollTrigger.refresh();draw();el.dataset.sceneReady='true';report('journey',1);
        }catch{if(!cancelled)fail('Some journey assets could not be prepared. Retry, or continue with the still view.');}
        finally{clearTimeout(stalled);}
      }
      void prepare();
      if(animation.scrollTrigger){el.dataset.scrollStart=String(animation.scrollTrigger.start);el.dataset.scrollEnd=String(animation.scrollTrigger.end);}
      const revealServices=()=>{const trigger=animation.scrollTrigger;if(trigger){ScrollTrigger.refresh();window.scrollTo({top:trigger.start+(trigger.end-trigger.start)*18/JOURNEY_DURATION,behavior:'instant'});}};
      window.addEventListener('panvibes:services',revealServices);
      document.fonts.ready.then(()=>{if(!cancelled&&new URLSearchParams(window.location.search).get('section')==='services')revealServices();});
      dispose=()=>{
        clearTimeout(stalled);downloads.abort();window.removeEventListener('panvibes:services',revealServices);resize.disconnect();animation.scrollTrigger?.kill();animation.kill();scene?.dispose();releaseAssets?.();el.classList.remove('continuous-motion');delete el.dataset.sceneReady;
        // Leaving the desktop breakpoint must also remove the scene's inline
        // transforms/visibility, otherwise its natural mobile content stays hidden.
        [lane,...statRows,paper,track,serviceFloor,road,industry,industryTrack,ocean,oceanTexture,ship,globe,worldCopy,...clouds,progress,host].forEach(node=>{
          ['transform','visibility','opacity','top','height','width','left'].forEach(property=>node.style.removeProperty(property));
        });
        delete el.dataset.phase;delete stage.dataset.layout;
      };
    }
    try{setup();}catch(error){console.error('Journey rendering unavailable',error);}
    return()=>{cancelled=true;dispose();};
    };
    let stop=run();
    const configure=()=>{stop();stop=run();ScrollTrigger.refresh();};
    compact.addEventListener('change',configure);reduced.addEventListener('change',configure);
    return()=>{stop();compact.removeEventListener('change',configure);reduced.removeEventListener('change',configure);};
  },[staticView,report,fail]);
  return (
    <section className="trade-journey-v2" ref={root} data-assets-ready={assetsReady||undefined} aria-label="The PanVibes journey">
      <div className="motion-stage">
        <section className="motion-orbit" aria-labelledby="transit-title">
          <div className="motion-stars" />
          <div className="motion-globe"><Globe active={globeActive} prepare={!staticView} onPrepared={globePrepared} onFailure={globeFallback}/></div>
          <div className="motion-world-copy">
            <p className="eyebrow">PanVibes Exim</p>
            <p className="transit-description">We ship only to India, the UK, the USA, Europe and the UAE.</p>
            <h2 id="transit-title">Total transit<br/>guidelines.</h2>
            <div className="transit-destinations mono">{destinations.map(([name])=><span key={name}>{name}</span>)}</div>
            <div className="transit-count"><strong>{stats[2].value}{stats[2].suffix && <sup>{stats[2].suffix}</sup>}</strong><span>{stats[2].label}</span></div>
          </div>
        </section>
        <div className="motion-ocean" aria-hidden="true">
          <div className="motion-ocean-texture"/>
          <div className="motion-ship">{assetsReady&&<Image src={preparedAsset("/images/branded/ship.webp")} width={731} height={3579} alt="" loading="eager" unoptimized/>}</div>
        </div>
        <div className="motion-paper" aria-hidden="true">
          <div className="arrival-lane"><div/></div>
          <div className="motion-service-floor"><div/></div>
          <svg className="motion-road" width="100%" height="100%" overflow="visible">
            <path fill="none" stroke="#80a8ca"/><path fill="none" stroke={brandTheme.deepBlue}/><path fill="none" stroke={brandTheme.blue}/><path fill="none" stroke="#b8d1e6" strokeDasharray="24 44"/>
          </svg>
        </div>
        <div className="motion-stats" aria-label="PanVibes in numbers">
          <div className="static-tempo"><Tempo/></div>
          {stats.map(stat=><div className="motion-stat" key={stat.label}><p>{stat.value}<sup>{stat.suffix}</sup></p><span>{stat.label}</span><div className="motion-stat-description">{stat.description}</div></div>)}
        </div>
        <div className="motion-service-track" aria-labelledby="services-title">
          <div className="motion-service-intro"><p className="eyebrow">Our services / 01—05</p><h2 id="services-title">Your vision.<br/>Our expert<br/>execution.</h2><p>{company.heroDescription}</p><EnquiryButton className="pill pill-outline" purpose="Bulk quotation">Request a Quote</EnquiryButton></div>
          {services.map((service,i)=><article className="motion-service-card" key={service.title.join(" ")}>
            <div className="motion-service-top"><span className="mono">0{i+1}</span>{assetsReady&&<Image src={preparedAsset("/images/"+service.image)} width={200} height={150} alt="" loading="eager" unoptimized/>}</div>
            <h3><button type="button" className="service-title-button" onClick={()=>openDetails(i)}>{service.title[0]}<br/>{service.title[1]}</button></h3><p className="motion-service-overview">{service.overview}</p><p>{service.description}</p><span className="mono motion-features">{service.features}</span><button type="button" onClick={()=>openDetails(i)} className="text-link mono">View details & enquire<Arrow diagonal/></button>
          </article>)}
        </div>
        <section className="motion-industries" aria-labelledby="industries-title">
          <div className="motion-industry-title"><p className="eyebrow">PanVibes Exim</p><h2 id="industries-title">Industries<br/>we serve.</h2><p className="motion-industry-introduction">{company.industryIntroduction}</p><p className="motion-industry-note">{company.overview[2]}</p></div>
          <div className="motion-industry-track">{industries.map((industry,i)=><article className="motion-industry-card" key={industry.name}><div className="motion-industry-photo">{assetsReady&&<Image src={preparedAsset("/images/"+industry.image)} alt={industry.name} fill sizes="(max-width: 767px) 43vw, 33vw" loading="eager" unoptimized/>}<span className="mono">0{i+1}</span><h3>{industry.name}</h3></div><p>{industry.description}</p></article>)}</div>
        </section>
        <div className="motion-vehicles" ref={vehicleHost} aria-hidden="true"/>
        <div className="motion-cloud motion-cloud-left" aria-hidden="true">{assetsReady&&<Image src={preparedAsset("/images/cloud-left.avif")} alt="" width={1400} height={1400} loading="eager" unoptimized/>}</div>
        <div className="motion-cloud motion-cloud-right" aria-hidden="true">{assetsReady&&<Image src={preparedAsset("/images/cloud-right.avif")} alt="" width={1400} height={1400} loading="eager" unoptimized/>}</div>
        <div className="motion-progress mono" aria-hidden="true"><span>PanVibes Exim</span><div><i/></div><span>Scroll to explore ↓</span></div>
      </div>
    </section>
  );
}
