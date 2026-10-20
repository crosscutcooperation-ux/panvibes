'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mix, segment, smooth, tippingTruck } from '@/lib/journey-motion';
import { handoffTruck, heroFilm, videoTruckBounds, loadHandoffTruck } from '@/lib/hero-handoff';
import videoAssets from '@/lib/hero-video-assets.json';
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
    const connection=(navigator as Navigator&{connection?:{saveData?:boolean;effectiveType?:string}}).connection;
    const lightVideo=compact||connection?.saveData||['slow-2g','2g','3g'].includes(connection?.effectiveType??'');
    const source=lightVideo?videoAssets.mobile.src:videoAssets.desktop.src;
    const notice=stage.querySelector<HTMLElement>('.hero-video-notice')!;
    const message=notice.querySelector<HTMLElement>('span')!;
    const retry=notice.querySelector<HTMLButtonElement>('button')!;
    let failed=false,startupTimer:ReturnType<typeof setTimeout>|undefined,seekTimer:ReturnType<typeof setTimeout>|undefined;
    const sample=document.createElement('canvas');sample.width=48;sample.height=28;
    const ctx=sample.getContext('2d',{willReadFrequently:true})!;
    const layer=document.createElement('canvas');layer.className='home-handoff-truck';layer.setAttribute('aria-hidden','true');document.body.appendChild(layer);
    const truckContext=layer.getContext('2d')!;
    let truck:HTMLImageElement|undefined;
    const plate=stage.querySelector<HTMLElement>('.home-handoff-plate')!;
    let trigger:ScrollTrigger|undefined,bridge:ScrollTrigger|undefined,frame=0,handoffFrame=0,progress=0,disposed=false,lastContrastAt=-Infinity,bridgeEnd=Infinity;
    function handoff(){if(!handoffFrame&&!disposed)handoffFrame=requestAnimationFrame(paintHandoff);}
    function paintHandoff(){
      handoffFrame=0;
      if(disposed)return;
      if(progress<.86||(progress===1&&window.scrollY>=bridgeEnd)){
        layer.style.visibility='hidden';
        document.documentElement.dataset.truckHandoff='idle';
        if(progress<.86&&stage.dataset.truckOwner==='handoff'){
          stage.dataset.truckOwner='video';plate.style.opacity='0';video.style.opacity='1';
        }
        return;
      }
      const w=stage.clientWidth,h=stage.clientHeight;
      if(disposed||!w||!h){layer.style.visibility='hidden';return;}
      const next=document.querySelector<HTMLElement>('.trade-journey-v2');
      const nextStage=next?.querySelector<HTMLElement>('.motion-stage');
      const nextStart=Number(next?.dataset.scrollStart)||((trigger?.end??0)+h);
      bridgeEnd=nextStart;
      const after=trigger?segment(window.scrollY,trigger.end,nextStart):0;
      const ready=!!truck;
      // Phones may finish a seek after the scroll event. Transfer ownership
      // only once the matching final frame is decoded, so two trucks never blend.
      const finalFrame=Math.max(0,Math.round(video.duration*heroFilm.frameRate)-1);
      const finalDecoded=video.readyState>=2&&!video.seeking&&video.currentTime>=finalFrame/heroFilm.frameRate;
      const separation=ready&&finalDecoded&&!reduced.matches?smooth(segment(progress,.86,.90)):0;
      stage.dataset.truckOwner=separation>0?'handoff':'video';
      // Keep the truck opaque while the background changes ownership. Fading
      // both identical truck layers independently makes it look translucent.
      plate.style.opacity=String(separation);video.style.opacity=separation===1?'0':'1';
      const active=separation>0&&after<1;
      layer.style.visibility=active?'visible':'hidden';layer.style.opacity='1';
      document.documentElement.dataset.truckHandoff=active&&after>0?'active':'idle';
      if(!active||!truck)return;
      const ratio=Math.min(devicePixelRatio,1.75);
      if(layer.width!==Math.round(w*ratio)||layer.height!==Math.round(h*ratio)){layer.width=Math.round(w*ratio);layer.height=Math.round(h*ratio);}
      truckContext.setTransform(ratio,0,0,ratio,0,0);truckContext.clearRect(0,0,w,h);
      const box=video.getBoundingClientRect(),stageBox=stage.getBoundingClientRect();
      const cover=getComputedStyle(video).objectFit==='cover';
      const scale=cover?Math.max(box.width/heroFilm.width,box.height/heroFilm.height):Math.min(box.width/heroFilm.width,box.height/heroFilm.height);
      const originX=box.left-stageBox.left+(box.width-heroFilm.width*scale)/2;
      const originY=box.top-stageBox.top+(box.height-heroFilm.height*scale)/2;
      const startX=originX+(videoTruckBounds.x+videoTruckBounds.width/2)*scale;
      // The overlay is fixed to the viewport. Include the pin's real offset,
      // then remove the stage's outgoing scroll translation after unpinning.
      const pinnedTop=stageBox.top+Math.max(0,window.scrollY-(trigger?.end??window.scrollY));
      const startY=pinnedTop+originY+(videoTruckBounds.y+videoTruckBounds.height/2)*scale;
      const startLength=videoTruckBounds.height*scale;
      const nextBox=nextStage?.getBoundingClientRect();
      const landing=smooth(segment(progress,.90,1)),pose=tippingTruck(0,nextStage?.clientWidth??w,nextStage?.clientHeight??h);
      // Meet the following canvas at its measured pin position, including any
      // header offset. Guessing one screen of travel causes a visible jump.
      const targetX=(nextBox?.left??0)+pose.x;
      const targetY=(nextBox?nextBox.top+window.scrollY-nextStart:0)+pose.y;
      const length=mix(startLength,pose.length,landing);
      const x=mix(startX,targetX,landing),y=mix(mix(startY,h*.54,landing),targetY,after);
      const width=length*videoTruckBounds.width/videoTruckBounds.height;
      truckContext.drawImage(truck,handoffTruck.x,handoffTruck.y,handoffTruck.width,handoffTruck.height,x-width/2,y-length/2,width,length);
      layer.dataset.truckX=x.toFixed(2);layer.dataset.truckY=y.toFixed(2);layer.dataset.truckLength=length.toFixed(2);layer.dataset.truckWidth=width.toFixed(2);
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
      frame=0;if(disposed||failed||video.seeking||video.readyState<1||!Number.isFinite(video.duration))return;
      // Seek once per distinct encoded frame; always pick the latest scroll
      // position after an in-flight seek instead of building a request backlog.
      const finalFrame=Math.max(0,Math.round(video.duration*heroFilm.frameRate)-1);
      const targetFrame=Math.round(finalFrame*segment(progress,0,.86));
      // Decode inside each frame rather than its timestamp boundary. Only the
      // latest scroll target is queued, including when the user scrolls back.
      if(video.readyState<2||Math.floor(video.currentTime*heroFilm.frameRate+.00001)!==targetFrame){
        // A stalled seek must not leave a permanently pinned, frozen scene.
        clearTimeout(seekTimer);seekTimer=setTimeout(fallback,10000);
        video.currentTime=(targetFrame+.5)/heroFilm.frameRate;
      }
    }
    function queue(){if(!frame&&!disposed)frame=requestAnimationFrame(seek);}
    function update(p:number){
      const w=stage.clientWidth,h=stage.clientHeight,headerHeight=header.offsetHeight;
      progress=p;stage.dataset.heroProgress=p.toFixed(3);
      stage.style.setProperty('--hero-header-height',`${headerHeight}px`);
      if(compact){
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
      copy.style.transform=!compact?`translateX(${w*.49*smooth(segment(p,.30,.68))}px)`:'';
      queue();handoff();
    }
    function ready(){
      if(failed||disposed)return;
      video.pause();
      if(video.readyState>=2){clearTimeout(startupTimer);stage.dataset.videoState='ready';notice.hidden=true;}
      queue();contrast();handoff();
    }
    function sought(){clearTimeout(seekTimer);ready();}
    function fallback(){
      if(disposed||failed)return;
      failed=true;clearTimeout(startupTimer);clearTimeout(seekTimer);
      video.pause();video.removeAttribute('src');video.load();
      stage.dataset.videoState='fallback';stage.dataset.truckOwner='video';
      plate.style.opacity='0';video.style.opacity='1';layer.style.visibility='hidden';
      stage.style.setProperty('--hero-copy-color','#fff');stage.style.setProperty('--hero-nav-text','#fff');
      stage.style.setProperty('--hero-shadow-opacity','1');
      message.textContent='Preview image';retry.hidden=false;notice.hidden=false;
      configure();ScrollTrigger.refresh();window.dispatchEvent(new Event('panvibes:header-tone'));
    }
    function startVideo(){
      if(disposed)return;
      if(reduced.matches){stage.dataset.videoState='fallback';notice.hidden=true;return;}
      failed=false;stage.dataset.videoState='loading';notice.hidden=false;retry.hidden=true;
      message.textContent='Loading video';video.preload='auto';video.muted=true;video.src=source;
      clearTimeout(startupTimer);startupTimer=setTimeout(fallback,12000);
      // Explicit load is important when choosing the source after hydration.
      // No play/autoplay permission is required for the paused scroll film.
      video.load();
    }
    function tryAgain(){startVideo();configure();ScrollTrigger.refresh();}
    function configure(){
      trigger?.kill(true);bridge?.kill();trigger=undefined;video.pause();update(0);
      if(!reduced.matches&&!failed)trigger=ScrollTrigger.create({id:'panvibes-video-hero',trigger:root,pin:stage,start:'top top',
        end:()=>`+=${stage.clientHeight*(compact?3:4)}`,invalidateOnRefresh:true,onUpdate:self=>update(self.progress),onRefresh:self=>{root.dataset.scrollStart=String(self.start);root.dataset.scrollEnd=String(self.end);update(self.progress);}});
      if(trigger)bridge=ScrollTrigger.create({trigger:root,start:()=>trigger!.end,end:()=>Number(document.querySelector<HTMLElement>('.trade-journey-v2')?.dataset.scrollStart)||trigger!.end+stage.clientHeight,
        invalidateOnRefresh:true,onUpdate:handoff,onRefresh:()=>{bridgeEnd=Infinity;handoff();}});
      if(trigger){root.dataset.scrollStart=String(trigger.start);root.dataset.scrollEnd=String(trigger.end);}
    }
    const resize=new ResizeObserver(()=>{update(progress);contrast(true);});resize.observe(stage);
    loadHandoffTruck()
      .then(image=>{if(!disposed){truck=image;handoff();}})
      .catch(error=>console.error('Hero truck preparation failed',error));
    video.addEventListener('loadedmetadata',ready);video.addEventListener('loadeddata',ready);video.addEventListener('seeked',sought);
    video.addEventListener('error',fallback);retry.addEventListener('click',tryAgain);
    window.addEventListener('scroll',handoff,{passive:true});
    configure();startVideo();
    document.fonts.ready.then(()=>{if(!disposed)ScrollTrigger.refresh();});
    return()=>{disposed=true;clearTimeout(startupTimer);clearTimeout(seekTimer);cancelAnimationFrame(frame);cancelAnimationFrame(handoffFrame);resize.disconnect();trigger?.kill(true);bridge?.kill();video.pause();video.removeAttribute('src');video.load();layer.remove();
      delete document.documentElement.dataset.truckHandoff;
      video.removeEventListener('loadedmetadata',ready);video.removeEventListener('loadeddata',ready);video.removeEventListener('seeked',sought);
      video.removeEventListener('error',fallback);retry.removeEventListener('click',tryAgain);
      window.removeEventListener('scroll',handoff);
      copy.style.transform='';
      [video,plate].forEach(node=>['width','height','left','top'].forEach(property=>node.style.removeProperty(property)));};
    });
    return()=>media.revert();
  },[]);
  return <section ref={rootRef} className="hero home-video-hero" id="home" aria-labelledby="hero-title">
    <div ref={stageRef} className="hero-stage home-video-stage" data-video-state="loading">
      <video ref={videoRef} className="home-hero-video" poster="/media/home-hero/hero-desert-branded-poster.jpg" preload="none" muted playsInline disablePictureInPicture disableRemotePlayback aria-label="Scroll-controlled PanVibes desert truck scene. Scroll to move; stop scrolling to pause."/>
      <div className="home-handoff-plate" aria-hidden="true"/>
      <div className="hero-video-notice" role="status" aria-live="polite"><span>Loading video</span><button type="button" hidden>Retry video</button></div>
      {children}
    </div>
  </section>;
}
