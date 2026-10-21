import assert from 'node:assert/strict';

const origin=process.env.BASE_URL||'http://127.0.0.1:3001';
const routes=['/','/about','/services','/products','/products/ginger','/blog','/contact','/quality','/export-from-india','/admin','/mobile-preview'];
let home;
for(const route of routes){
  const response=await fetch(new URL(route,origin),{signal:AbortSignal.timeout(20000)});
  assert.equal(response.status,200,route);
  const html=await response.text();
  assert.equal(html.includes('class="home-loader"'),['/','/mobile-preview'].includes(route),`${route}: the readiness loader belongs only to the animated homepage and its preview`);
  if(route==='/'){
    home=html;
    const hints=response.headers.get('link')||'';
    assert.ok(hints.includes('/media/home-hero/hero-desert-branded-poster.jpg'),'First-frame image must be preloaded from the HTTP response');
    assert.ok(hints.includes('fetchpriority="high"'),'First frame has high fetch priority');
    assert.ok(!html.includes('src="/images/branded/ship.webp"'),'Below-fold ship must wait for the journey');
  }
}
const scripts=[...new Set([...home.matchAll(/<script[^>]*src="([^"?]+)/g)].map(match=>match[1]))];
let bytes=0;
for(const script of scripts){
  const response=await fetch(new URL(script,origin),{signal:AbortSignal.timeout(20000)});
  assert.equal(response.status,200,script);
  bytes+=(await response.arrayBuffer()).byteLength;
}
assert.ok(bytes<900000,`Initial JS budget exceeded: ${bytes} bytes`);
const admin=await fetch(new URL('/api/admin/enquiries',origin));
assert.equal(admin.status,401,'Private enquiries must remain protected');
console.log(`PASS: ${routes.length} routes, homepage readiness loader, high-priority poster, protected admin, ${scripts.length} initial scripts / ${bytes} decoded JS bytes.`);
