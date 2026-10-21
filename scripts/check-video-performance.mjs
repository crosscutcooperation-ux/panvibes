import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.BASE_URL || 'http://127.0.0.1:3001';
const assets = JSON.parse(readFileSync(new URL('../lib/hero-video-assets.json', import.meta.url)));
mkdirSync('tmp/video-checks', { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  for (const mobile of [false, true]) {
    const context = await browser.newContext({ viewport: mobile ? { width:390,height:844 } : {width:1440,height:900}, isMobile:mobile, hasTouch:mobile, deviceScaleFactor:1 });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base, {waitUntil:'domcontentloaded'});
    await page.locator('.home-loader').waitFor({state:'hidden',timeout:120000});
    assert.ok((await page.locator('video').getAttribute('data-source')).includes(mobile ? assets.mobile.src : assets.desktop.src));
    assert.equal(await page.locator('video').getAttribute('data-download-complete'),'true');
    await page.screenshot({path:`tmp/video-checks/${mobile?'mobile':'desktop'}-start.png`});
    for (const fraction of [.22, .6, .86, 1, .3, 0]) {
      await page.evaluate(fraction => {
        const root=document.querySelector('.home-video-hero');
        const start=Number(root.dataset.scrollStart),end=Number(root.dataset.scrollEnd);
        window.scrollTo({top:start+(end-start)*fraction,behavior:'instant'});
      }, fraction);
      await page.waitForFunction(fraction => {
        const video=document.querySelector('video');
        const finalFrame=Math.round(video.duration*30)-1;
        const expected=(Math.round(finalFrame*Math.min(1,fraction/.86))+.5)/30;
        return !video.seeking&&Math.abs(video.currentTime-expected)<.04;
      }, fraction, {timeout:12000});
    }
    assert.deepEqual(errors, []);
    console.log(`PASS: ${mobile?'mobile':'desktop'} first frame, loader, forward/reverse frame-accurate seeks and final-frame handoff`);
    await context.close();
  }
  // A slow mobile connection must reveal the page instead of a long loader.
  const slow = await browser.newContext({ viewport:{width:390,height:844},isMobile:true,hasTouch:true });
  const page = await slow.newPage();
  const cdp = await slow.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200*1024,uploadThroughput:50*1024,connectionType:'cellular3g'});
  await page.goto(base,{waitUntil:'domcontentloaded'});
  await page.locator('.home-loader').waitFor({state:'hidden',timeout:180000});
  assert.notEqual(await page.evaluate(()=>document.documentElement.style.overflow),'hidden');
  await page.waitForFunction(()=>['ready','fallback'].includes(document.querySelector('.home-video-stage')?.dataset.videoState),null,{timeout:16000});
  console.log(`PASS: slow 3G remains usable (${await page.locator('.home-video-stage').getAttribute('data-video-state')})`);
  await slow.close();

  const failure = await browser.newContext();
  const blocked = await failure.newPage();
  await blocked.route('**/*.mp4',route=>route.abort('failed'));
  await blocked.goto(base,{waitUntil:'domcontentloaded'});
  await blocked.waitForFunction(()=>document.querySelector('.home-video-stage')?.dataset.videoState==='fallback');
  await blocked.getByRole('button',{name:'Continue without animation'}).click();
  await blocked.locator('.home-loader').waitFor({state:'hidden'});
  assert.equal(await blocked.locator('.home-video-hero').evaluate(el=>el.parentElement.classList.contains('pin-spacer')),false);
  await blocked.screenshot({path:'tmp/video-checks/fallback.png'});
  console.log('PASS: missing video retains the loader until the visitor chooses a static view');
  await failure.close();

  const reduced = await browser.newContext({reducedMotion:'reduce'});
  const still = await reduced.newPage();
  const requests=[];
  still.on('request',request=>{if(request.url().includes('.mp4'))requests.push(request.url());});
  await still.goto(base,{waitUntil:'domcontentloaded'});
  await still.locator('.home-loader').waitFor({state:'hidden',timeout:15000});
  assert.deepEqual(requests,[],'Reduced motion must not download the video');
  console.log('PASS: reduced motion renders without downloading MP4');
  await reduced.close();
} finally { await browser.close(); }
