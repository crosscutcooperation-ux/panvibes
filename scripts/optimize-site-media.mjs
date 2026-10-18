import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

// Preserve the source artwork. Only the derived files are served by the app.
const assets = new Map();
const add = (src, width, lossless = false) => assets.set(src, { width, lossless });
try { for (const src of Object.keys(JSON.parse(await fs.readFile('lib/optimized-media.json','utf8')))) add(src,1600); } catch (error) { if(error.code!=='ENOENT')throw error; }
const content = await fs.readFile('lib/site-content.ts', 'utf8');
for (const [, name] of content.matchAll(/image:\s*["']([^"']+\.(?:jpg|png))["']/g)) add(`/images/${name}`, 1600);
for (const [directory, width] of [['/assets/apart',1200],['/assets/services',1200],['/assets/blog/photography',1280],['/assets/panvibes/images/founder',640]]) {
  for (const file of await fs.readdir(`public${directory}`)) if (/\.jpe?g$/i.test(file)) add(`${directory}/${file}`,width);
}
for (const post of JSON.parse(await fs.readFile('app/blog/posts.json','utf8'))) if (post.image?.startsWith('/') && /\.jpe?g$/i.test(post.image)) add(post.image,1280);
for (const name of ['ingredient-sprites','catalogue-sprites','table-bowls-transparent']) add(`/images/products/${name}.png`,null,true);
add('/media/home-hero/handoff-clean-plate.png',1920);
add('/media/home-hero/handoff-truck.png',null,true);

const manifest = {}, report = [];
for (const [source,{width,lossless}] of assets) {
  const destination = source.replace(/\.[^.]+$/,'.webp');
  let pipeline = sharp(`public${source}`);
  if (width) pipeline = pipeline.resize({width,height:width,fit:'inside',withoutEnlargement:true});
  await pipeline.webp({quality:source.includes('handoff-clean')?95:86,alphaQuality:100,lossless,effort:5}).toFile(`public${destination}`);
  const before=(await fs.stat(`public${source}`)).size, after=(await fs.stat(`public${destination}`)).size;
  manifest[source]=destination;report.push({source,destination,before,after});
}
await fs.writeFile('lib/optimized-media.json',JSON.stringify(manifest,null,2)+'\n');
await fs.writeFile('docs/media-optimization.json',JSON.stringify(report,null,2)+'\n');
const before=report.reduce((sum,item)=>sum+item.before,0), after=report.reduce((sum,item)=>sum+item.after,0);
console.log(`${report.length} assets: ${(before/1048576).toFixed(1)} MB → ${(after/1048576).toFixed(1)} MB (${Math.round((1-after/before)*100)}% smaller).`);
