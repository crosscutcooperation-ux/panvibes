// Run offline, never during a request or on the Lightsail production server.
// Preserve the original branded master and its 296-frame handoff geometry.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, renameSync, statSync } from 'node:fs';
import path from 'node:path';

const directory = path.resolve('public/media/home-hero');
const source = path.join(directory, 'hero-desert-branded-desktop.mp4');
const manifestPath = path.resolve('lib/hero-video-assets.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const variants = [['desktop', 1280, 27, 6], ['mobile', 1920, 27, 3], ['dataSaver', 768, 28, 6]];
// Pass variant names to rebuild only the required assets, preserving the rest.
const requested = process.argv.slice(2);
if (requested.some(name => !variants.some(([variant]) => variant === name))) {
  throw new Error('Choose desktop, mobile or dataSaver');
}
for (const [variant, width, crf, keyframes] of variants) {
  if (requested.length && !requested.includes(variant)) continue;
  const temporary = path.join(directory, `web-${variant}.mp4`);
  const result = spawnSync(process.env.FFMPEG || 'ffmpeg', [
    '-y', '-hide_banner', '-loglevel', 'error', '-i', source,
    '-map', '0:v:0', '-an', '-vf', `scale=${width}:-2:flags=lanczos`,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf),
    // Keep Full HD detail and cap decode work to three frames per seek.
    // Fast decoding disables expensive codec tools without changing timing.
    ...(variant === 'mobile' ? ['-tune', 'fastdecode', '-refs', '1'] : []),
    '-g', String(keyframes), '-keyint_min', String(keyframes), '-sc_threshold', '0', '-bf', '0',
    '-pix_fmt', 'yuv420p', '-tag:v', 'avc1', '-movflags', '+faststart', temporary,
  ], { stdio: 'inherit' });
  if (result.error || result.status !== 0) throw result.error || new Error('Video encoding failed');
  const hash = createHash('sha256').update(readFileSync(temporary)).digest('hex').slice(0, 12);
  const filename = `hero-web-${variant}-${hash}.mp4`;
  renameSync(temporary, path.join(directory, filename));
  manifest[variant] = { src: `/media/home-hero/${filename}`, bytes: statSync(path.join(directory, filename)).size };
  console.log(`${variant}: ${manifest[variant].bytes} bytes`);
}
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
