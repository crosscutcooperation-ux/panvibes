import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import sharp from 'sharp';

const frames = JSON.parse(await fs.readFile('docs/asset-refinements/truck-wheel-pair.json', 'utf8'));
assert.equal(frames.length, 90, 'Correct both resolutions through all 45 camera views');
let checked = 0;
for (const frame of frames) {
  const original = await sharp('public' + frame.original).ensureAlpha().raw().toBuffer();
  const corrected = await sharp('public' + frame.destination).ensureAlpha().raw().toBuffer();
  const c = frame.crop, stride = frame.width * 4;
  for (let y = 0; y < frame.height; y++) {
    for (let x = 0; x < frame.width; x++) {
      const destination = y * stride + x * 4;
      const copied = y >= c.top && x >= c.destinationLeft && x < c.destinationLeft + c.width;
      const source = copied ? y * stride + (x - c.destinationLeft + c.left) * 4 : destination;
      assert.equal(corrected[destination + 3], original[source + 3], 'Keep the complete wheel pair silhouette and transparency');
      if (original[source + 3] === 0) continue;
      for (let channel = 0; channel < 3; channel++) {
        assert.equal(corrected[destination + channel], original[source + channel], copied ? 'Copy the original pair without distortion' : 'Preserve the truck outside the wheel pair');
      }
      checked++;
    }
  }
}
console.log(`PASS: all 90 truck frames preserve the original rear wheel pair exactly; ${checked} visible pixels verified.`);
