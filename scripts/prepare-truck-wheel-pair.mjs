import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { trailerWheelPairCrop } from '../lib/trailer-tyre.ts';

const read = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const sequences = await read('lib/reference-sequences.json');
const mobile = await read('lib/mobile-journey-assets.json');
const mapping = await read('lib/container-branding-assets.json');
const report = [];
for (let index = 0; index < sequences['truck-turn'].length; index++) {
  const logical = sequences['truck-turn'][index];
  for (const asset of [logical, mobile[logical]]) {
    // Always rebuild from the untouched branded frame, never a prior patch.
    const original = asset.replace('/images/', '/images/branded/');
    const { data, info } = await sharp('public' + original).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const crop = trailerWheelPairCrop(index / (sequences['truck-turn'].length - 1), info.width, info.height);
    const result = Buffer.from(data);
    for (let y = crop.top; y < info.height; y++) {
      const source = (y * info.width + crop.left) * 4;
      const destination = (y * info.width + crop.destinationLeft) * 4;
      // Replace RGBA together: old landing legs and the old axle cannot bleed
      // through the copied pair's transparent surroundings.
      data.copy(result, destination, source, source + crop.width * 4);
    }
    for (let pixel = 0; pixel < result.length; pixel += 4) {
      if (result[pixel + 3] === 0) result.fill(0, pixel, pixel + 3);
    }
    const destination = asset.replace('/images/', '/images/refined-hd/');
    await fs.mkdir(path.dirname('public' + destination), { recursive: true });
    await sharp(result, { raw: info }).webp({ lossless: true, effort: 4 }).toFile('public' + destination);
    const decoded = await sharp('public' + destination).ensureAlpha().raw().toBuffer();
    for (let pixel = 0; pixel < decoded.length; pixel += 4) {
      if (decoded[pixel + 3] === 0) decoded.fill(0, pixel, pixel + 3);
    }
    assert.ok(decoded.equals(result), 'The corrected master must preserve the exact copied wheel pixels');
    mapping[asset] = destination;
    report.push({ original, destination, camera: index / (sequences['truck-turn'].length - 1), width: info.width, height: info.height, crop });
  }
}
await fs.writeFile('lib/container-branding-assets.json', JSON.stringify(mapping, null, 2) + '\n');
await fs.writeFile('docs/asset-refinements/truck-wheel-pair.json', JSON.stringify(report, null, 2) + '\n');
console.log(`Rebuilt ${report.length} desktop/mobile truck frames with the original rear wheel pair.`);
