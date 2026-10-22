import sharp from 'sharp';
import fs from 'node:fs/promises';
// Use the existing PanVibes mark; exclude the wordmark at favicon sizes.
const mark=await sharp('public/images/panvibes-logo-transparent.png').extract({left:0,top:0,width:560,height:759}).png().toBuffer();
async function icon(size){
  const inset=Math.max(1,Math.round(size*.08)),inside=size-inset*2;
  const resized=await sharp(mark).resize(inside,inside,{fit:'inside'}).png().toBuffer({resolveWithObject:true});
  return sharp({create:{width:size,height:size,channels:4,background:'#ffffff'}}).composite([{input:resized.data,left:Math.round((size-resized.info.width)/2),top:inset}]).png().toBuffer();
}
await fs.writeFile('app/icon.png',await icon(192));
await fs.writeFile('app/apple-icon.png',await icon(180));
const sizes=[16,32,48],images=await Promise.all(sizes.map(icon));
const header=Buffer.alloc(6+16*sizes.length);header.writeUInt16LE(1,2);header.writeUInt16LE(sizes.length,4);
let offset=header.length;
for(let i=0;i<sizes.length;i++){
  const entry=6+i*16;header[entry]=header[entry+1]=sizes[i];header.writeUInt16LE(1,entry+4);header.writeUInt16LE(32,entry+6);header.writeUInt32LE(images[i].length,entry+8);header.writeUInt32LE(offset,entry+12);offset+=images[i].length;
}
await fs.writeFile('app/favicon.ico',Buffer.concat([header,...images]));
console.log('Prepared PanVibes favicon, 192px icon and Apple touch icon.');
