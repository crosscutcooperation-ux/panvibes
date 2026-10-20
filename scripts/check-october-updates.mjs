import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.SITE_URL||'http://127.0.0.1:3001';
const output='tmp/october-review';fs.mkdirSync(output,{recursive:true});
const browser=await chromium.launch();
const errors=[];
try {
 for(const viewport of process.env.MAP_ONLY?[]:[{width:1440,height:1000},{width:390,height:844},{width:320,height:740},{width:768,height:1024},{width:844,height:390},{width:2560,height:1080}]) {
  const page=await browser.newPage({viewport});page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base,{waitUntil:'networkidle'});
  await page.locator('.route-loader').waitFor({state:'hidden'});
  await page.waitForFunction(()=>document.querySelector('.home-video-hero')?.dataset.scrollEnd&&document.querySelector('video')?.readyState>=2);
  assert.match(await page.locator('.home-hero-video').getAttribute('src'),/gemini_generated_video_282720c2\.mp4/);
  const industries=await page.locator('.motion-industry-card img').evaluateAll(nodes=>nodes.map(n=>decodeURIComponent(n.getAttribute('src'))));
  assert.equal(industries.length,4);assert.ok(industries.every(src=>src.includes('/photos/')));
  for(const phase of [0,.55,.85,.95]) {
   await page.evaluate(p=>{const hero=document.querySelector('.home-video-hero');scrollTo(0,Number(hero.dataset.scrollStart)+(Number(hero.dataset.scrollEnd)-Number(hero.dataset.scrollStart))*p);},phase);
   await page.waitForFunction(p=>Math.abs(Number(document.querySelector('.home-video-stage').dataset.heroProgress)-p)<.015,phase);
   await page.waitForTimeout(250);
   assert.equal(await page.locator('.support-email').count(),1);
   assert.match(await page.locator('.support-email').getAttribute('href'),/^mailto:info@panvibesexim.com/);
   const geometry=await page.evaluate(()=>{
    const video=document.querySelector('.home-hero-video'),box=video.getBoundingClientRect(),mail=document.querySelector('.hero-email').getBoundingClientRect();
    const fit=getComputedStyle(video).objectFit==='cover'?Math.max:Math.min,scale=fit(box.width/16,box.height/9),w=16*scale,h=9*scale;
    const x=box.left+(box.width-w)/2,y=box.top+(box.height-h)/2;
    const mark={left:Math.max(0,box.left,x+w*1130/1280),right:Math.min(innerWidth,box.right,x+w*1190/1280),top:Math.max(0,box.top,y+h*568/720),bottom:Math.min(innerHeight,box.bottom,y+h*632/720)};
    const visible=mark.right>mark.left&&mark.bottom>mark.top&&Number(getComputedStyle(video).opacity)>.01;
    const covers=!visible||(mail.left<=mark.left+.5&&mail.right>=mark.right-.5&&mail.top<=mark.top+.5&&mail.bottom>=mark.bottom-.5);
    const stage=document.querySelector('.home-video-stage').getBoundingClientRect();
    const fullFrame=x>=stage.left-.5&&y>=stage.top-.5&&x+w<=stage.right+.5&&y+h<=stage.bottom+.5;
    const hero=document.querySelector('.home-video-hero').getBoundingClientRect();
    return {covers,visible,fullFrame,fit:getComputedStyle(video).objectFit,stageRatio:stage.width/stage.height,heroRatio:hero.width/hero.height,active:document.documentElement.dataset.heroEmail,overflow:document.documentElement.scrollWidth>innerWidth+1};
   });
   assert.ok(geometry.covers,`Mail must cover visible film credit at ${viewport.width}×${viewport.height}, phase ${phase}: ${JSON.stringify(geometry)}`);
   assert.equal(geometry.overflow,false);
   assert.equal(geometry.fullFrame,true,'Every edge of the original film must stay inside the hero');
   assert.equal(geometry.fit,'contain');
   assert.ok(Math.abs(geometry.stageRatio-16/9)<.002,'Hero frame must be exactly 16:9');
   assert.ok(await page.locator('.trade-journey-v2').evaluate(el=>el.getBoundingClientRect().top>=innerHeight-1),'Next section must stay out of view until the hero film and fade finish');
   assert.ok(await page.locator('.home-video-stage').evaluate(el=>Math.abs(el.getBoundingClientRect().top)<1),'The video stays in place throughout playback');
   if(phase===.95){await page.waitForFunction(()=>document.querySelector('.home-video-stage').dataset.videoComplete==='true');assert.equal(await page.locator('.home-video-stage').getAttribute('data-truck-owner'),'handoff');await page.waitForTimeout(400);}
   if(phase===0){
    const layout=await page.evaluate(()=>{const stage=document.querySelector('.home-video-stage').getBoundingClientRect(),header=document.querySelector('.site-header').getBoundingClientRect(),heading=document.querySelector('.hero-copy h1').getBoundingClientRect(),actions=document.querySelector('.hero-actions').getBoundingClientRect();return {top:stage.top,headerBottom:header.bottom,headingTop:heading.top,headingBottom:heading.bottom,actionsTop:actions.top,actionsBottom:actions.bottom,bottom:stage.bottom};});
    assert.ok(Math.abs(layout.top)<1,'Video must start behind the navigation, without a band above it');
    assert.ok(layout.headingTop>=layout.headerBottom&&layout.headingBottom<=layout.actionsTop,'Title must clear navigation and actions');
    assert.ok(layout.actionsBottom<=layout.bottom,'Hero actions must fit inside the 16:9 frame');
    assert.ok(await page.evaluate(()=>{const a=document.querySelector('.hero-actions').getBoundingClientRect(),b=document.querySelector('.hero-email').getBoundingClientRect();return a.right<=b.left||a.left>=b.right||a.bottom<=b.top||a.top>=b.bottom;}),'Hero actions must clear the email shortcut');
   }
   const clearActions=await page.evaluate(()=>{const mail=document.documentElement.dataset.heroEmail==='active'?'.hero-email':'.support-email';const nodes=[mail,'.support-launcher','.enquiry-global-button'].map(selector=>document.querySelector(selector).getBoundingClientRect());return nodes.every((a,i)=>nodes.slice(i+1).every(b=>a.right<=b.left||a.left>=b.right||a.bottom<=b.top||a.top>=b.bottom));});
   assert.equal(clearActions,true,`Floating actions must not overlap at ${viewport.width}×${viewport.height}, phase ${phase}`);
   if(phase===0||phase===.85||phase===.95)await page.screenshot({path:`${output}/hero-${viewport.width}-${viewport.height}-${phase}.png`});
  }
  await page.close();
 }
 for(const width of process.env.MAP_ONLY?[]:[1440,390,320]) {
  const page=await browser.newPage({viewport:{width,height:width===1440?1000:844}});page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'/products',{waitUntil:'networkidle'});await page.locator('.route-loader').waitFor({state:'hidden'});
  assert.doesNotMatch(await page.locator('.product-range').textContent(),/Vanilla Beans|Saffron/);
  const cashew=page.locator('.range-row').filter({has:page.getByRole('heading',{name:'Cashew & Other Dry Fruits',exact:true})});
  assert.match(decodeURIComponent(await cashew.locator('img').getAttribute('src')),/photos\/cashews.webp/);
  const row=page.locator('.range-row[data-sector=food]').first();await row.scrollIntoViewIfNeeded();
  if(width>=992)await row.hover();else await row.locator('.range-toggle').click();
  await page.waitForTimeout(100);
  const motion=await row.locator('.range-slide-body').evaluate(el=>({transform:getComputedStyle(el).transform,duration:getComputedStyle(el).transitionDuration}));
  assert.match(motion.duration,/0.6s/);assert.notEqual(motion.transform,'none');
  await page.waitForTimeout(650);
  assert.equal(await row.locator('.range-type-name:visible').count(),10);
  const last=row.locator('.range-types li').last();assert.equal(await last.isVisible(),true);
  const boxes=await row.evaluate(el=>({last:el.querySelector('.range-types li:last-child').getBoundingClientRect().bottom,action:el.querySelector('.range-enquiry').getBoundingClientRect().top,first:el.querySelector('.range-enquiry').getBoundingClientRect().bottom,second:el.querySelector('.range-quick-enquiry').getBoundingClientRect().top}));
  assert.ok(boxes.last<=boxes.action,`All Makhana types clear the enquiry action at ${width}`);
  if(width<992)assert.ok(boxes.first<=boxes.second,`Enquiry actions must not overlap at ${width}`);
  await row.screenshot({path:`${output}/makhana-${width}.png`});await page.close();
 }
 const map=await browser.newPage({viewport:{width:1440,height:1000}});map.on('pageerror',error=>errors.push(error.message));
 await map.goto(base+'/contact',{waitUntil:'networkidle'});const atlas=map.locator('.contact-atlas');await atlas.scrollIntoViewIfNeeded();
 await map.waitForFunction(()=>document.querySelector('.contact-atlas .globe-renderer')?.dataset.zoom);
 for(let replay=0;replay<2;replay++) {
  await atlas.getByRole('button',{name:'Click here for directions',exact:false}).click();
  assert.equal(await atlas.getAttribute('data-map-phase'),'zooming');await map.waitForTimeout(1700);
  const zoom=Number(await atlas.locator('.globe-renderer').getAttribute('data-zoom'));assert.ok(zoom<3.8&&zoom>1,'Original office dive must animate');
  if(!replay)await atlas.screenshot({path:output+'/contact-globe-dive.png'});
  await map.waitForFunction(()=>document.querySelector('.contact-atlas').dataset.mapPhase==='map');
  assert.equal(await atlas.locator('iframe').count(),1);assert.equal(await map.locator('.atlas-satellite-layer').count(),0);
  assert.match(await atlas.locator('.atlas-actions a').getAttribute('href'),/google.com\/maps\/dir/);
  await atlas.getByRole('button',{name:'3D globe'}).click();await map.waitForTimeout(700);
  assert.equal(await atlas.getAttribute('data-map-phase'),'globe');
 }
 await map.close();assert.deepEqual(errors,[]);
 console.log('PASS: new hero film, one responsive email shortcut covering the visible credit at six screen sizes, new industry/cashew photos, full Makhana sliding panels and clear actions at 1440/390/320, and original contact globe-to-office zoom with replay.');
} finally {await browser.close();}
