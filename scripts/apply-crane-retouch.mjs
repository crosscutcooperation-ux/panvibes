// Native-resolution crane rebuild. Preserve original silhouettes; retouch glyphs only.
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const read=async file=>JSON.parse(await fs.readFile(file,'utf8'));
const tracking=await read('docs/asset-refinements/crane-tracking.json');
const alignment=(await read('docs/asset-refinements/crane-alignment.json')).originalToEdited;
const mapping=await read('lib/container-branding-assets.json'),mobile=await read('lib/mobile-journey-assets.json'),sequences=await read('lib/reference-sequences.json');
const reference=await sharp('public/images/journey/crane-lift/000.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
const referenceBlur=await sharp(reference.data,{raw:reference.info}).blur(2).raw().toBuffer();
const patch=await sharp('docs/asset-refinements/crane-keyframe.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});
const byPath=new Map(tracking.frames.map(frame=>[frame.path,frame]));
const logoUri='data:image/png;base64,'+(await fs.readFile('public/images/panvibes-logo-transparent.png')).toString('base64');
const light=(d,i)=>d[i]*.2126+d[i+1]*.7152+d[i+2]*.0722;
function inverse(m){const [a,b,c]=m[0],[d,e,f]=m[1],[g,h,i]=m[2],A=e*i-f*h,B=c*h-b*i,C=b*f-c*e,D=f*g-d*i,E=a*i-c*g,F=c*d-a*f,G=d*h-e*g,H=b*g-a*h,I=a*e-b*d,det=a*A+b*D+c*G;return [[A,B,C],[D,E,F],[G,H,I]].map(row=>row.map(v=>v/det));}
function project(m,x,y){const z=m[2][0]*x+m[2][1]*y+m[2][2];return [(m[0][0]*x+m[0][1]*y+m[0][2])/z,(m[1][0]*x+m[1][1]*y+m[1][2])/z];}
function distance(x,y,poly){let sign=0,result=Infinity;for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],dx=b[0]-a[0],dy=b[1]-a[1],cross=dx*(y-a[1])-dy*(x-a[0]),next=Math.sign(cross);if(sign&&next&&next!==sign)return -1;if(next)sign=next;result=Math.min(result,Math.abs(cross)/Math.hypot(dx,dy));}return result;}
const mask=new Uint8Array(reference.info.width*reference.info.height);
for(let y=0;y<reference.info.height;y++)for(let x=0;x<reference.info.width;x++){
 const i=(y*reference.info.width+x)*4;
 if(reference.data[i+3]<220||distance(x,y,tracking.polygon)<5||light(reference.data,i)<105||light(reference.data,i)-light(referenceBlur,i)<18)continue;
 for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)if(dx*dx+dy*dy<=5){const xx=x+dx,yy=y+dy;if(xx>=0&&yy>=0&&xx<reference.info.width&&yy<reference.info.height)mask[yy*reference.info.width+xx]=255;}
}
const glyph=await sharp(mask,{raw:{width:reference.info.width,height:reference.info.height,channels:1}}).greyscale().blur(.5).raw().toBuffer();
if(glyph.length!==mask.length)throw new Error('Glyph mask must be single-channel');
await fs.writeFile('docs/asset-refinements/crane-lettering-mask.png',await sharp(glyph,{raw:{width:reference.info.width,height:reference.info.height,channels:1}}).png().toBuffer());
function exteriorAlpha(data,w,h){
 const seen=new Uint8Array(w*h),queue=new Int32Array(w*h);let head=0,tail=0;
 function visit(p){if(seen[p])return;const i=p*4;if(Math.min(data[i],data[i+1],data[i+2])<246)return;seen[p]=1;queue[tail++]=p;}
 for(let x=0;x<w;x++){visit(x);visit((h-1)*w+x);}for(let y=0;y<h;y++){visit(y*w);visit(y*w+w-1);}
 while(head<tail){const p=queue[head++],x=p%w,y=Math.floor(p/w);data[p*4+3]=0;if(x)visit(p-1);if(x<w-1)visit(p+1);if(y)visit(p-w);if(y<h-1)visit(p+w);}
}
function steel(data,w,h,x,y,nx,ny){const choices=[];for(const off of [-18,-12,-7,7,12,18]){const xx=Math.round(x+off*nx),yy=Math.round(y+off*ny);if(xx<0||yy<0||xx>=w||yy>=h)continue;const i=(yy*w+xx)*4,l=light(data,i);if(data[i+3]>230&&l>10&&l<110)choices.push({rgb:[data[i],data[i+1],data[i+2]],l});}choices.sort((a,b)=>a.l-b.l);return choices.length?choices[Math.floor(choices.length*.4)].rgb:null;}
function interpolate(keys,p){let b=keys.findIndex(k=>k[0]>=p);if(b<0)return keys.at(-1).slice(1);if(!b)return keys[0].slice(1);const a=keys[b-1],z=keys[b],t=(p-a[0])/(z[0]-a[0]);return a.slice(1).map((v,i)=>v+(z[i+1]-v)*t);}
function logo(name,p,w,h){let mark;if(name==='crane-turn'){const [l,r,tl,tr,b]=interpolate([[0,.974,.974,.30,.30,.44],[1/6,.864,.943,.287,.337,.521],[2/6,.681,.921,.308,.346,.533],[.5,.477,.881,.322,.358,.541],[4/6,.321,.837,.337,.354,.544],[5/6,.247,.799,.352,.364,.556],[1,.227,.776,.37,.37,.558]],p);if(r-l>.04)mark=[(l+r)/2,((tl+tr)/2+b)/2,(r-l)*.72,(b-(tl+tr)/2)*.64];}else if(name==='crane-place'){const [l,r,t,b]=interpolate([[0,.227,.776,.37,.558],[1,.18,.82,.49,.70]],p);mark=[(l+r)/2,(t+b)/2,(r-l)*.65,(b-t)*.64];}if(!mark)return;const [x,y,a,b]=mark;return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><g transform="translate(${x*w} ${y*h}) scale(-1 1)"><image href="${logoUri}" x="${-a*w/2}" y="${-b*h/2}" width="${a*w}" height="${b*h}" preserveAspectRatio="xMidYMid meet" opacity=".94"/></g></svg>`);}
const report=[];
for(const name of ['crane-lift','crane-turn','crane-place']){
 const frames=sequences[name];
 for(let index=0;index<frames.length;index++){
  const logical=frames[index],file=path.basename(logical,'.webp'),original=`/images/${name==='crane-lift'?'crane':name}/${file}.avif`;
  const source=await sharp('public'+original).resize(1920,1080).ensureAlpha().raw().toBuffer({resolveWithObject:true}),w=source.info.width,h=source.info.height;
  exteriorAlpha(source.data,w,h);const untouched=Buffer.from(source.data),entry=byPath.get(logical);let edited=0;
  if(entry){
   const avg=await sharp(untouched,{raw:source.info}).blur(4).raw().toBuffer(),scale=w/reference.info.width,poly=tracking.polygon.map(([x,y])=>project(entry.matrix,x,y).map(v=>v*scale)),unwarp=inverse(entry.matrix);
   const x0=Math.max(0,Math.floor(Math.min(...poly.map(p=>p[0])))),x1=Math.min(w-1,Math.ceil(Math.max(...poly.map(p=>p[0])))),y0=Math.max(0,Math.floor(Math.min(...poly.map(p=>p[1])))),y1=Math.min(h-1,Math.ceil(Math.max(...poly.map(p=>p[1]))));
   for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
    const [rx,ry]=project(unwarp,x/scale,y/scale),mx=Math.round(rx),my=Math.round(ry);if(mx<0||my<0||mx>=reference.info.width||my>=reference.info.height)continue;
    const weight=glyph[my*reference.info.width+mx]/255,out=(y*w+x)*4;if(weight<.02||untouched[out+3]<230||light(avg,out)>115)continue;
    const a=project(entry.matrix,rx+.6,ry+.8),b=project(entry.matrix,rx,ry),len=Math.hypot(a[0]-b[0],a[1]-b[1]),base=steel(untouched,w,h,x,y,(a[0]-b[0])/len,(a[1]-b[1])/len);
    if(!base||light(untouched,out)<light(base,0)+8)continue;
    const [px,py]=project(alignment,rx,ry),sx=Math.round(px),sy=Math.round(py);if(sx<0||sy<0||sx>=patch.info.width||sy>=patch.info.height)continue;
    const sample=(sy*patch.info.width+sx)*4,alpha=patch.data[sample+3]/255;
    for(let c=0;c<3;c++){const texture=(patch.data[sample+c]*alpha+base[c]*(1-alpha)-base[c])*.15,clean=Math.max(0,Math.min(120,base[c]+texture));source.data[out+c]=Math.round(untouched[out+c]*(1-weight)+clean*weight);}edited++;
   }
  }
  for(let p=3;p<source.data.length;p+=4)if(source.data[p]!==untouched[p])throw new Error('Retouch changed crane/container alpha');
  let output=sharp(source.data,{raw:source.info});const mark=logo(name,index/(frames.length-1),w,h);if(mark)output=output.composite([{input:mark}]);
  const desktop=logical.replace('/images/journey/','/images/refined-hd/journey/');await fs.mkdir(path.dirname('public'+desktop),{recursive:true});
  const full=await output.webp({lossless:true,effort:4}).toBuffer();await fs.writeFile('public'+desktop,full);mapping[logical]=desktop;
  const compact=mobile[logical],small=compact.replace('/images/journey-mobile/','/images/refined-hd/journey-mobile/');await fs.mkdir(path.dirname('public'+small),{recursive:true});
  await sharp(full).resize(960,540).webp({quality:92,alphaQuality:100,effort:4}).toFile('public'+small);mapping[compact]=small;
  report.push({frame:logical,original,desktop,mobile:small,width:w,height:h,editedPixels:edited,alphaPreserved:true});
 }
 console.log(`Rebuilt ${name}: ${frames.length} original high-resolution frames`);
}
for(const name of ['crane-base','crane-beam']){
 const logical=`/images/${name}.avif`,destination=`/images/refined-hd/${name}.webp`;
 await sharp('public'+logical).resize({width:1920}).webp({lossless:true,effort:4}).toFile('public'+destination);mapping[logical]=destination;
 const compact=mobile[logical],small=`/images/refined-hd/journey-mobile/stills/${name}.webp`;await fs.mkdir(path.dirname('public'+small),{recursive:true});
 await sharp('public'+destination).resize({width:960}).webp({quality:92,alphaQuality:100,effort:4}).toFile('public'+small);mapping[compact]=small;
}
await fs.writeFile('lib/container-branding-assets.json',JSON.stringify(mapping,null,2)+'\n');
await fs.writeFile('docs/asset-refinements/crane-retouch.json',JSON.stringify({method:'Original AVIF frames, lettering-shaped mask. Imagegen retouch supplies fine texture only; no AI geometry or alpha. Desktop lossless WebP 1920x1080; mobile WebP 960x540. Original container panels remain opaque.',frames:report},null,2)+'\n');
console.log(`Rebuilt ${report.length} frames, preserving original crane/container geometry`);
