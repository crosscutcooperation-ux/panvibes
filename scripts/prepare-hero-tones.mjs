// Sample the known mobile film offline instead of reading video pixels during
// every scroll seek on a phone. Re-run when replacing the branded master.
import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
const width = 48, height = 28, frameBytes = width * height * 3;
const result = spawnSync(process.env.FFMPEG || 'ffmpeg', [
  '-hide_banner', '-loglevel', 'error', '-i', 'public/media/home-hero/hero-desert-branded-desktop.mp4',
  '-map', '0:v:0', '-an', '-vf', `scale=${width}:${height}`, '-pix_fmt', 'rgb24', '-f', 'rawvideo', 'pipe:1',
], { maxBuffer: 4 * 1024 * 1024 });
if (result.error || result.status !== 0) throw result.error || new Error(result.stderr.toString());
const count = result.stdout.length / frameBytes;
if (count !== 296) throw new Error('Update the hero timing before replacing its frame colour map');
const tones = [];
for (let frame = 0; frame < count; frame++) {
  const progress = frame / (count - 1) * .86;
  const t = Math.max(0, Math.min(1, (progress - .48) / .38));
  const zoom = t * t * (3 - 2 * t);
  const videoWidth = (1920 / 660) * (1 - zoom) + zoom;
  const column = Math.round((.5 + (.07 - .04 / videoWidth) * (1 - zoom)) * width);
  const offset = frame * frameBytes + column * 3;
  tones.push([...result.stdout.subarray(offset, offset + 3)]);
}
writeFileSync('lib/hero-mobile-tones.json', JSON.stringify(tones) + '\n');
console.log(`Prepared ${tones.length} mobile background tones without runtime pixel readback`);
