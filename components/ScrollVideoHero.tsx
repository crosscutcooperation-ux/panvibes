'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mix, segment, smooth, tippingTruck } from '@/lib/journey-motion';
import brandedAssets from '@/lib/container-branding-assets.json';
import { handoffTruck, heroFilm, videoTruckBounds } from '@/lib/hero-handoff';
gsap.registerPlugin(ScrollTrigger);

export default function ScrollVideoHero({children}:{children:ReactNode}) {
  const rootRef=useRef<HTMLElement>(null),stageRef=useRef<HTMLDivElement>(null),videoRef=useRef<HTMLVideoElement>(null);
  useEffect(()=>{
    const media=gsap.matchMedia();
    media.add({compact:'(max-width: 991px)',wide:'(min-width: 992px)',reduced:'(prefers-reduced-motion: reduce)'},context=>{
    const root=rootRef.current!,stage=stageRef.current!,video=videoRef.current!;
    const copy=stage.querySelector<HTMLElement>('.hero-copy')!;
    const header=document.querySelector<HTMLElement>('.site-header')!;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const compact=Boolean(context.conditions?.compact);
    video.src=compact?'/media/home-hero/hero-mobile-scroll.mp4':'/media/home-hero/hero-1016-smooth.mp4';
    video.preload='auto';
    const sample=document.createElement('canvas');sample.width=48;sample.height=28;
    const ctx=sample.getContext('2d',{willReadFrequently:true})!;
    const layer=document.createElement('canvas');layer.className='home-handoff-truck';layer.setAttribute('aria-hidden','true');document.body.appendChild(layer);
    const truckContext=layer.getContext('2d')!;
    const truck=new Image();truck.src=(brandedAssets as Record<string,string>)[handoffTruck.src]||handoffTruck.src;
    const plate=stage.querySelector<HTMLElement>('.home-handoff-plate')!;
    const plateImage=new Image();plateImage.src='/media/home-hero/handoff-clean-plate.webp';
    let trigger:ScrollTrigger|undefined,bridge:ScrollTrigger|undefined,frame=0,progress=0,disposed=false,lastContrastAt=-Infinity;
    function handoff(){
      const w=stage.clientWidth,h=stage.clientHeight;
      if(disposed||!w||!h){layer.style.visibility='hidden';return;}
      const after=trigger?segment(window.scrollY,trigger.end,trigger.end+h):0;
      const ready=truck.complete&&truck.naturalWidth>0&&plateImage.complete&&plateImage.naturalWidth>0;
      // Phones may finish a seek after the scroll event. Transfer ownership
      // only once the matching final frame is decoded, so two trucks never blend.
      const finalDecoded=video.readyState>=2&&!video.seeking&&video.currentTime/video.duration>=.98;
      const separation=ready&&!reduced.matches?(compact?(progress>=.86&&finalDecoded?1:0):smooth(segment(progress,.86,.90))):0;
      stage.dataset.truckOwner=separation>0?'handoff':'video';
      plate.style.opacity=String(separation);video.style.opacity=String(1-separation);
      const active=separation>0&&after<1;
      layer.style.visibility=active?'visible':'hidden';layer.style.opacity=String(separation);
      document.documentElement.dataset.truckHandoff=active&&after>0?'active':'idle';
      if(!active)return;
      const ratio=Math.min(devicePixelRatio,1.75);
      if(layer.width!==Math.round(w*ratio)||layer.height!==Math.round(h*ratio)){layer.width=Math.round(w*ratio);layer.height=Math.round(h*ratio);}
      truckContext.setTransform(ratio,0,0,ratio,0,0);truckContext.clearRect(0,0,w,h);
      const box=video.getBoundingClientRect(),stageBox=stage.getBoundingClientRect();
      const cover=getComputedStyle(video).objectFit==='cover';
      const scale=cover?Math.max(box.width/heroFilm.width,box.height/heroFilm.height):Math.min(box.width/heroFilm.width,box.height/heroFilm.height);
      const originX=box.left-stageBox.left+(box.width-heroFilm.width*scale)/2;
      const originY=box.top-stageBox.top+(box.height-heroFilm.height*scale)/2;
      const startX=originX+(videoTruckBounds.x+videoTruckBounds.width/2)*scale;
      const startY=originY+(videoTruckBounds.y+videoTruckBounds.height/2)*scale;
      const startLength=videoTruckBounds.height*scale;
      const landing=smooth(segment(progress,.90,1)),pose=tippingTruck(0,w,h);
      const length=startLength;
      const x=mix(startX,pose.x,landing),y=mix(mix(startY,h*.54,landing),pose.y,after);
      const width=length*handoffTruck.width/handoffTruck.height;
      truckContext.drawImage(truck,handoffTruck.x,handoffTruck.y,handoffTruck.width,handoffTruck.height,x-width/2,y-length/2,width,length);
      layer.dataset.truckX=x.toFixed(2);layer.dataset.truckY=y.toFixed(2);layer.dataset.truckLength=length.toFixed(2);
    }
    function contrast(force=false){
      if(disposed||video.readyState<2||!video.videoWidth||!video.videoHeight||!Number.isFinite(video.duration)||video.duration<=0)return;
      // Keep the desert introduction white; blend into brand blue only as the
      // supplied film dissolves into the pale overhead scene. Use the decoded
      // frame's time so the copy follows the picture during reverse seeking.
      const ink=smooth(segment(video.currentTime/video.duration,.68,.80));
      stage.style.setProperty('--hero-copy-color',`rgb(${Math.round(mix(255,16,ink))} ${Math.round(mix(255,78,ink))} ${Math.round(mix(255,135,ink))})`);
      stage.style.setProperty('--hero-shadow-opacity',String(1-ink));
      // Pixel readback stalls the decoder. Copy colour is cheap and follows
      // every presented seek; navigation sampling only needs occasional work.
      const now=performance.now();
      if(!force&&now-lastContrastAt<120)return;
      lastContrastAt=now;
      // Sample the actual displayed frame and element regions, including the
      // letterbox background on narrower viewports. Local footage is origin-safe.
      const w=stage.clientWidth,h=stage.clientHeight;
      const cover=getComputedStyle(video).objectFit==='cover';
      const bounds=video.getBoundingClientRect(),stageBounds=stage.getBoundingClientRect();
      if(!w||!h||!bounds.width||!bounds.height)return;
      const scale=cover?Math.max(bounds.width/video.videoWidth,bounds.height/video.videoHeight):Math.min(bounds.width/video.videoWidth,bounds.height/video.videoHeight);
      const dw=video.videoWidth*scale,dh=video.videoHeight*scale;
      ctx.drawImage(video,0,0,48,28);
      const visibleColumn=Math.max(0,Math.min(47,Math.round((stageBounds.left+w*.5-bounds.left)/bounds.width*48)));
      const edge=ctx.getImageData(compact?visibleColumn:46,0,1,1).data;
      const background=`rgb(${edge[0]},${edge[1]},${edge[2]})`;
      stage.style.setProperty('--hero-background',background);
      // The transparent mobile navigation follows the existing copy transition
      // without a second canvas readback from the video decoder.
      if(compact){
        const tone=ink>.5?'#104e87':'#ffffff';
        if(stage.style.getPropertyValue('--hero-nav-text')!==tone){stage.style.setProperty('--hero-nav-text',tone);window.dispatchEvent(new Event('panvibes:header-tone'));}
        return;
      }
      ctx.fillStyle=background;ctx.fillRect(0,0,48,28);
      ctx.drawImage(video,(bounds.left-stageBounds.left+(bounds.width-dw)/2)/w*48,(bounds.top-stageBounds.top+(bounds.height-dh)/2)/h*28,dw/w*48,dh/h*28);
      const pixels=ctx.getImageData(0,0,48,28).data;
      const linear=(v:number)=>{const c=v/255;return c<=.04045?c/12.92:Math.pow((c+.055)/1.055,2.4);};
      // Navigation adapts independently of the hero copy's timed transition.
      // Sample the header's revealed position while it slides off screen.
      const headerBounds=header.getBoundingClientRect();
      let sum=0,count=0;
      const x0=Math.max(0,Math.floor((headerBounds.left-stageBounds.left)/w*48)),x1=Math.min(48,Math.ceil((headerBounds.right-stageBounds.left)/w*48));
      const y0=Math.max(0,Math.floor(-stageBounds.top/h*28)),y1=Math.min(28,Math.ceil((header.offsetHeight-stageBounds.top)/h*28));
      for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const i=(y*48+x)*4;
        sum+=.2126*linear(pixels[i])+.7152*linear(pixels[i+1])+.0722*linear(pixels[i+2]);count++;
      }
      const luminance=sum/Math.max(count,1),white=1.05/(luminance+.05),blue=(luminance+.05)/.12;
      const tone=white>=blue?'#ffffff':'#104e87';
      if(stage.style.getPropertyValue('--hero-nav-text')!==tone){stage.style.setProperty('--hero-nav-text',tone);window.dispatchEvent(new Event('panvibes:header-tone'));}
    }
    function seek(){
      frame=0;if(disposed||video.seeking||video.readyState<1||!Number.isFinite(video.duration))return;
      // Seek once per distinct encoded frame; always pick the latest scroll
      // position after an in-flight seek instead of building a request backlog.
      const finalFrame=Math.max(0,Math.round(video.duration*heroFilm.frameRate)-1);
      const targetFrame=Math.round(finalFrame*segment(progress,0,.86));
      if(Math.round(video.currentTime*heroFilm.frameRate)!==targetFrame)video.currentTime=targetFrame/heroFilm.frameRate;
    }
    function queue(){if(!frame&&!disposed)frame=requestAnimationFrame(seek);}
    function update(p:number){
      progress=p;stage.dataset.heroProgress=p.toFixed(3);
      stage.style.setProperty('--hero-header-height',`${header.offsetHeight}px`);
      if(compact){
        const w=stage.clientWidth,h=stage.clientHeight;
        const zoom=smooth(segment(p,.48,.86));
        const landscape=w/h>1.6;
        const scale=mix(landscape?Math.max(w/heroFilm.width,h/heroFilm.height):Math.min(h/heroFilm.height,w/660),landscape?Math.max(w/heroFilm.width,h/heroFilm.height):w/heroFilm.width,zoom);
        const width=heroFilm.width*scale,height=heroFilm.height*scale;
        const left=mix(w*.54-width*.57,(w-width)/2,zoom);
        const top=mix(h-height,(h-height)*.5,zoom);
        [video,plate].forEach(node=>{node.style.width=`${width}px`;node.style.height=`${height}px`;node.style.left=`${left}px`;node.style.top=`${top}px`;});
        stage.style.setProperty('--mobile-copy-x',`${w*.38*zoom}px`);
        stage.style.setProperty('--mobile-copy-width',`${w*(.89-.39*zoom)}px`);
        stage.style.setProperty('--mobile-heading-size',`${Math.min(48,w*.106)*(1-.30*zoom)}px`);
      }
      // Move the copy away from the truck's final lower-left position.
      copy.style.transform=!compact?`translateX(${stage.clientWidth*.49*smooth(segment(p,.30,.68))}px)`:'';
      queue();handoff();
    }
    function ready(){video.pause();queue();contrast();handoff();}
    function sought(){contrast();queue();handoff();}
    function configure(){
      trigger?.kill(true);bridge?.kill();trigger=undefined;video.pause();update(0);
      if(!reduced.matches)trigger=ScrollTrigger.create({id:'panvibes-video-hero',trigger:root,pin:stage,start:'top top',
        end:()=>`+=${stage.clientHeight*(compact?3:4)}`,invalidateOnRefresh:true,onUpdate:self=>update(self.progress),onRefresh:self=>{root.dataset.scrollStart=String(self.start);root.dataset.scrollEnd=String(self.end);update(self.progress);}});
      if(trigger)bridge=ScrollTrigger.create({trigger:root,start:()=>trigger!.end,end:()=>trigger!.end+stage.clientHeight,
        invalidateOnRefresh:true,onUpdate:handoff,onRefresh:handoff});
      if(trigger){root.dataset.scrollStart=String(trigger.start);root.dataset.scrollEnd=String(trigger.end);}
    }
    const resize=new ResizeObserver(()=>{update(progress);contrast(true);});resize.observe(stage);
    truck.onload=handoff;plateImage.onload=handoff;
    video.addEventListener('loadedmetadata',ready);video.addEventListener('loadeddata',ready);video.addEventListener('seeked',sought);
    reduced.addEventListener('change',configure);configure();
    document.fonts.ready.then(()=>{if(!disposed)ScrollTrigger.refresh();});
    return()=>{disposed=true;cancelAnimationFrame(frame);resize.disconnect();trigger?.kill(true);bridge?.kill();video.pause();layer.remove();
      truck.onload=null;plateImage.onload=null;delete document.documentElement.dataset.truckHandoff;
      video.removeEventListener('loadedmetadata',ready);video.removeEventListener('loadeddata',ready);video.removeEventListener('seeked',sought);
      reduced.removeEventListener('change',configure);copy.style.transform='';
      [video,plate].forEach(node=>['width','height','left','top'].forEach(property=>node.style.removeProperty(property)));};
    });
    return()=>media.revert();
  },[]);
  return <section ref={rootRef} className="hero home-video-hero" id="home" aria-labelledby="hero-title">
    <div ref={stageRef} className="hero-stage home-video-stage">
      <video ref={videoRef} className="home-hero-video" poster="/media/home-hero/hero-mobile-poster.webp" preload="none" muted playsInline disablePictureInPicture aria-label="Scroll-controlled transport scene. Scroll to move the truck."/>
      <div className="home-handoff-plate" aria-hidden="true"/>
      {children}
    </div>
  </section>;
}
