import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const sequences=JSON.parse(await fs.readFile('lib/reference-sequences.json','utf8'));
const stills=['truck-container','truck-top','container-top','container-blue','container-orange','crane-base','crane-beam'].map(name=>`/images/${name}.avif`);
const assets=[...Object.values(sequences).flat(),...stills];
const manifest={};
let next=0;
await Promise.all(Array.from({length:4},async()=>{
  while(next<assets.length){
    const source=assets[next++];
    const destination=source.includes('/journey/')?source.replace('/journey/','/journey-mobile/'):source.replace('/images/','/images/journey-mobile/stills/').replace('.avif','.webp');
    await fs.mkdir(path.dirname(`public${destination}`),{recursive:true});
    await sharp(`public${source}`).resize({width:640,withoutEnlargement:true}).webp({quality:82,alphaQuality:95}).toFile(`public${destination}`);
    manifest[source]=destination;
  }
}));
await fs.writeFile('lib/mobile-journey-assets.json',JSON.stringify(manifest,null,2)+'\n');
console.log(`Prepared ${assets.length} mobile frames/stills with identical choreography.`);
