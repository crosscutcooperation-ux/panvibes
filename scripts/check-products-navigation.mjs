import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import fs from 'node:fs';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assets=JSON.parse(fs.readFileSync('lib/product-assets.json'));
const base=process.env.BASE_URL||'http://127.0.0.1:3001';
fs.mkdirSync('tmp/product-checks',{recursive:true});
const browser=await chromium.launch({headless:true});
try{
  for(const mobile of [false,true]){
    const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:1000},isMobile:mobile,hasTouch:mobile});
    const page=await context.newPage(),errors=[],downloads=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('request',request=>{if(request.url().includes('/images/products/'))downloads.push(request.url());});
    await page.goto(base+'/products',{waitUntil:'networkidle'});
    await page.waitForFunction(()=>document.querySelector('.product-stage')?.dataset.assetsReady==='true'&&document.querySelector('.product-table')?.complete);
    assert.equal(await page.title(),'PanVibes Exim | Products & Ingredients');
    const variant=mobile?'mobile':'desktop';
    for(const entry of Object.values(assets))assert.equal(downloads.filter(url=>url.endsWith(entry[variant].src)).length,1,'Download each selected image once');
    assert.equal(downloads.length,3,'Do not download oversized originals or both viewport variants');
    for(const progress of [0,.3,.65,1,.4,0]){
      await page.evaluate(progress=>{const section=document.querySelector('.product-hero'),stage=document.querySelector('.product-stage');const start=section.getBoundingClientRect().top+scrollY,end=section.offsetHeight-stage.offsetHeight;scrollTo({top:start+end*progress,behavior:'instant'});},progress);
      if(progress===1){await page.waitForFunction(()=>document.querySelector('.product-stage').dataset.productWord==='PRODUCTS');assert.equal(await page.locator('.product-stage').getAttribute('data-remaining-ingredients'),'0');}
      await page.waitForFunction(()=>{const c=document.querySelector('.product-ingredients'),data=c.getContext('2d').getImageData(0,0,c.width,c.height).data;for(let i=3;i<data.length;i+=128)if(data[i]>0)return true;return false;});
    }
    await page.screenshot({path:`tmp/product-checks/${variant}.png`});
    const makhana=page.locator('.range-row[data-sector="food"]').filter({hasText:'Makhana & Healthy Food Snacks'});
    await makhana.locator('.range-toggle').focus();await page.keyboard.press('Enter');
    await makhana.locator('.range-types').waitFor({state:'visible'});
    assert.ok(await makhana.locator('.range-type-name').count()>=10);
    await makhana.locator('.range-type-name').first().click();
    await page.locator('.product-enquiry-dialog[open]').waitFor();
    assert.equal(await page.locator('.navigation-loading').count(),0,'Enquiries do not navigate');
    await page.keyboard.press('Escape');
    assert.deepEqual(errors,[]);
    console.log(`PASS: ${variant} uses only three sized images; food formation, reverse scrolling, product types and enquiry work`);
    await context.close();
  }
  const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'}),page=await context.newPage();
  await page.goto(base+'/quality',{waitUntil:'networkidle'});
  let held,release;
  const started=new Promise(resolve=>{release=resolve;});
  await page.route('**/*',route=>{const url=new URL(route.request().url());if(!held&&url.pathname==='/products'&&route.request().headers().rsc==='1'){held=route;release();}else return route.continue();});
  await page.locator('.desktop-nav a[href="/products"]').click();
  await Promise.race([started,new Promise((_,reject)=>setTimeout(()=>reject(new Error('Expected pending product navigation')),15000))]);
  await page.getByRole('status').filter({hasText:'Loading PanVibes'}).waitFor();
  await page.screenshot({path:'tmp/product-checks/navigation-spinner.png'});
  await held.continue();await page.unroute('**/*');
  await page.waitForURL(base+'/products');await page.locator('.navigation-loading').waitFor({state:'detached'});
  await page.locator('.product-stage[data-assets-ready="true"]').waitFor();
  await page.locator('.desktop-nav a[href="/blog"]').click();await page.waitForURL(base+'/blog');
  await page.goBack();await page.waitForURL(base+'/products');
  await page.locator('.navigation-loading').waitFor({state:'detached'});
  for(const path of ['/','/about','/contact','/products/ginger','/admin']){
    const response=await context.request.get(base+path);assert.equal(response.status(),200);const html=await response.text();assert.match(html,/<title>PanVibes Exim \| /);
  }
  for(const icon of ['/favicon.ico','/icon.png','/apple-icon.png']){const response=await context.request.get(base+icon);assert.equal(response.status(),200);assert.ok((await response.body()).length>100);}
  console.log('PASS: real pending navigation shows spinner, completion/back navigation clears it, titles lead with PanVibes, all branded icons are served');
  await context.close();
  const phone=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'}),mobilePage=await phone.newPage();
  await mobilePage.goto(base+'/quality',{waitUntil:'networkidle'});
  let mobileRoute,ready;
  const mobileStarted=new Promise(resolve=>{ready=resolve;});
  await mobilePage.route('**/*',route=>{if(!mobileRoute&&new URL(route.request().url()).pathname==='/blog'&&route.request().headers().rsc==='1'){mobileRoute=route;ready();}else return route.continue();});
  await mobilePage.getByRole('button',{name:'Menu',exact:false}).click();
  await mobilePage.locator('.site-mobile-menu a[href="/blog"]').click();
  await Promise.race([mobileStarted,new Promise((_,reject)=>setTimeout(()=>reject(new Error('Expected pending mobile navigation')),15000))]);
  await mobilePage.locator('.navigation-loading').waitFor();
  assert.equal(await mobilePage.locator('.site-menu-toggle').getAttribute('aria-expanded'),'false');
  await mobileRoute.continue();await mobilePage.unroute('**/*');await mobilePage.waitForURL(base+'/blog');
  await mobilePage.locator('.navigation-loading').waitFor({state:'detached'});
  console.log('PASS: mobile menu closes during navigation while its spinner remains visible and clears on arrival');
  await phone.close();
}finally{await browser.close();}
