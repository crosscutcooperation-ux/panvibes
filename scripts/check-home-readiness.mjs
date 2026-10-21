import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdirSync} from 'node:fs';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.BASE_URL||'http://127.0.0.1:3001';
mkdirSync('tmp/readiness',{recursive:true});
const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:1440,height:900}});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  let held,releaseHeld;
  const heldReady=new Promise(resolve=>{releaseHeld=resolve;});
  await page.route('**/images/branded/ship.webp',route=>{held=route;releaseHeld();});
  await page.goto(base,{waitUntil:'domcontentloaded'});
  await page.locator('.home-loader').waitFor({state:'visible'});
  await page.screenshot({path:'tmp/readiness/loader.png'});
  // Even with the hero ready, one missing transport asset keeps the loader up.
  await page.waitForFunction(()=>document.querySelector('.home-video-stage')?.dataset.videoState==='ready',null,{timeout:45000});
  await heldReady;
  assert.equal(await page.locator('.home-loader').isVisible(),true);
  assert.equal(await page.evaluate(()=>document.documentElement.style.overflow),'hidden');
  await page.mouse.wheel(0,3000);
  assert.equal(await page.evaluate(()=>window.scrollY),0);
  assert.ok(held,'The complete journey, including its ship, must be prepared');
  await held.continue();await page.unroute('**/images/branded/ship.webp');
  await page.locator('.home-loader').waitFor({state:'hidden',timeout:45000});
  const ready=await page.evaluate(()=>({
    blob:document.querySelector('video').currentSrc.startsWith('blob:'),
    decoded:document.querySelector('.motion-vehicles canvas')?.dataset.ready,
    scene:document.querySelector('.trade-journey-v2')?.dataset.sceneReady,
    images:[...document.querySelectorAll('.motion-stage img')].every(image=>image.complete&&image.naturalWidth>0),
    globe:!!document.querySelector('.motion-globe .globe-ready'),
  }));
  assert.deepEqual(ready,{blob:true,decoded:'true',scene:'true',images:true,globe:true});
  console.log('PASS: loader holds scroll until the complete film, transport assets, decoded scene and globe are ready');
  // Traverse the full vehicle scene, then reverse across the same boundaries.
  for(const t of [0,5,8.5,11.7,13.2,15,16,20,25,29.5,33.1,35.5,38,33,25,15,8,0]){
    await page.evaluate(t=>{const root=document.querySelector('.trade-journey-v2');window.scrollTo({top:Number(root.dataset.scrollStart)+(Number(root.dataset.scrollEnd)-Number(root.dataset.scrollStart))*t/40,behavior:'instant'});},t);
    await page.waitForFunction(t=>Math.abs(Number(document.querySelector('.trade-journey-v2').dataset.phase)-t)<.05,t,{timeout:5000});
    if(t<34){
      await page.waitForFunction(()=>{const canvas=document.querySelector('.motion-vehicles canvas'),ctx=canvas.getContext('2d');const data=ctx.getImageData(0,0,canvas.width,canvas.height).data;for(let i=3;i<data.length;i+=128)if(data[i]>0)return true;return false;},null,{timeout:5000});
    }
    if([8.5,11.7,25,33.1,38].includes(t))await page.screenshot({path:`tmp/readiness/journey-${t}.png`});
  }
  assert.deepEqual(errors,[]);
  console.log('PASS: all truck/crane/ship phases and reverse scrolling render without blank canvases or browser errors');
  await context.close();

  const broken=await browser.newContext(),failed=await broken.newPage();
  let reject=true;
  await failed.route('**/*.mp4',route=>reject?route.abort('failed'):route.continue());
  await failed.goto(base,{waitUntil:'domcontentloaded'});
  await failed.getByRole('button',{name:'Retry loading'}).waitFor();
  assert.equal(await failed.locator('.home-loader').isVisible(),true);
  reject=false;await failed.getByRole('button',{name:'Retry loading'}).click();
  await failed.locator('.home-loader').waitFor({state:'hidden',timeout:60000});
  assert.equal(await failed.locator('video').getAttribute('data-download-complete'),'true');
  console.log('PASS: failed preparation offers retry, and retry prepares the complete animation');
  await broken.close();
}finally{await browser.close();}
