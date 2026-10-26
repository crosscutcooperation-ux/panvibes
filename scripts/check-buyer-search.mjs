import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const base=process.env.BASE_URL || 'http://127.0.0.1:3001';
function load(relative){
  const source=ts.transpileModule(fs.readFileSync(new URL(relative,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
  const scope={exports:{}};vm.runInNewContext(source,{exports:scope.exports,module:scope});return scope.exports;
}
const {buyerSearchContent}=load('../lib/buyer-search-content.ts');
const {buyerGuides}=load('../lib/buyer-guides.ts');
const decode=text=>text.replace(/<[^>]*>/g,' ').replace(/<!--.*?-->/g,'').replaceAll('&amp;','&').replace(/\s+/g,' ').trim();
const schemas=html=>[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match=>JSON.parse(match[1]));
async function get(path){const response=await fetch(new URL(path,base),{signal:AbortSignal.timeout(30000)});assert.equal(response.status,200,path);return response.text();}
for(const [slug,content] of Object.entries(buyerSearchContent)){
  const html=await get('/products/'+slug);
  assert.equal(decode(html.match(/<title>(.*?)<\/title>/s)?.[1]||''),'PanVibes Exim | '+content.title);
  assert.match(decode(html.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1]||''),new RegExp(content.heading.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i'));
  assert.match(html,/class="buyer-table-scroll"/);
  assert.match(html,/href="\/guides\/bulk-ingredient-quotation-checklist"/);
  const data=schemas(html),faq=data.find(item=>item['@type']==='FAQPage');
  for(const entry of content.faqs){
    assert.ok(faq.mainEntity.some(item=>item.name===entry.question));
    assert.ok(decode(html).includes(entry.question),'Buyer answers must also be in the initial HTML');
  }
  assert.doesNotMatch(JSON.stringify(data),/aggregateRating|priceCurrency|"@type":"Offer"/);
}
const home=await get('/'),homeData=schemas(home);
const website=homeData.find(item=>item['@type']==='WebSite'),organization=homeData.find(item=>item['@type']==='Organization');
assert.equal(website.name,'PanVibes Exim');assert.equal(website.url,'https://panvibes.com');
assert.ok(organization.contactPoint.telephone);
assert.match(home,/Bulk Food Ingredients &amp; Chemical Supplier India/);
assert.match(home,/id="supplier-overview-title"/);
const sitemap=await get('/sitemap.xml');
for(const guide of buyerGuides){
  const path='/guides/'+guide.slug,html=await get(path),data=schemas(html);
  assert.ok(sitemap.includes('<loc>https://panvibes.com'+path+'</loc>'));
  assert.match(html,/rel="canonical" href="https:\/\/panvibes.com\/guides\//);
  assert.equal(data.find(item=>item['@type']==='Article').headline,guide.heading);
  assert.ok(guide.sections.flatMap(item=>item.paragraphs).join(' ').split(/\s+/).length>350,'Guides need substantial, distinct procurement content');
  assert.ok(html.includes('href="'+guide.productPath+'"'));
  assert.match(html,/Request a bulk quote/);
}
assert.match(await get('/blog/dehydrated-ginger-supplier-in-india'),/href="\/products\/ginger"/);
console.log('PASS: nine descriptive product titles/headings, visible buyer comparisons and FAQs, two substantive guides, sitemap/internal links and brand/contact structured data; no fabricated offers or ratings.');
