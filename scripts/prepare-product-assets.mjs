import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const directory='public/images/products';
const manifest={};
for(const [name,source] of [['ingredients','ingredient-sprites.webp'],['catalogue','catalogue-sprites.webp'],['table','table-bowls-transparent.webp']]){
  manifest[name]={};
  for(const [device,width] of [['mobile',name==='table'?768:576],['desktop',name==='table'?1440:1152]]){
    const bytes=await sharp(`${directory}/${source}`).resize({width,withoutEnlargement:true}).webp({quality:86,alphaQuality:100,effort:4}).toBuffer();
    const hash=createHash('sha256').update(bytes).digest('hex').slice(0,12),filename=`${name}-${device}-${hash}.webp`;
    await fs.writeFile(`${directory}/${filename}`,bytes);
    manifest[name][device]={src:`/images/products/${filename}`,bytes:bytes.length};
    console.log(name,device,bytes.length);
  }
}
await fs.writeFile('lib/product-assets.json',JSON.stringify(manifest,null,2)+'\n');
