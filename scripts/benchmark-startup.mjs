import {createRequire} from 'node:module';
import {writeFileSync,mkdirSync} from 'node:fs';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.BASE_URL||'http://127.0.0.1:3001';
const browser=await chromium.launch({headless:true});
const results=[];
try{
  for(const mobile of [false,true])for(let run=1;run<=Number(process.env.PERF_RUNS||3);run++){
    const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:900},isMobile:mobile,hasTouch:mobile});
    const page=await context.newPage(),cdp=await context.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:100,downloadThroughput:1024*1024,uploadThroughput:256*1024,connectionType:'cellular4g'});
    let requests=0,bytes=0;const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    cdp.on('Network.requestWillBeSent',()=>requests++);
    cdp.on('Network.loadingFinished',event=>{bytes+=event.encodedDataLength;});
    const start=performance.now();
    await page.goto(base,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>document.querySelector('.home-experience')?.dataset.homeReady==='true',null,{timeout:180000});
    const readyMs=Math.round(performance.now()-start);
    const state=await page.evaluate(()=>({video:document.querySelector('.home-video-stage')?.dataset.videoState,scene:document.querySelector('.trade-journey-v2')?.dataset.sceneReady,paint:performance.getEntriesByType('paint').map(({name,startTime})=>({name,ms:Math.round(startTime)}))}));
    const result={device:mobile?'mobile':'desktop',run,readyMs,requests,bytes,...state,errors};results.push(result);console.log(JSON.stringify(result));
    if(errors.length||state.video!=='ready'||state.scene!=='true')throw new Error('Benchmark must measure fully ready animations');
    await context.close();
  }
}finally{await browser.close();mkdirSync('tmp/performance',{recursive:true});writeFileSync(process.env.PERF_OUTPUT||'tmp/performance/current.json',JSON.stringify({base,network:{latencyMs:100,downloadBytesPerSecond:1048576,coldCache:true},results},null,2));}
