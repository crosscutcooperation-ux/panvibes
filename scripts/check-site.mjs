import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const origin = process.env.SITE_URL || 'http://127.0.0.1:3000';
const routes = ['/', '/about', '/services', '/products', '/blog', '/contact'];
const posts = JSON.parse(await fs.readFile(new URL('../app/blog/posts.json', import.meta.url), 'utf8'));
const catalogue = JSON.parse(await fs.readFile(new URL('../lib/product-types.json', import.meta.url), 'utf8'));
const assets = new Set();
for (const route of [...routes, ...posts.map(post => `/blog/${post.slug}`)]) {
  const response = await fetch(new URL(route, origin));
  assert.equal(response.status, 200, `${route} must return 200`);
  const html = await response.text();
  assert.match(html, /Main navigation/, `${route}: missing navbar`);
  assert.match(html, /Footer company navigation/, `${route}: missing footer`);
  assert.equal((html.match(/<header class="site-header/g)||[]).length,1,`${route}: expected exactly one shared header`);
  assert.match(html,/panvibes-logo-transparent/,`${route}: missing transparent logo`);
  assert.doesNotMatch(html,/class="pan-footer-top"/,`${route}: removed footer introduction returned`);
  if(route==='/products'){
    assert.equal((html.match(/class="range-enquiry"/g)||[]).length,catalogue.categories.length,'Every category needs an enquiry action');
    assert.equal((html.match(/class="range-type-name"/g)||[]).length,catalogue.categories.reduce((count,category)=>count+category.types.length,0),'Every product type needs an enquiry action');
    assert.equal((html.match(/data-sector="food"/g)||[]).length,10,'Food and nutrition must remain separate from industrial products');
    assert.equal((html.match(/data-sector="industrial"/g)||[]).length,3,'Expected three compact industrial categories');
    const industrial=html.match(/<section[^>]+data-product-group="industrial"[^>]*>([\s\S]*?)<\/section>/)?.[1];
    assert.ok(industrial,'Missing separate industrial section');
    for(const name of ['Chemicals','Aggregate','Construction Admixtures'])assert.ok(industrial.includes(name),`Industrial section missing ${name}`);
  }
  if(route==='/contact')assert.doesNotMatch(html,/Local roots\./,'Removed Contact signoff returned');
  assert.doesNotMatch(html, /class="undefined(?:\s|\")/, `${route}: missing CSS module exports`);
  for (const destination of routes) assert.ok(html.includes(`href="${destination}"`), `${route}: missing link to ${destination}`);
  for (const [, asset] of html.matchAll(/(?:src|href)="(\/[^"<>]+)"/g)) {
    const url = new URL(asset.replaceAll('&amp;', '&'), origin);
    if (/\.(?:css|js|png|jpe?g|svg|webp|avif|mp4|woff2?)$/.test(url.pathname)) assets.add(url.href);
  }
}
const pending = [...assets];
for (let index = 0; index < pending.length; index += 8) {
  await Promise.all(pending.slice(index, index + 8).map(async url => {
    const response = await fetch(url, { method: 'HEAD' });
    assert.equal(response.status, 200, `Missing asset: ${url}`);
  }));
}
const missing = await fetch(new URL('/blog/this-story-does-not-exist', origin));
const missingHtml = await missing.text();
// Cache Components may flush a streamed response with status 200 before notFound().
assert.ok([200, 404].includes(missing.status), 'Unexpected status for unknown story');
assert.match(missingHtml, /This page could not be found/, 'Unknown stories must show the not-found page');
assert.match(missingHtml, /noindex/, 'Unknown stories must be excluded from indexing');
console.log(`PASS: ${routes.length} main pages, ${posts.length} articles, shared navigation/footer, ${assets.size} assets and unknown-article handling.`);
