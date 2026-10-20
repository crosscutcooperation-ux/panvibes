import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const origin = process.env.BASE_URL || 'http://127.0.0.1:3001';
const assets = JSON.parse(readFileSync(new URL('../lib/hero-video-assets.json', import.meta.url)));
for (const [variant, asset] of Object.entries(assets)) {
  const response = await fetch(new URL(asset.src, origin), {
    headers: { Range: 'bytes=0-1023' }, signal: AbortSignal.timeout(20000),
  });
  assert.equal(response.status, 206, `${variant}: server must support byte-range seeking`);
  assert.match(response.headers.get('content-type') || '', /video\/mp4/);
  assert.equal(response.headers.get('content-range'), `bytes 0-1023/${asset.bytes}`);
  assert.equal((await response.arrayBuffer()).byteLength, 1024);
  assert.match(response.headers.get('cache-control') || '', /max-age=31536000/);
  console.log(`PASS: ${variant}, ${asset.bytes} bytes, MP4, partial content and versioned caching`);
}
const poster = await fetch(new URL('/media/home-hero/hero-desert-branded-poster.jpg', origin), { method: 'HEAD', signal: AbortSignal.timeout(20000) });
assert.equal(poster.status, 200, 'The poster fallback must be deployed too');
