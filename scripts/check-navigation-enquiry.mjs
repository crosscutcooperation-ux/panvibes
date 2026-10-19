import { trackTestEnquiries } from './enquiry-test-cleanup.mjs';
let cleanup=()=>{};
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const loadPackage=createRequire(import.meta.url);
const {chromium}=loadPackage(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.SITE_URL||'http://127.0.0.1:3000';
const browser=await chromium.launch();
try {
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const page=await context.newPage();page.setDefaultTimeout(15000);
 cleanup=trackTestEnquiries(page);
 const errors=[],mutations=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(!['GET','HEAD'].includes(r.method()))mutations.push(r.url());});
 fs.mkdirSync('.next/buyer-review',{recursive:true});
 await page.goto(base+'/products',{waitUntil:'networkidle'});
 await page.waitForFunction(()=>getComputedStyle(document.querySelector('.desktop-nav a[href="/products"]')).color==='rgb(255, 255, 255)');
 await page.evaluate(()=>{
  const header=document.querySelector('.site-header'),canvas=document.createElement('canvas');canvas.id='contrast-test-surface';canvas.width=innerWidth;canvas.height=Math.ceil(header.getBoundingClientRect().height);canvas.style.cssText=`position:fixed;inset:0 0 auto;width:100vw;height:${canvas.height}px;z-index:70;`;
  const ctx=canvas.getContext('2d');ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width/2,canvas.height);ctx.fillStyle='#104e87';ctx.fillRect(canvas.width/2,0,canvas.width/2,canvas.height);document.body.append(canvas);
 });
 await page.waitForFunction(()=>getComputedStyle(document.querySelector('.desktop-nav a[href="/"]')).color==='rgb(16, 78, 135)'&&getComputedStyle(document.querySelector('.desktop-nav a[href="/contact"]')).color==='rgb(255, 255, 255)');
 for(const [fill,ink] of [['#104e87','rgb(255, 255, 255)'],['#ffffff','rgb(16, 78, 135)']]) {
  await page.evaluate(fill=>{const c=document.querySelector('#contrast-test-surface'),ctx=c.getContext('2d');ctx.fillStyle=fill;ctx.fillRect(0,0,c.width,c.height);},fill);
  await page.waitForFunction(ink=>[...document.querySelectorAll('.desktop-nav a')].every(e=>getComputedStyle(e).color===ink),ink);
 }
 await page.evaluate(()=>document.querySelector('#contrast-test-surface').remove());
 console.log('PASS: actual blue hero, mixed light/dark surfaces per link, and changing canvas pixels beneath the header.');
 const range=page.locator('.product-range');
 assert.equal(await range.locator('.range-row[data-sector="food"]').count(),8);
 assert.doesNotMatch(await range.textContent(),/Dehydrated Sprouts|Indian Flavours Ready in Minutes|Probiotics|Flaxseed/);
 const nutraceuticals=range.locator('.range-row[data-sector="food"]').filter({hasText:'Nutraceuticals'});
 assert.deepEqual((await nutraceuticals.locator('.range-type-name').allTextContents()).map(x=>x.replace('↗','').trim()),['Moringa Powder','Ashwagandha']);
 const fruits=range.locator('.range-row[data-sector="food"]').filter({hasText:'Dehydrated Fruits'});
 assert.deepEqual((await fruits.locator('.range-type-name').allTextContents()).map(x=>x.replace('↗','').trim()),['Banana Powder']);
 await nutraceuticals.locator('.range-toggle').focus();await page.keyboard.press('Enter');
 await nutraceuticals.getByRole('button',{name:'Enquire about Moringa Powder',exact:true}).click();
 const details=page.getByRole('dialog',{name:'Moringa Powder',exact:true});
 const position=await page.evaluate(()=>scrollY),url=page.url();
 await details.getByRole('button',{name:'Fill enquiry form'}).click();
 const form=page.getByRole('dialog',{name:'Enquiry form',exact:true});
 assert.equal(await form.locator('[name=product]').inputValue(),'Moringa Powder');
 assert.equal(page.url(),url);assert.ok(Math.abs(await page.evaluate(()=>scrollY)-position)<2);
 await form.locator('[name=name]').fill('Preview Buyer');await form.locator('[name=company]').fill('Preview Company');await form.locator('[name=email]').fill('buyer@example.com');await form.locator('[name=buyerCountry]').fill('UK');await form.locator('[name=quantity]').fill('200 kg');await form.locator('[name=country]').selectOption('UK');
 await form.getByRole('button',{name:'Submit enquiry'}).click();
 assert.match(await form.locator('.contact-draft-preview').innerText(),/Moringa Powder/);
 assert.match(await form.locator('.contact-draft-preview').innerText(),/200 kg/);
 await page.screenshot({path:'.next/buyer-review/inline-enquiry-desktop.png'});
 await form.getByRole('button',{name:'Close enquiry form'}).click();
 assert.equal(await details.isVisible(),true);await details.getByRole('button',{name:'Close product enquiry'}).click();
 assert.ok(Math.abs(await page.evaluate(()=>scrollY)-position)<2);
 await nutraceuticals.getByRole('button',{name:'Enquiry form',exact:false}).click();
 assert.equal(await form.locator('[name=product]').inputValue(),'Nutraceuticals');await form.getByRole('button',{name:'Close enquiry form'}).click();
 console.log('PASS: revised catalog, nested popup-to-form flow, selected product, draft preparation, direct form button, and unchanged route/scroll.');
 await page.goto(base+'/services',{waitUntil:'networkidle'});
 await page.getByRole('button',{name:'Export Solutions — view details',exact:true}).click();
 await page.locator('#service-details').getByRole('button',{name:'Fill enquiry form',exact:false}).click();
 assert.equal(await form.locator('[name=service]').inputValue(),'Export solutions');
 assert.equal(page.url(),base+'/services');
 await form.getByRole('button',{name:'Close enquiry form'}).click();
 await page.getByRole('button',{name:'Close service details'}).click();
 console.log('PASS: service detail popup opens the same-screen form with its selected service.');
 await page.goto(base+'/products/ashwagandha',{waitUntil:'networkidle'});
 await page.getByRole('button',{name:'Request a Bulk Quote'}).click();
 assert.equal(await form.locator('[name=product]').inputValue(),'Ashwagandha');assert.equal(page.url(),base+'/products/ashwagandha');await form.getByRole('button',{name:'Close enquiry form'}).click();
 for(const width of [390,320]) {
  await page.setViewportSize({width,height:844});await page.goto(base+'/products/ashwagandha',{waitUntil:'networkidle'});
  await page.getByRole('button',{name:'Enquiry ↗',exact:true}).click();
  const box=await form.boundingBox();assert.ok(box.x>=0&&box.x+box.width<=width+1);
  const dimensions=await form.evaluate(e=>({scroll:e.scrollWidth,width:e.clientWidth}));assert.ok(dimensions.scroll<=dimensions.width+1);
  if(width===390)await page.screenshot({path:'.next/buyer-review/inline-enquiry-mobile.png'});
  await page.keyboard.press('Escape');assert.equal(await form.isVisible(),false);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 }
 assert.deepEqual(errors,[]);assert.ok(mutations.every(url=>/\/api\/(chat|enquiries)$/.test(url))); 
 console.log('PASS: Ashwagandha enquiry, 390px/320px modal layouts, Escape dismissal, no browser errors and only authorized API calls.');
} finally {cleanup();await browser.close();}
