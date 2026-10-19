import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.SITE_URL||'http://127.0.0.1:3001';
const browser=await chromium.launch();
const output='.next/owner-review';fs.mkdirSync(output,{recursive:true});
try{
 const desktop=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];desktop.on('pageerror',e=>errors.push(e.message));
 await desktop.goto(base+'/products',{waitUntil:'commit'});
 await desktop.locator('.route-loader').waitFor({state:'visible'});
 await desktop.locator('.route-loader').waitFor({state:'hidden'});
 // Test actual backdrop sampling for the brand, not just root header tone.
 await desktop.evaluate(()=>{const canvas=document.createElement('canvas');canvas.id='brand-test';canvas.width=innerWidth;canvas.height=260;canvas.style.cssText='position:fixed;inset:0 0 auto;width:100%;height:260px;z-index:70';document.body.append(canvas)});
 for(const [fill,ink] of [['#104e87','white'],['#ffffff','blue']]){
  await desktop.evaluate(fill=>{const c=document.querySelector('#brand-test');c.getContext('2d').fillStyle=fill;c.getContext('2d').fillRect(0,0,c.width,c.height)},fill);
  await desktop.waitForFunction(ink=>document.querySelector('.header-brand').dataset.ink===ink,ink);
  await desktop.screenshot({path:output+'/logo-on-'+ink+'.png'});
 }
 await desktop.evaluate(()=>document.querySelector('#brand-test').remove());
 await desktop.goto(base+'/about',{waitUntil:'networkidle'});
 await desktop.waitForFunction(()=>document.querySelector('logistics-about')?.dataset.brandStyle==='unbranded');
 await desktop.screenshot({path:output+'/about-unbranded.png'});
 await desktop.goto(base+'/',{waitUntil:'networkidle'});
 await desktop.waitForFunction(()=>document.querySelector('.trade-journey-v2')?.dataset.scrollEnd);
 const phase=async(page,time)=>{await page.evaluate(time=>{const e=document.querySelector('.trade-journey-v2');scrollTo(0,+e.dataset.scrollStart+(+e.dataset.scrollEnd-+e.dataset.scrollStart)*time/40)},time);await page.waitForFunction(t=>Math.abs(+document.querySelector('.trade-journey-v2').dataset.phase-t)<.12,time);await page.waitForTimeout(600)};
 for(const t of [8.5,12.7,15.1,25,34]){await phase(desktop,t);await desktop.screenshot({path:output+'/baked-phase-'+t+'.png'});}
 assert.equal(await desktop.locator('.ship-container-branding').count(),0);
 assert.match(await desktop.locator('.motion-ship>img').getAttribute('src'),/branded/);
 for(const width of [320,390]){
  const page=await browser.newPage({viewport:{width,height:844},isMobile:true,hasTouch:true});page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/products',{waitUntil:'networkidle'});await page.locator('.route-loader').waitFor({state:'hidden'});
  for(const row of await page.locator('.range-row[data-sector=food]').all()){
   const toggle=row.locator('.range-toggle');if(await row.getAttribute('data-open')!=='true')await toggle.click();
   await page.waitForTimeout(350);
   const buttons=await row.locator('.range-enquiry,.range-quick-enquiry').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().toJSON()));
   assert.equal(buttons.length,2);assert.ok(buttons[0].bottom+8<=buttons[1].top,'Enquiry actions need their own space at '+width);
   for(const r of buttons)assert.ok(r.left>=0&&r.right<=width+1);
   const last=await row.locator('.range-types li').last().boundingBox();
   if(last)assert.ok(last.y+last.height<=buttons[0].top+1,'Product options must not run beneath the actions');
  }
  await page.goto(base+'/',{waitUntil:'networkidle'});await page.locator('.route-loader').waitFor({state:'hidden'});await phase(page,30);
  const cards=await page.locator('.motion-industry-card').evaluateAll(nodes=>nodes.map(e=>({box:e.getBoundingClientRect().toJSON(),text:e.querySelector('p').getBoundingClientRect().toJSON(),photo:e.querySelector('.motion-industry-photo').getBoundingClientRect().toJSON()})));
  for(let i=0;i<cards.length;i++){assert.ok(cards[i].text.top>=cards[i].photo.bottom);if(i)assert.ok(cards[i].box.top>=cards[i-1].text.bottom+8,'Industry descriptions must not overlap the next card');}
  const title=await page.locator('.motion-industry-title').boundingBox();assert.ok(title.x+title.width<cards[0].box.left-12);
  await page.screenshot({path:output+'/industry-'+width+'.png'});await page.close();
 }
 assert.deepEqual(errors,[]);
 console.log('PASS: loader, adaptive brand ink, unbranded About doors, baked animation/ship assets, 320px/390px product actions and industry descriptions.');
}finally{await browser.close()}
