import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const manifests=JSON.parse(fs.readFileSync('lib/journey-packs.json'));
for(const [variant,entry] of Object.entries(manifests)){
  const bytes=fs.readFileSync(`public${entry.src}`),size=bytes.readUInt32LE(),start=4+size,entries=JSON.parse(bytes.subarray(4,start));
  assert.equal(bytes.length,entry.bytes);assert.equal(entries.length,entry.entries);
  assert.ok(entry.src.includes(createHash('sha256').update(bytes).digest('hex').slice(0,12)));
  let end=0;
  for(const [path,offset,length,type] of entries){
    assert.equal(offset,end);assert.ok(offset+length+start<=bytes.length);end=offset+length;
    const image=bytes.subarray(start+offset,start+offset+length);
    const actual=await sharp(image).metadata(),original=await sharp(`public${path}`).metadata();
    assert.ok(actual.width>0&&actual.height>0,path);
    assert.ok(Math.abs(actual.width/actual.height-original.width/original.height)<.01,path);
    assert.equal(actual.hasAlpha,original.hasAlpha,path);
    assert.ok(type.startsWith('image/'));
  }
  assert.equal(start+end,bytes.length);
  console.log(`PASS: ${variant}, ${entries.length} indexed images, hashes, complete byte ranges, aspect ratios and transparency`);
}
