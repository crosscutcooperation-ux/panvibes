import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const origin = process.env.SITE_URL || 'http://127.0.0.1:3000';
const productSource = await fs.readFile(new URL('../lib/export-products.ts', import.meta.url), 'utf8');
const productRoutes = [...productSource.matchAll(/slug: '([^']+)'/g)].map(match => `/products/${match[1]}`);
const routes = ['/', '/about', '/services', '/products', '/blog', '/contact', '/products/chemicals', '/quality', '/export-from-india', '/guides', '/guides/ginger-powder-flakes-whole-buying-guide', '/guides/bulk-ingredient-quotation-checklist', ...productRoutes];
const chemicals = JSON.parse(await fs.readFile(new URL('../lib/chemicals.json', import.meta.url), 'utf8'));
const canonicalOrigin = 'https://panvibes.com';
const posts = JSON.parse(await fs.readFile(new URL('../app/blog/posts.json', import.meta.url), 'utf8'));
const catalogue = JSON.parse(await fs.readFile(new URL('../lib/product-types.json', import.meta.url), 'utf8'));
const assets = new Set();
const titles = new Set();
const descriptions = new Set();
for (const route of [...routes, ...posts.map(post => `/blog/${post.slug}`)]) {
  const response = await fetch(new URL(route, origin));
  assert.equal(response.status, 200, `${route} must return 200`);
  const html = await response.text();
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  assert.ok(title, `${route}: missing title`);
  assert.ok(description, `${route}: missing description`);
  assert.ok(!titles.has(title), `${route}: duplicate title`);
  assert.ok(!descriptions.has(description), `${route}: duplicate description`);
  titles.add(title); descriptions.add(description);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  assert.equal(canonical && new URL(canonical).href, new URL(route, canonicalOrigin).href, `${route}: incorrect canonical`);
  assert.match(html, /property="og:title"/, `${route}: missing social metadata`);
  assert.match(html, /name="twitter:card" content="summary_large_image"/, `${route}: missing social card`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
  assert.ok(schemas.some(schema => schema['@type'] === 'Organization'), `${route}: missing organization schema`);
  assert.match(html, /Open PanVibes catalog assistant/, `${route}: missing chat launcher`);
  assert.match(html, /Email PanVibes export sales/, `${route}: missing email shortcut`);
  if (productRoutes.includes(route)) {
    assert.ok(schemas.some(schema => schema['@type'] === 'Product'), `${route}: missing product schema`);
    assert.ok(schemas.some(schema => schema['@type'] === 'FAQPage'), `${route}: missing buyer FAQ schema`);
    for (const cta of ['Request a Bulk Quote', 'Get COA', 'Request a Sample']) assert.ok(html.includes(cta), `${route}: missing ${cta}`);
    assert.doesNotMatch(JSON.stringify(schemas), /priceCurrency|aggregateRating/, `${route}: unverified prices or reviews`);
  }
  if (route === '/products/chemicals') {
    assert.equal((html.match(/class="chemical-group"/g) || []).length, 9, 'Expected all nine chemical groups in initial HTML');
    assert.equal((html.match(/aria-label="Enquire about /g) || []).length, 51, 'Expected all 51 chemical listings');
    for (const group of chemicals.groups) assert.ok(html.includes(`id="${group.slug}"`), `Missing chemical group ${group.name}`);
    assert.doesNotMatch(html, /Ethanol \(All Grades\)/, 'Superseded chemical listing returned');
  }
  assert.match(html, /Main navigation/, `${route}: missing navbar`);
  assert.match(html, /Footer company navigation/, `${route}: missing footer`);
  assert.equal((html.match(/<header class="site-header/g)||[]).length,1,`${route}: expected exactly one shared header`);
  assert.match(html,/panvibes-logo-transparent/,`${route}: missing transparent logo`);
  assert.doesNotMatch(html,/class="pan-footer-top"/,`${route}: removed footer introduction returned`);
  if(route==='/products'){
    assert.equal((html.match(/class="range-enquiry"/g)||[]).length,catalogue.categories.length,'Every category needs an enquiry action');
    assert.equal((html.match(/class="range-type-name"/g)||[]).length,catalogue.categories.filter(category=>category.key!=='industrial-chemicals').reduce((count,category)=>count+category.types.length,0),'Every food and material type needs an enquiry action');
    assert.equal((html.match(/class="chemical-row"/g)||[]).length,51,'The product page must include all 51 chemical listings');
    assert.ok(html.indexOf('class="product-range"')<html.indexOf('id="ingredient-pages-title"'),'The product range must precede the ingredient links');
    assert.equal((html.match(/data-sector="food"/g)||[]).length,8,'Expected eight remaining food and nutrition categories');
    assert.doesNotMatch(html,/Indian Flavours Ready in Minutes|Dehydrated Sprouts|Sprouted Moth|Puran|Probiotics|Flaxseed|Vanilla Beans|Saffron/,'Removed catalog products must not return');
    assert.match(html,/Ashwagandha/,'Ashwagandha must appear in the catalog');
    assert.equal((html.match(/data-sector="industrial"/g)||[]).length,3,'Expected three compact industrial categories');
    const industrial=html.slice(html.indexOf('data-product-group="industrial"'));
    assert.ok(industrial,'Missing separate industrial section');
    for(const name of ['Chemicals','Aggregate','Construction Admixtures'])assert.ok(industrial.includes(name),`Industrial section missing ${name}`);
  }
  if(route==='/contact')assert.doesNotMatch(html,/Local roots\./,'Removed Contact signoff returned');
  assert.doesNotMatch(html, /class="undefined(?:\s|\")/, `${route}: missing CSS module exports`);
  for (const destination of ['/', '/about', '/services', '/products', '/blog', '/contact']) assert.ok(html.includes(`href="${destination}"`), `${route}: missing link to ${destination}`);
  for (const [, asset] of html.matchAll(/(?:src|href)="(\/[^"<>]+)"/g)) {
    const url = new URL(asset.replaceAll('&amp;', '&'), origin);
    if (/\.(?:css|js|png|jpe?g|svg|webp|avif|mp4|woff2?)$/.test(url.pathname)) assets.add(url.href);
  }
}
const robots = await fetch(new URL('/robots.txt', origin));
assert.equal(robots.status, 200);
assert.ok((await robots.text()).includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`));
const sitemap = await fetch(new URL('/sitemap.xml', origin));
assert.equal(sitemap.status, 200);
const xml = await sitemap.text();
for (const route of [...routes, ...posts.map(post => `/blog/${post.slug}`)]) assert.ok(xml.includes(`<loc>${canonicalOrigin}${route}</loc>`), `Sitemap missing ${route}`);
assert.ok(!xml.includes('/mobile-preview'), 'Preview must not appear in sitemap');
const ogImage = await fetch(new URL('/opengraph-image', origin));
assert.equal(ogImage.status, 200, 'Social image must load');
assert.match(ogImage.headers.get('content-type'), /image\/png/);
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
console.log(`PASS: ${routes.length} pages, ${posts.length} articles, unique metadata, canonicals, JSON-LD, 51 chemical listings, sitemap, robots, social image, shared contact widgets, ${assets.size} assets and unknown-article handling.`);
