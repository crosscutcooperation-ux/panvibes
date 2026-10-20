import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = new URL('../', import.meta.url);
const posts = JSON.parse(await readFile(new URL('app/blog/posts.json', root), 'utf8'));
const urls = new Set();
const hashes = new Set();
for (const post of posts) {
  assert.ok(post.image?.startsWith('/assets/blog/editorial/'), `${post.slug}: assign a new editorial image`);
  assert.ok(!urls.has(post.image), `${post.slug}: repeated image URL`);
  urls.add(post.image);
  const file = new URL(`public${post.image}`, root);
  const bytes = await readFile(file);
  const digest = createHash('sha256').update(bytes).digest('hex');
  assert.ok(!hashes.has(digest), `${post.slug}: duplicate image file content`);
  hashes.add(digest);
  const metadata = await sharp(fileURLToPath(file)).metadata();
  assert.equal(metadata.width, 1200, `${post.slug}: image width`);
  assert.equal(metadata.height, 800, `${post.slug}: image height`);
  const thumb = new URL(`public${post.image.replace(/\.webp$/, '-thumb.webp')}`, root);
  const small = await sharp(fileURLToPath(thumb)).metadata();
  assert.equal(small.width, 480, `${post.slug}: thumbnail width`);
  assert.equal(small.height, 320, `${post.slug}: thumbnail height`);
}
console.log(`${posts.length} blog images checked: unique URLs, unique file contents, correct image dimensions.`);
