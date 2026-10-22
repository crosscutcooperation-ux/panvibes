'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import assets from '@/lib/product-assets.json';

gsap.registerPlugin(ScrollTrigger);

// Fixed seeds make the choreography reproducible in both scroll directions.
const bowls = [
  {label:'Makhana',x:.235,y:.433,row:0,count:90,size:.025},
  {label:'Paneer',x:.502,y:.433,row:0,count:40,size:.037},
  {label:'Ginger',x:.773,y:.433,row:0,count:26,size:.048},
  {label:'Cashews',x:.192,y:.718,row:1,count:95,size:.024},
  {label:'Banana Powder',x:.502,y:.718,row:1,count:24,size:.052},
  {label:'Millets',x:.809,y:.718,row:1,count:120,size:.016},
];
const ingredients = bowls.flatMap((bowl,family)=>Array.from({length:bowl.count},(_,index)=>({
  family,index,
  seed:((index*73+family*137)%101)/101,
  phase:index*2.39996+family*.9,
  radial:Math.sqrt((index+.5)/bowl.count),
}))).sort((a,b)=>Math.sin(a.phase)*a.radial-Math.sin(b.phase)*b.radial);
const clamp=(value:number)=>Math.max(0,Math.min(1,value));
const ease=(value:number)=>value*value*(3-2*value);
let cachedLetterPoints:{x:number;y:number}[]|undefined;

export default function ProductHero() {
  const sectionRef=useRef<HTMLElement>(null);
  const stageRef=useRef<HTMLDivElement>(null);
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const titleRef=useRef<HTMLDivElement>(null);

  useEffect(()=>{
    const section=sectionRef.current, stage=stageRef.current, canvas=canvasRef.current, title=titleRef.current;
    if (!section||!stage||!canvas||!title) return;
    const ctx=canvas.getContext('2d');
    if (!ctx) return;
    let disposed=false, progress=0, width=0, height=0, titleHeight=0, headerHeight=110;
    const header=document.querySelector<HTMLElement>('.site-header');
    let letterTargets:{x:number;y:number}[]=[];
    let wordMask:HTMLCanvasElement|undefined;
    let selectedPoints=cachedLetterPoints;
    const compact=matchMedia('(max-width:991px)');
    const table=stage.querySelector<HTMLElement>('.product-table-scene')!;
    const names=stage.querySelector<HTMLElement>('.product-names')!;
    let wordRect={x:0,y:0,width:0,height:0};
    const sprites=[new window.Image(),new window.Image()];
    sprites.forEach(asset=>asset.decoding='async');
    const motion=matchMedia('(prefers-reduced-motion: reduce)');
    const burstButton=stage.querySelector<HTMLButtonElement>('.product-burst-trigger')!;
    const offsets=ingredients.map(()=>({x:0,y:0,vx:0,vy:0}));
    let hoverFrame=0,hovered=false,burstUntil=0,burstStart=0;
    const pointer={x:0,y:0};
    const requestDraw=()=>{if(!hoverFrame&&!disposed)hoverFrame=requestAnimationFrame(()=>{hoverFrame=0;draw();});};
    const move=(event:PointerEvent)=>{
      if(event.pointerType!=='mouse'||progress<.75||motion.matches)return;
      const rect=stage!.getBoundingClientRect();pointer.x=event.clientX-rect.left;pointer.y=event.clientY-rect.top;
      const inside=pointer.x>=wordRect.x-35&&pointer.x<=wordRect.x+wordRect.width+35&&pointer.y>=wordRect.y-35&&pointer.y<=wordRect.y+wordRect.height+35;
      if(!inside&&!hovered)return;
      if(inside&&!hovered)burstStart=performance.now();hovered=inside;requestDraw();
    };
    const leave=()=>{hovered=false;requestDraw();};
    const replay=()=>{burstStart=performance.now();burstUntil=burstStart+1700;pointer.x=width/2;pointer.y=wordRect.y+wordRect.height/2;requestDraw();};
    stage.addEventListener('pointermove',move);stage.addEventListener('pointerleave',leave);burstButton.addEventListener('click',replay);

    function draw() {
      if (!ctx||!canvas||!stage||!title||disposed) return;
      const now=performance.now();
      ctx.clearRect(0,0,width,height);
      // The same pieces leave the bowls, swirl, and settle into PRODUCTS.
      // The final quarter holds the completed lettering still.
      const flight=ease(clamp((progress-.06)/.69));
      const formation=motion.matches?0:ease(clamp((progress-.36)/.39));
      const bursting=!motion.matches&&formation>.95&&(hovered||now<burstUntil);
      let disturbed=false;
      stage.dataset.productBurst=String(bursting);
      stage.dataset.productPhase=progress>=.75?'word':progress>.36?'forming':progress>.06?'flight':'rest';
      stage.dataset.productWord=formation===1?'PRODUCTS':'';
      const zoom=motion.matches?0:ease(clamp((progress-.12)/.60));
      const titleScale=1-flight*.38;
      title.style.setProperty('--mobile-product-label-opacity',String(1-flight));
      const titleStart=Math.max(headerHeight+(width<=991?48:42),height*(width<=991?.23:.20));
      const titleEnd=wordRect.y-titleHeight*titleScale-height*.025;
      title.style.top=`${titleStart+(titleEnd-titleStart)*zoom}px`;
      title.style.transform=`scale(${titleScale})`;
      const photoWidth=Math.min(width,height*1.45)*(1-zoom*.32);
      const photoHeight=photoWidth*941/1672,photoLeft=(width-photoWidth)/2;
      const originalTop=height-photoHeight-(width<=991?height*.16:0);
      const composedTop=wordRect.y+wordRect.height+height*.065-photoHeight*.35;
      const photoTop=originalTop+(composedTop-originalTop)*zoom;
      table.style.width=`${photoWidth}px`;table.style.height=`${photoHeight}px`;
      table.style.left=`${photoLeft}px`;table.style.top=`${photoTop}px`;
      names.style.opacity=String(1-zoom);
      stage.dataset.wordBottom=(wordRect.y+wordRect.height).toFixed(1);
      stage.dataset.bowlsTop=(photoTop+photoHeight*.35).toFixed(1);
      let remaining=0;
      for (const [particle,item] of ingredients.entries()) {
        const {family,index,seed,phase,radial}=item, bowl=bowls[family];
        const asset=sprites[Math.floor(family/3)];
        if (!asset.complete||!asset.naturalWidth) continue;
        const cell=asset.naturalWidth/3;
        const launch=motion.matches?0:ease(clamp((flight-seed*.26)/.74));
        const centreX=photoLeft+photoWidth*bowl.x, centreY=photoTop+photoHeight*bowl.y;
        const radiusX=photoWidth*(bowl.row ? .100 : .079), radiusY=photoHeight*(bowl.row ? .058 : .042);
        const originX=centreX+Math.cos(phase)*radial*radiusX;
        const originY=centreY+Math.sin(phase)*radial*radiusY;
        const spread=width*(.025+seed*.065)*launch;
        const swirl=Math.sin(launch*Math.PI)*(1-launch)*width*.036;
        const flyingX=originX+Math.cos(phase+launch*7)*spread+Math.sin(phase+launch*16)*swirl;
        // Every layer of the original pile leaves its own bowl. The rear and
        // foreground rows converge above the rims rather than into other bowls.
        const lift=(bowl.row?height*(.44+seed*.12):height*(.24+seed*.12))*launch;
        const flyingY=originY-lift+Math.sin(phase+launch*7)*spread*.20;
        const destination=letterTargets[particle]||{x:flyingX,y:flyingY};
        let x=flyingX+(destination.x-flyingX)*formation;
        let y=flyingY+(destination.y-flyingY)*formation;
        const offset=offsets[particle];
        const distance=Math.hypot(x-pointer.x,y-pointer.y),influence=.3+.7*Math.exp(-distance/Math.max(100,width*.25));
        const pulse=.68+.32*Math.sin((now-burstStart)/500+phase);
        const force=bursting?influence*pulse:0;
        const targetX=Math.cos(phase+seed*5)*width*(.08+seed*.15)*force;
        const targetY=Math.sin(phase)*height*(.12+seed*.20)*force;
        offset.vx=(offset.vx+(targetX-offset.x)*.045)*.80;offset.vy=(offset.vy+(targetY-offset.y)*.045)*.80;
        offset.x+=offset.vx;offset.y+=offset.vy;
        if(Math.abs(offset.x)+Math.abs(offset.y)+Math.abs(offset.vx)+Math.abs(offset.vy)>.12)disturbed=true;
        x+=offset.x*formation;y+=offset.y*formation;
        const flyingSize=photoWidth*bowl.size*(.82+seed*.30)*(1-launch*.30);
        const letterSize=wordRect.width*.029*(family===5?.72:1);
        const size=flyingSize+(letterSize-flyingSize)*formation;
        if (y+size*.35>=centreY-radiusY) remaining++;
        ctx.save();
        if (launch<.015) {ctx.beginPath();ctx.ellipse(centreX,centreY,radiusX+photoWidth*bowl.size*.3,radiusY+photoHeight*.015,0,0,Math.PI*2);ctx.clip();}
        ctx.translate(x,y);ctx.rotate((phase*.35+launch*(family===1?1.6:2.6)*(index%2?1:-1))*(1-formation)+Math.sin(phase)*formation*.35+offset.x*.012);
        ctx.shadowColor='#24201350';ctx.shadowBlur=launch>0?0:width*.002;ctx.shadowOffsetY=launch>0?0:width*.0015;
        ctx.drawImage(asset,cell*(family%3),0,cell,asset.naturalHeight,-size/2,-size/2,size,size);
        ctx.restore();
      }
      stage.dataset.remainingIngredients=String(remaining);
      stage.dataset.letterParticles=String(formation===1?ingredients.length:0);
      burstButton.style.left=`${wordRect.x}px`;burstButton.style.top=`${wordRect.y}px`;burstButton.style.width=`${wordRect.width}px`;burstButton.style.height=`${wordRect.height}px`;burstButton.tabIndex=formation>.95?0:-1;
      if(formation===1&&wordMask&&!bursting&&!disturbed){
        // Crisp glyph edges keep the food lettering readable on phones.
        ctx.save();ctx.globalCompositeOperation='destination-in';
        ctx.drawImage(wordMask,wordRect.x,wordRect.y,wordRect.width,wordRect.height);ctx.restore();
      }
      if(bursting||disturbed)requestDraw();
    }
    function buildLetterTargets(){
      const mask=document.createElement('canvas');mask.width=1200;mask.height=240;
      wordMask=mask;
      const ink=mask.getContext('2d')!;ink.font='900 190px Arial, sans-serif';
      ink.textAlign='center';ink.textBaseline='middle';ink.fillStyle='white';ink.fillText('PRODUCTS',600,128);
      if(!selectedPoints){
      const pixels=ink.getImageData(0,0,1200,240).data,points:{x:number;y:number}[]=[];
      for(let y=20;y<220;y+=7)for(let x=30;x<1170;x+=7)if(pixels[(y*1200+x)*4+3]>180)points.push({x,y});
      // Farthest-point sampling fills every letter evenly instead of clumping
      // sprites into rows or leaving strokes missing at smaller viewports.
      const distances=points.map(()=>Infinity),selected:{x:number;y:number}[]=[];
      let next=0;
      for(let i=0;i<ingredients.length&&points.length;i++){
        const point=points[next];selected.push(point);let largest=-1;
        for(let j=0;j<points.length;j++){
          const d=(point.x-points[j].x)**2+(point.y-points[j].y)**2;
          distances[j]=Math.min(distances[j],d);
          if(distances[j]>largest){largest=distances[j];next=j;}
        }
      }
      selectedPoints=selected;cachedLetterPoints=selected;
      }
      const wordWidth=Math.min(width*.94,height*1.7);
      const wordHeight=Math.max(wordWidth*.2,Math.min(height*.18,wordWidth*.32));
      wordRect={x:(width-wordWidth)/2,y:height*.40-wordHeight/2,width:wordWidth,height:wordHeight};
      letterTargets=selectedPoints.map(point=>({x:wordRect.x+point.x/1200*wordRect.width,y:wordRect.y+point.y/240*wordRect.height}));
    }
    function resize() {
      if (!stage||!canvas||!ctx) return;
      const nextWidth=stage.clientWidth,nextHeight=stage.clientHeight;
      titleHeight=title!.offsetHeight;headerHeight=header?.offsetHeight??110;
      const ratio=Math.min(devicePixelRatio,nextWidth<=991?1.25:1.5);
      if(nextWidth!==width||nextHeight!==height||canvas.width!==Math.round(nextWidth*ratio)){
        width=nextWidth;height=nextHeight;
        canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);
        ctx.setTransform(ratio,0,0,ratio,0,0);buildLetterTargets();
      }
      requestDraw();
    }
    const sizing=new ResizeObserver(resize);sizing.observe(stage);sizing.observe(title);if(header)sizing.observe(header);resize();
    sprites.forEach(asset=>{asset.onload=()=>{stage.dataset.assetsReady=String(sprites.every(image=>image.complete&&image.naturalWidth>0));requestDraw();};});
    const loadSprites=()=>{stage.dataset.assetsReady='false';sprites.forEach((asset,index)=>{const source=index===0?assets.ingredients:assets.catalogue;asset.src=(compact.matches?source.mobile:source.desktop).src;});};
    loadSprites();compact.addEventListener('change',loadSprites);
    let trigger: ScrollTrigger | undefined;
    function configureMotion() {
      trigger?.kill(true);trigger=undefined;progress=0;
      if (!motion.matches) trigger=ScrollTrigger.create({
        trigger:section,start:'top top',end:()=>`+=${(stage?.clientHeight??height)*(window.innerWidth<=991?1.1:2.2)}`,
        pin:stage,invalidateOnRefresh:true,
        onUpdate:self=>{progress=self.progress;requestDraw();},
        onRefresh:self=>{progress=self.progress;resize();},
      });
      resize();
    }
    configureMotion();
    const refresh=()=>ScrollTrigger.refresh();
    const compactLayout=matchMedia('(max-width:991px) and (max-height:499px)');
    compactLayout.addEventListener('change',configureMotion);
    motion.addEventListener('change',configureMotion);
    document.fonts.ready.then(()=>{if(!disposed)refresh();});
    return()=>{
      disposed=true;sizing.disconnect();trigger?.kill(true);
      cancelAnimationFrame(hoverFrame);stage.removeEventListener('pointermove',move);stage.removeEventListener('pointerleave',leave);burstButton.removeEventListener('click',replay);
      motion.removeEventListener('change',configureMotion);compactLayout.removeEventListener('change',configureMotion);compact.removeEventListener('change',loadSprites);sprites.forEach(asset=>{asset.onload=null;asset.src='';});
      title.style.transform='';title.style.top='';
    };
  },[]);

  return <section ref={sectionRef} className="product-hero" aria-labelledby="products-title">
    <div ref={stageRef} className="product-stage">
      <div className="product-table-scene">
        <picture><source media="(max-width:991px)" srcSet={assets.table.mobile.src}/><Image className="product-table" src={assets.table.desktop.src} width={1672} height={941} alt="Six bowls of makhana, paneer, ginger, cashews, dehydrated fruits and millets; the same ingredients rise out to form PRODUCTS" loading="eager" fetchPriority="high" unoptimized/></picture>
        <div className="product-names mono" aria-label="Featured products">{bowls.map(bowl=><span key={bowl.label} style={{left:`${bowl.x*100}%`,top:bowl.row?'94%':'60%'}}>{bowl.label}</span>)}</div>
      </div>
      <div className="product-vignette" aria-hidden="true"/>
      <div ref={titleRef} className="product-title">
        <p className="mono">PanVibes Exim</p>
        <h1 id="products-title">Our<span className="product-title-accessible"> products</span></h1>
      </div>
      <canvas ref={canvasRef} className="product-ingredients" aria-hidden="true"/>
      <button type="button" className="product-burst-trigger" aria-label="Animate product lettering" tabIndex={-1}/>
      <a href="#product-range-title" className="product-scroll mono"><span>Explore the catalogue</span><span aria-hidden="true">↓</span></a>
    </div>
  </section>;
}
