import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const assets=JSON.parse(readFileSync('lib/hero-video-assets.json','utf8'));
const browser=await chromium.launch({headless:true});
const base=process.env.BASE_URL||'http://127.0.0.1:3034';
try{
  for(const variant of ['desktop','mobile']){
    const mobile=variant==='mobile';
    const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:900},isMobile:mobile,hasTouch:mobile});
    const page=await context.newPage(),cdp=await context.newCDPSession(page),requests=[],deferred=[],errors=[];
    await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
    cdp.on('Network.requestWillBeSent',event=>{if(event.request.url.includes('.mp4'))requests.push({type:event.type,url:event.request.url});});
    page.on('request',request=>{if(/journey-.*\.bin|\/land\.json/.test(request.url()))deferred.push(request.url());});
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(base,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>document.querySelector('.home-video-stage')?.dataset.videoState==='ready',null,{timeout:45000});
    await page.locator('.home-loader').waitFor({state:'hidden'});
    assert.ok(requests.length);
    assert.ok(requests.every(request=>request.type==='Media'),'Every MP4 request must be native Media, never Fetch');
    assert.ok(requests.every(request=>request.url.endsWith(assets[variant].src)));
    assert.equal(await page.locator('video').evaluate(video=>new URL(video.currentSrc).pathname),assets[variant].src);
    assert.deepEqual(deferred,[],'Journey and map downloads must stay off the opening path');
    assert.deepEqual(errors,[]);
    console.log(`PASS: cold-cache ${variant} MP4 is native Media; no initial journey/land requests; one opening loader`);
    if(!mobile){
      await page.setViewportSize({width:390,height:844});
      assert.equal(await page.locator('.home-loader').count(),0,'Changing breakpoint must not reopen the loader');
      await page.waitForFunction(()=>document.querySelector('video')?.dataset.source.includes('mobile-')&&document.querySelector('.home-video-stage')?.dataset.videoState==='ready');
    }
    await context.close();
  }
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage(),bytes=readFileSync(`public${assets.mobile.src}`),prefix=bytes.subarray(0,256*1024),held=[];
  await page.route('**/*.mp4',route=>{
    const start=Number(route.request().headers().range?.match(/bytes=(\d+)-/)?.[1]||0);
    if(start===0)return route.fulfill({status:206,headers:{'Content-Type':'video/mp4','Accept-Ranges':'bytes','Content-Range':`bytes 0-${prefix.length-1}/${bytes.length}`},body:prefix});
    held.push(route);
  });
  await page.goto(base,{waitUntil:'domcontentloaded'});
  await page.locator('.home-loader').waitFor({state:'hidden',timeout:10000});
  const partial=await page.locator('video').evaluate(video=>({ready:video.readyState,duration:video.duration,end:video.buffered.length?video.buffered.end(video.buffered.length-1):0}));
  assert.ok(partial.ready>=2&&partial.end<partial.duration,'The first usable frame must release the loader without the complete video');
  console.log('PASS: only the first 256 KB of the full-quality mobile MP4 unlocks the opening; the rest can stream later');
  await context.close();
  const stalled=await browser.newContext(),slow=await stalled.newPage(),pending=[];
  await slow.route('**/*.mp4',route=>pending.push(route));
  await slow.goto(base,{waitUntil:'domcontentloaded'});
  await slow.waitForFunction(()=>document.querySelector('.home-video-stage')?.dataset.videoState==='fallback',null,{timeout:16000});
  await slow.locator('.home-loader').waitFor({state:'hidden'});
  assert.notEqual(await slow.evaluate(()=>document.documentElement.style.overflow),'hidden');
  console.log('PASS: a stream that never responds releases the page to its poster after the bounded startup timeout');
  await stalled.close();
}finally{await browser.close();}
