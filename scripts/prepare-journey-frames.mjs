// Prepare the reference site's rendered 3D frames for the scroll-driven canvas.
import fs from 'node:fs/promises';
import sharp from 'sharp';

const sequences = { 'crane-lift': ['crane', 158, 4], 'crane-turn': ['crane-turn', 96, 2], 'crane-place': ['crane-place', 96, 2], 'truck-turn': ['truck-turn', 88, 2] };
const manifest = {};
for (const [name, [source, last, step]] of Object.entries(sequences)) {
  const frames = [];
  await fs.mkdir(`public/images/journey/${name}`, { recursive: true });
  for (let index = 0; index <= last; index += step) frames.push(index);
  if (frames.at(-1) !== last) frames.push(last);
  let next = 0;
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (next < frames.length) {
      const index = frames[next++];
      const sourcePath = `public/images/${source}/${String(index).padStart(3, '0')}.avif`;
      const { data, info } = await sharp(sourcePath).resize(name === 'truck-turn' ? 1600 : 1280).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      // The crane renders use an opaque white matte. Remove only near-white
      // pixels; steel shading and the black/blue machinery remain untouched.
      if (name !== 'truck-turn') for (let pixel = 0; pixel < data.length; pixel += 4) {
        const minimum = Math.min(data[pixel], data[pixel + 1], data[pixel + 2]);
        if (minimum > 248) data[pixel + 3] = Math.round((255 - minimum) / 7 * 255);
      }
      await sharp(data, { raw: info }).webp({ quality: 88, alphaQuality: 100 }).toFile(`public/images/journey/${name}/${String(index).padStart(3, '0')}.webp`);
    }
  }));
  manifest[name] = frames.map(index => `/images/journey/${name}/${String(index).padStart(3, '0')}.webp`);
}
await fs.writeFile('lib/reference-sequences.json', JSON.stringify(manifest, null, 2));
console.log('Prepared', Object.values(manifest).reduce((sum, frames) => sum + frames.length, 0), 'reference frames');
