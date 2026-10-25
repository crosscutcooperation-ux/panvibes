// Offline only: one indexed download replaces hundreds of latency-bound files.
// Keep every frame, its alpha channel and existing branding. Size copies for
// the bounded canvas rather than shipping oversized source renders.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import ts from 'typescript';
import vm from 'node:vm';
const read=async file=>JSON.parse(await fs.readFile(file,'utf8'));
const branded=await read('lib/container-branding-assets.json'),mobile=await read('lib/mobile-journey-assets.json'),sequences=await read('lib/reference-sequences.json');
const shippingSource=ts.transpileModule(await fs.readFile('lib/shipping.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const shipping={exports:{}};vm.runInNewContext(shippingSource,{exports:shipping.exports,module:shipping});
const source=ts.transpileModule(await fs.readFile('lib/site-content.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const contentModule={exports:{}};vm.runInNewContext(source,{exports:contentModule.exports,module:contentModule,require:name=>{if(name==='./shipping')return shipping.exports;throw new Error(`Unexpected content dependency ${name}`);}});
const {services,industries}=contentModule.exports;
const stills=['truck-container','truck-top','container-top','container-blue','container-orange','crane-base','crane-beam'].map(name=>`/images/${name}.avif`);
const paths=[...Object.values(sequences).flat(),...stills,'/images/branded/ship.webp','/images/cloud-left.avif','/images/cloud-right.avif',...services.map(service=>`/images/${service.image}`),...industries.map(industry=>`/images/${industry.image}`)];
await fs.mkdir('public/media/journey',{recursive:true});const manifest={};
for(const compact of [false,true]){
  const resolved=[...new Set(paths.map(asset=>{const sized=compact?mobile[asset]||asset:asset;return branded[sized]||sized;}))];
  let offset=0,index=0;const entries=new Array(resolved.length);
  await Promise.all(Array.from({length:4},async()=>{while(index<resolved.length){
    const i=index++,asset=resolved[i];let bytes=await fs.readFile(`public${asset}`);
    const frame=asset.includes('/journey/')||asset.includes('/journey-mobile/');
    if(asset.includes('/refined-hd/')&&(!compact||asset.includes('/truck-turn/'))){
      // Keep restored crane/truck resolution. Encode the lossless master once
      // for delivery; never repeat the old quality-78 reduction.
      const smaller=await sharp(bytes).webp({quality:92,alphaQuality:100,effort:4}).toBuffer();if(smaller.length<bytes.length)bytes=smaller;
    }else if(asset.endsWith('.webp')&&!asset.includes('/refined-hd/')){
      const width=compact?640:frame?(asset.includes('/truck-turn/')?1200:960):1440;
      const smaller=await sharp(bytes).resize({width,withoutEnlargement:true}).webp({quality:78,alphaQuality:100,effort:4}).toBuffer();if(smaller.length<bytes.length)bytes=smaller;
    }
    const types={'.avif':'image/avif','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg'};
    const type=types[path.extname(asset)];if(!type)throw new Error(`Unsupported image ${asset}`);
    entries[i]={asset,bytes,type};
  }}));
  const header=Buffer.from(JSON.stringify(entries.map(({asset,bytes,type})=>{const entry=[asset,offset,bytes.length,type];offset+=bytes.length;return entry;})));
  const length=Buffer.alloc(4);length.writeUInt32LE(header.length);
  const pack=Buffer.concat([length,header,...entries.map(entry=>entry.bytes)]),hash=createHash('sha256').update(pack).digest('hex').slice(0,12);
  const name=`journey-${compact?'mobile':'desktop'}-${hash}.bin`;
  await fs.writeFile(path.join('public/media/journey',name),pack);
  manifest[compact?'mobile':'desktop']={src:`/media/journey/${name}`,bytes:pack.length,entries:entries.length};
  console.log(`${name}: ${entries.length} assets, ${pack.length} bytes`);
}
await fs.writeFile('lib/journey-packs.json',JSON.stringify(manifest,null,2)+'\n');
