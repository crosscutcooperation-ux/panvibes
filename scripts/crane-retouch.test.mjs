import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import sharp from 'sharp';
const report=JSON.parse(await fs.readFile('docs/asset-refinements/crane-retouch.json','utf8'));
assert.equal(report.frames.length,139,'All crane phases should come from the high-resolution originals');
for(const frame of report.frames){assert.equal(frame.width,1920);assert.equal(frame.height,1080);assert.equal(frame.alphaPreserved,true);assert.ok(frame.editedPixels<1920*1080*.02,'Retouch must remain limited to lettering');}
const frame=report.frames[0];
const before=await sharp('public'+frame.original).resize(1920,1080).ensureAlpha().raw().toBuffer();
const after=await sharp('public'+frame.desktop).ensureAlpha().raw().toBuffer();
const mask=await sharp('docs/asset-refinements/crane-lettering-mask.png').greyscale().raw().toBuffer();
const tracking=JSON.parse(await fs.readFile('docs/asset-refinements/crane-tracking.json','utf8'));
const m=tracking.frames[0].matrix;
const [a,b,c]=m[0],[d,e,f]=m[1],[g,h,i]=m[2],A=e*i-f*h,B=c*h-b*i,C=b*f-c*e,D=f*g-d*i,E=a*i-c*g,F=c*d-a*f,G=d*h-e*g,H=b*g-a*h,I=a*e-b*d,det=a*A+b*D+c*G;
const inverse=[[A,B,C],[D,E,F],[G,H,I]].map(row=>row.map(value=>value/det));
let compared=0,changedOutside=0,changedInside=0;
for(let y=0;y<1080;y++)for(let x=0;x<1920;x++){
  const index=(y*1920+x)*4;if(after[index+3]!==255)continue;
  const xx=x/1.5,yy=y/1.5,z=inverse[2][0]*xx+inverse[2][1]*yy+inverse[2][2];
  const rx=Math.round((inverse[0][0]*xx+inverse[0][1]*yy+inverse[0][2])/z),ry=Math.round((inverse[1][0]*xx+inverse[1][1]*yy+inverse[1][2])/z);
  const inside=rx>=0&&ry>=0&&rx<1280&&ry<720&&mask[ry*1280+rx]>=5;
  const differs=[0,1,2].some(channel=>before[index+channel]!==after[index+channel]);
  if(inside){if(differs)changedInside++;}else{compared++;if(differs)changedOutside++;}
}
assert.equal(changedOutside,0,'The original boom/cab/container texture outside the glyph mask must remain pixel-identical');
assert.ok(changedInside>100,'The printed lettering must actually be edited');
for(let y=400;y<580;y++)for(let x=1680;x<1830;x++)assert.equal(after[(y*1920+x)*4+3],255,'Container panels must stay opaque');
console.log(`PASS: 139 high-resolution crane frames; ${compared} opaque pixels outside lettering unchanged; container panels opaque.`);
