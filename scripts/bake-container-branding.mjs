import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

// Bake the established logo into the shipping artwork; runtime never places a
// floating label over a moving frame. Originals remain untouched for rebuilds.
const sequences=JSON.parse(await fs.readFile('lib/reference-sequences.json','utf8'));
const mobile=JSON.parse(await fs.readFile('lib/mobile-journey-assets.json','utf8'));
const logo=await fs.readFile('public/images/panvibes-logo-transparent.png');
const logoUri='data:image/png;base64,'+logo.toString('base64');
const shipOnly=process.argv.includes('--ship-only');
const roofsOnly=process.argv.includes('--truck-roofs-only');
const mapping=JSON.parse(await fs.readFile('lib/container-branding-assets.json','utf8'));
const interpolate=(keys,p)=>{let b=keys.findIndex(k=>k[0]>=p);if(b<0)return keys.at(-1).slice(1);if(!b)return keys[0].slice(1);const a=keys[b-1],z=keys[b],t=(p-a[0])/(z[0]-a[0]);return a.slice(1).map((v,i)=>v+(z[i+1]-v)*t)};
const fit=(x,y,w,h,rotation=0,white=false,mirror=false)=>`<g transform="translate(${x} ${y}) rotate(${rotation}) scale(${mirror?-1:1} 1)"><image href="${logoUri}" x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet" opacity=".94" ${white?'filter="url(#white)"':''}/></g>`;
async function bake(src,marks){if(!marks.length)return;const meta=await sharp('public'+src).metadata();const w=meta.width,h=meta.height;const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><filter id="white"><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/></filter></defs>${marks.map(m=>fit(m[0]*w,m[1]*h,m[2]*w,m[3]*h,m[4],m[5],m[6])).join('')}</svg>`;const dest='/images/branded'+src.replace(/^\/images|^\/media/,'').replace(/\.[^.]+$/,'.webp');await fs.mkdir(path.dirname('public'+dest),{recursive:true});await sharp('public'+src).composite([{input:Buffer.from(svg)}]).webp({quality:88,alphaQuality:100,effort:4}).toFile('public'+dest);mapping[src]=dest;}
if(!shipOnly&&!roofsOnly){
for(const [name,frames] of Object.entries(sequences)){
 for(let i=0;i<frames.length;i++){
  const p=i/(frames.length-1);let marks=[];
  if(name==='truck-turn'){
   // Camera tilts from the long wall to the roof; each face keeps its own mark.
   const [top,split,bottom]=interpolate([[0,.14,.14,.665],[.18,.14,.14,.67],[.36,.12,.20,.70],[.55,.05,.32,.77],[.73,.07,.53,.80],[.91,.16,.73,.80],[1,.203,.843,.843]],p);
   if(bottom-split>.04)marks.push([.402,(split+bottom)/2,.38,(bottom-split)*.64,0,false]);
   if(split-top>.06)marks.push([.402,(top+split)/2,.38,(split-top)*.64,0,false]);
  }
  if(name==='crane-turn'){
   // Measured long-wall bounds; the short gate remains completely unbranded.
   const [left,right,topLeft,topRight,bottom]=interpolate([[0,.974,.974,.30,.30,.44],[1/6,.864,.943,.287,.337,.521],[2/6,.681,.921,.308,.346,.533],[.5,.477,.881,.322,.358,.541],[4/6,.321,.837,.337,.354,.544],[5/6,.247,.799,.352,.364,.556],[1,.227,.776,.37,.37,.558]],p);
   if(right-left>.04)marks=[[ (left+right)/2,((topLeft+topRight)/2+bottom)/2,(right-left)*.72,(bottom-(topLeft+topRight)/2)*.64,0,false,true]];
  }
  if(name==='crane-place'){
   const [left,right,top,bottom]=interpolate([[0,.227,.776,.37,.558],[1,.18,.82,.49,.70]],p);
   marks=[[(left+right)/2,(top+bottom)/2,(right-left)*.65,(bottom-top)*.64,0,false,true]];
  }
  // crane-lift shows only the short end, so it deliberately has no logo.
  if(marks.length){await bake(frames[i],marks);if(mobile[frames[i]])await bake(mobile[frames[i]],marks);}
 }
 console.log('Prepared',name);
}
await bake('/images/truck-container.avif',[[.394,.29,.50,.40,0,false]]);
await bake('/images/journey-mobile/stills/truck-container.webp',[[.5,.5,.65,.65,0,false]]);
await bake('/media/home-hero/handoff-truck.webp',[[.505,.38,.85,.15,-90,false]]);
await bake('/images/container-top.avif',[[.402,.50,.52,.52,0,false]]);
await bake('/images/journey-mobile/stills/container-top.webp',[[.402,.50,.52,.52,0,false]]);
}
if(!shipOnly){
await bake('/images/truck-top.avif',[[.402,.50,.52,.52,0,false]]);
await bake('/images/journey-mobile/stills/truck-top.webp',[[.402,.50,.52,.52,0,false]]);
}
// Same roof positions as the approved ship treatment. Blue and orange/red
// pink and dark green steel use white ink; lighter roofs keep the blue/orange logo.
const rows=[{y:656,h:382,x:[128,225,321,417,513],white:[1,1,1,1,0]},{y:1120,h:382,x:[128,225,321,417,513],white:[1,1,1,1,1]},{y:1600,h:382,x:[128,225,321,417,513],white:[1,1,0,1,0]},{y:2060,h:382,x:[128,225,321,417,513],white:[0,1,1,1,1]},{y:2510,h:236,x:[128,225,321,417,513],white:[0,1,0,0,1]},{y:2800,h:350,x:[225,321,417],white:[1,1,1]}];
if(!roofsOnly)await bake('/images/ship.avif',rows.flatMap(r=>r.x.map((x,i)=>[(x+42)/731,(r.y+r.h/2)/3579,r.h*.86/731,84*.76/3579,90,Boolean(r.white[i])])));
await fs.writeFile('lib/container-branding-assets.json',JSON.stringify(mapping,null,2)+'\n');
console.log('Baked',Object.keys(mapping).length,'assets; originals preserved.');
