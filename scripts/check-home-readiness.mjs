import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdirSync} from 'node:fs';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.BASE_URL||'http://127.0.0.1:3001';
const journeyPattern='**/media/journey/journey-desktop-*.bin';
mkdirSync('tmp/readiness',{recursive:true});
const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:1440,height:900}});
  const page=await context.newPage(),errors=[],networkFrames=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('request',request=>{if(/\/images\/.*journey(?:-mobile)?\//.test(request.url()))networkFrames.push(request.url());});
  let held,releaseHeld;
  const heldReady=new Promise(resolve=>{releaseHeld=resolve;});
  await page.route(journeyPattern,route=>{held=route;releaseHeld();});
  await page.goto(base,{waitUntil:'domcontentloaded'});
  // Later assets must stay idle until the film is being scrolled or approached.
  await page.locator('.home-loader').waitFor({state:'hidden',timeout:45000});
  assert.equal(await page.locator('video').evaluate(video=>video.currentSrc.startsWith('blob:')),false);
  assert.equal(held,undefined,'The animation pack must not compete with the native first frame');
  assert.equal(await page.locator('.home-experience').getAttribute('data-journey-ready'),'false');
  await page.evaluate(()=>{const hero=document.querySelector('.home-video-hero');scrollTo({top:Number(hero.dataset.scrollStart)+(Number(hero.dataset.scrollEnd)-Number(hero.dataset.scrollStart))*.12,behavior:'instant'});});
  await heldReady;
  assert.equal(await page.locator('.home-loader').count(),0);
  console.log('PASS: native first frame unlocks the page before the journey download starts');
  // An instant jump may use a local preparation indicator, never another
  // modal, inert page, or global scroll lock.
  await page.evaluate(()=>{const root=document.querySelector('.trade-journey-v2');window.scrollTo({top:Number(root.dataset.scrollStart)+(Number(root.dataset.scrollEnd)-Number(root.dataset.scrollStart))*.4,behavior:'instant'});});
  await page.locator('.journey-preparing').waitFor({state:'visible'});
  assert.equal(await page.locator('.home-loader').count(),0);
  assert.notEqual(await page.evaluate(()=>document.documentElement.style.overflow),'hidden');
  assert.equal(await page.locator('.home-experience').evaluate(el=>el.inert),false);
  await held.continue();await page.unroute(journeyPattern);
  await page.waitForFunction(()=>document.querySelector('.trade-journey-v2')?.dataset.sceneReady==='true',null,{timeout:45000});
  const ready=await page.evaluate(()=>({
    blob:document.querySelector('video').currentSrc.startsWith('blob:'),
    decoded:document.querySelector('.motion-vehicles canvas')?.dataset.ready,
    scene:document.querySelector('.trade-journey-v2')?.dataset.sceneReady,
    images:[...document.querySelectorAll('.motion-stage img')].every(image=>image.complete&&image.naturalWidth>0),
    globe:!!document.querySelector('.motion-globe .globe-ready'),
  }));
  assert.deepEqual(ready,{blob:false,decoded:'true',scene:'true',images:true,globe:false});
  console.log('PASS: later HD assets prepare without a second full-screen loader or eager globe');
  // Traverse the full vehicle scene, then reverse across the same boundaries.
  for(const t of [0,5,8.5,11.7,13.2,15,16,20,25,29.5,33.1,35.5,38,33,25,15,8,0]){
    await page.evaluate(t=>{const root=document.querySelector('.trade-journey-v2');window.scrollTo({top:Number(root.dataset.scrollStart)+(Number(root.dataset.scrollEnd)-Number(root.dataset.scrollStart))*t/40,behavior:'instant'});},t);
    try{await page.waitForFunction(t=>Math.abs(Number(document.querySelector('.trade-journey-v2').dataset.phase)-t)<.05,t,{timeout:5000});}
    catch(error){console.error('Scene position mismatch',t,await page.evaluate(()=>({scroll:scrollY,start:document.querySelector('.trade-journey-v2').dataset.scrollStart,end:document.querySelector('.trade-journey-v2').dataset.scrollEnd,phase:document.querySelector('.trade-journey-v2').dataset.phase,loader:!!document.querySelector('.home-loader'),height:innerHeight})));throw error;}
    if(t<34){
      await page.waitForFunction(()=>{const canvas=document.querySelector('.motion-vehicles canvas'),ctx=canvas.getContext('2d');const data=ctx.getImageData(0,0,canvas.width,canvas.height).data;for(let i=3;i<data.length;i+=128)if(data[i]>0)return true;return false;},null,{timeout:5000});
    }
  }
  assert.deepEqual(errors,[]);
  assert.deepEqual(networkFrames,[],'Prepared frames must decode from the pack, not download separately');
  console.log('PASS: all truck/crane/ship phases and reverse scrolling render without blank canvases or browser errors');
  await context.close();

  const broken=await browser.newContext(),failed=await broken.newPage();
  let reject=true;
  await failed.route('**/*.mp4',route=>reject?route.abort('failed'):route.continue());
  await failed.goto(base,{waitUntil:'domcontentloaded'});
  await failed.getByRole('button',{name:'Retry video'}).waitFor();
  await failed.locator('.home-loader').waitFor({state:'hidden'});
  reject=false;await failed.getByRole('button',{name:'Retry video'}).click();
  await failed.waitForFunction(()=>document.querySelector('.home-video-stage')?.dataset.videoState==='ready',null,{timeout:60000});
  await failed.locator('.home-loader').waitFor({state:'hidden',timeout:60000});
  assert.equal(await failed.locator('video').evaluate(video=>video.currentSrc.startsWith('blob:')),false);
  console.log('PASS: failed preparation offers retry, and retry prepares the complete animation');
  await broken.close();
}finally{await browser.close();}
