'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mix, segment, smooth, tippingTruck } from '@/lib/journey-motion';
import brandedAssets from '@/lib/container-branding-assets.json';
import { handoffTruck, heroFilm, videoTruckBounds } from '@/lib/hero-handoff';
import { company } from '@/lib/site-content';
gsap.registerPlugin(ScrollTrigger);

export default function ScrollVideoHero({children}:{children:ReactNode}) {
  const rootRef=useRef<HTMLElement>(null),stageRef=useRef<HTMLDivElement>(null),videoRef=useRef<HTMLVideoElement>(null);
  useEffect(()=>{
    const media=gsap.matchMedia();
    media.add({compact:'(max-width: 991px)',wide:'(min-width: 992px)',reduced:'(prefers-reduced-motion: reduce)'},context=>{
    const root=rootRef.current!,stage=stageRef.current!,video=videoRef.current!;
    const copy=stage.querySelector<HTMLElement>('.hero-copy')!;
    const email=stage.querySelector<HTMLAnchorElement>('.hero-email')!;
    const header=document.querySelector<HTMLElement>('.site-header')!;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const compact=Boolean(context.conditions?.compact);
    video.src='/media/home-hero/gemini_generated_video_282720c2.mp4';
    video.preload='auto';
    const sample=document.createElement('canvas');sample.width=48;sample.height=28;
    const ctx=sample.getContext('2d',{willReadFrequently:true})!;
    const layer=document.createElement('canvas');layer.className='home-handoff-truck';layer.setAttribute('aria-hidden','true');document.body.appendChild(layer);
    const truckContext=layer.getContext('2d')!;
    const truck=new Image();truck.src=(brandedAssets as Record<string,string>)[handoffTruck.src]||handoffTruck.src;
    const plate=stage.querySelector<HTMLElement>('.home-handoff-plate')!;
    const plateImage=new Image();plateImage.src='/media/home-hero/handoff-clean-plate.webp';
    let trigger:ScrollTrigger|undefined,bridge:ScrollTrigger|undefined,frame=0,emailFrame=0,progress=0,disposed=false,lastContrastAt=-Infinity;
    function queueEmailPosition(){cancelAnimationFrame(emailFrame);emailFrame=requestAnimationFrame(()=>{emailFrame=0;if(!disposed)positionEmail();});}
    function positionEmail(){
      const html=document.documentElement,stageBox=stage.getBoundingClientRect();
      const visible=stageBox.top<innerHeight&&stageBox.bottom>0;
      const videoStyle=getComputedStyle(video);
      const emailBox=email.getBoundingClientRect();
      const showing=visible&&emailBox.top<innerHeight&&emailBox.bottom>0&&(progress<.94||Number(videoStyle.opacity)>.01);
      email.inert=!showing;email.tabIndex=showing?0:-1;
      const position=showing?emailBox:null;
      if(!position){delete html.dataset.heroEmail;return;}
      html.dataset.heroEmail='active';
      // Let the assistant move above the shortcut if their hit areas intersect.
      const bot=document.querySelector<HTMLElement>('.support-launcher');
      const botWidth=bot?.offsetWidth??125,botHeight=bot?.offsetHeight??56;
      const overlaps=position.left+position.width>innerWidth-botWidth-32&&position.top+position.height>innerHeight-botHeight-32;
      html.style.setProperty('--hero-support-lift',`${overlaps?Math.max(0,innerHeight-22-position.top+12):0}px`);
      const enquiry=document.querySelector<HTMLElement>('.enquiry-global-button');
      if(enquiry){
        const box=enquiry.getBoundingClientRect(),previousLift=parseFloat(html.style.getPropertyValue('--hero-enquiry-lift'))||0;
        const originalTop=box.top+previousLift;
        let top=originalTop;
        const obstacles=[{left:position.left,right:position.left+position.width,top:position.top,bottom:position.top+position.height},...(bot?[bot.getBoundingClientRect()]:[])].sort((a,b)=>b.bottom-a.bottom);
        for(const obstacle of obstacles)if(box.right>obstacle.left&&box.left<obstacle.right&&top+box.height>obstacle.top&&top<obstacle.bottom)top=obstacle.top-box.height-12;
        html.style.setProperty('--hero-enquiry-lift',`${Math.max(0,originalTop-top)}px`);
      }
    }
    function handoff(){
      const w=stage.clientWidth,h=stage.clientHeight;
      if(disposed||!w||!h){layer.style.visibility='hidden';return;}
      const after=trigger?segment(window.scrollY,trigger.end,trigger.end+Math.max(h,innerHeight)):0;
      const ready=truck.complete&&truck.naturalWidth>0&&plateImage.complete&&plateImage.naturalWidth>0;
      // Every screen must decode the actual final frame before the cutout
      // takes over; a delayed native-file seek must never cut the film short.
      const finalFrame=Math.max(0,Math.round(video.duration*heroFilm.frameRate)-1);
      const finalDecoded=video.readyState>=2&&!video.seeking&&video.currentTime>=finalFrame/heroFilm.frameRate-.001;
      stage.dataset.videoComplete=String(finalDecoded);
      const separation=ready&&finalDecoded&&!reduced.matches?smooth(segment(progress,.86,.94)):0;
      stage.dataset.truckOwner=separation>0?'handoff':'video';
      plate.style.opacity=String(separation);video.style.opacity=String(1-separation);email.style.opacity=String(1-separation);
      const active=separation>0&&after<1;
      layer.style.visibility=active?'visible':'hidden';layer.style.opacity=String(separation);
      document.documentElement.dataset.truckHandoff=active&&after>0?'active':'idle';
      if(!active)return;
      const ratio=Math.min(devicePixelRatio,1.75),viewportHeight=innerHeight;
      if(layer.width!==Math.round(w*ratio)||layer.height!==Math.round(viewportHeight*ratio)){layer.width=Math.round(w*ratio);layer.height=Math.round(viewportHeight*ratio);}
      truckContext.setTransform(ratio,0,0,ratio,0,0);truckContext.clearRect(0,0,w,viewportHeight);
      const box=video.getBoundingClientRect(),stageBox=stage.getBoundingClientRect();
      const cover=getComputedStyle(video).objectFit==='cover';
      const scale=cover?Math.max(box.width/heroFilm.width,box.height/heroFilm.height):Math.min(box.width/heroFilm.width,box.height/heroFilm.height);
      const originX=box.left-stageBox.left+(box.width-heroFilm.width*scale)/2;
      const originY=box.top-stageBox.top+(box.height-heroFilm.height*scale)/2;
      const startX=originX+(videoTruckBounds.x+videoTruckBounds.width/2)*scale;
      const startY=stageBox.top+originY+(videoTruckBounds.y+videoTruckBounds.height/2)*scale;
      const startLength=videoTruckBounds.height*scale;
      const landing=smooth(segment(progress,.90,1)),pose=tippingTruck(0,w,viewportHeight);
      const length=startLength;
      const x=mix(startX,pose.x,landing),y=mix(mix(startY,viewportHeight*.54,landing),pose.y,after);
      const width=length*handoffTruck.width/handoffTruck.height;
      truckContext.drawImage(truck,handoffTruck.x,handoffTruck.y,handoffTruck.width,handoffTruck.height,x-width/2,y-length/2,width,length);
      layer.dataset.truckX=x.toFixed(2);layer.dataset.truckY=y.toFixed(2);layer.dataset.truckLength=length.toFixed(2);
    }
    function contrast(force=false){
      if(disposed||video.readyState<2||!video.videoWidth||!video.videoHeight||!Number.isFinite(video.duration)||video.duration<=0)return;
      // Keep the road introduction white; blend into brand blue only as the
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
      // Seek inside the frame rather than onto its timestamp boundary. This
      // also lets the original file reliably decode its final video frame
      // when its audio track lasts a few milliseconds longer than the picture.
      if(Math.floor(video.currentTime*heroFilm.frameRate+.00001)!==targetFrame)video.currentTime=(targetFrame+.5)/heroFilm.frameRate;
    }
    function queue(){if(!frame&&!disposed)frame=requestAnimationFrame(seek);}
    function update(p:number){
      progress=p;stage.dataset.heroProgress=p.toFixed(3);
      stage.style.setProperty('--hero-header-height',`${header.offsetHeight}px`);
      // Move the copy away from the truck's final lower-left position.
      copy.style.transform=!compact?`translateX(${stage.clientWidth*.49*smooth(segment(p,.30,.68))}px)`:'';
      queue();handoff();positionEmail();queueEmailPosition();
    }
    function ready(){video.pause();queue();contrast();handoff();}
    function sought(){contrast();queue();handoff();positionEmail();}
    function configure(){
      trigger?.kill(true);bridge?.kill();trigger=undefined;video.pause();update(0);
      const reserveFollowingSection=()=>{root.style.paddingBottom=reduced.matches?'0px':`${Math.max(0,innerHeight-stage.clientHeight)}px`;};
      reserveFollowingSection();
      // Keep the 16:9 frame in place through the entire film and fade. The
      // following section cannot enter until this scroll sequence completes.
      if(!reduced.matches)trigger=ScrollTrigger.create({id:'panvibes-video-hero',trigger:root,pin:stage,pinType:'transform',start:0,
        end:()=>`+=${Math.max(stage.clientHeight,innerHeight)*(compact?3:4)}`,invalidateOnRefresh:true,onRefreshInit:reserveFollowingSection,onUpdate:self=>update(self.progress),onRefresh:self=>{root.dataset.scrollStart=String(self.start);root.dataset.scrollEnd=String(self.end);update(self.progress);}});
      if(trigger)bridge=ScrollTrigger.create({trigger:root,start:()=>trigger!.end,end:()=>trigger!.end+Math.max(stage.clientHeight,innerHeight),
        invalidateOnRefresh:true,onUpdate:handoff,onRefresh:handoff});
      if(trigger){root.dataset.scrollStart=String(trigger.start);root.dataset.scrollEnd=String(trigger.end);}
    }
    const resize=new ResizeObserver(()=>{update(progress);contrast(true);});resize.observe(stage);
    // Pin transforms can settle after refresh and font callbacks. Track those
    // geometry changes so the email shortcut follows the final painted frame.
    const positioning=new MutationObserver(queueEmailPosition);
    positioning.observe(root,{subtree:true,attributes:true,attributeFilter:['style']});
    window.addEventListener('scroll',queueEmailPosition,{passive:true});
    ScrollTrigger.addEventListener('refresh',queueEmailPosition);
    truck.onload=handoff;plateImage.onload=handoff;
    video.addEventListener('loadedmetadata',ready);video.addEventListener('loadeddata',ready);video.addEventListener('seeked',sought);
    video.addEventListener('transitionend',positionEmail);
    reduced.addEventListener('change',configure);configure();
    document.fonts.ready.then(()=>{if(!disposed){ScrollTrigger.refresh();queueEmailPosition();}});
    return()=>{disposed=true;cancelAnimationFrame(frame);cancelAnimationFrame(emailFrame);resize.disconnect();positioning.disconnect();trigger?.kill(true);bridge?.kill();video.pause();layer.remove();
      truck.onload=null;plateImage.onload=null;delete document.documentElement.dataset.truckHandoff;
      window.removeEventListener('scroll',queueEmailPosition);ScrollTrigger.removeEventListener('refresh',queueEmailPosition);delete document.documentElement.dataset.heroEmail;
      ['left','top','width','height'].forEach(key=>document.documentElement.style.removeProperty(`--hero-mail-${key}`));document.documentElement.style.removeProperty('--hero-support-lift');document.documentElement.style.removeProperty('--hero-enquiry-lift');
      video.removeEventListener('loadedmetadata',ready);video.removeEventListener('loadeddata',ready);video.removeEventListener('seeked',sought);
      video.removeEventListener('transitionend',positionEmail);
      reduced.removeEventListener('change',configure);copy.style.transform='';root.style.removeProperty('padding-bottom');
      [video,plate].forEach(node=>['width','height','left','top'].forEach(property=>node.style.removeProperty(property)));};
    });
    return()=>media.revert();
  },[]);
  return <section ref={rootRef} className="hero home-video-hero" id="home" aria-labelledby="hero-title">
    <div ref={stageRef} className="hero-stage home-video-stage">
      <video ref={videoRef} className="home-hero-video" poster="/media/home-hero/hero-panvibes-1020-poster.jpg" preload="none" muted playsInline disablePictureInPicture aria-label="PanVibes-branded truck travelling through India. Scroll to move the truck."/>
      <div className="home-handoff-plate" aria-hidden="true"/>
      {children}
      <a className="hero-email" href={`mailto:${company.email}?subject=${encodeURIComponent('B2B product enquiry — PanVibes Exim')}`} aria-label="Email PanVibes export sales" title={`Email ${company.email}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg></a>
    </div>
  </section>;
}
