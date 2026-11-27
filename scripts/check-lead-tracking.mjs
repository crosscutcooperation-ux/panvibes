// Browser-only verification: intercept submissions and third-party requests.
// No enquiry is saved, emailed, or sent to analytics services.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.SITE_URL || 'http://localhost:3100';
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  await page.route('**/*', route => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort());
  await page.addInitScript(() => {
    window.grecaptcha = { ready: callback => callback(), execute: async () => 'browser-test-token' };
  });
  let requests = 0, status = 400, body = { error: 'Test validation rejection' }, release;
  await page.route('**/api/enquiries', async route => {
    requests++;
    if (release) await new Promise(resolve => { release.resolve = resolve; });
    await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
  });
  await page.goto(base + '/products/moringa');
  await page.getByRole('button', { name: 'Reject optional', exact: true }).click().catch(() => {});
  await page.evaluate(() => {
    window.dataLayer = [];
    window.gtag = (...args) => window.dataLayer.push(args);
  });
  const events = () => page.evaluate(() => window.dataLayer.filter(item => item.event === 'generate_lead'));
  const directEvents = () => page.evaluate(() => window.dataLayer.filter(item => Array.isArray(item) && item[0] === 'event' && item[1] === 'generate_lead'));
  await page.getByRole('button', { name: 'Request a Bulk Quote' }).click();
  const submit = page.getByRole('button', { name: 'Submit enquiry' });
  await submit.click();
  assert.equal(requests, 0, 'Browser validation must stop empty submissions');
  await page.getByLabel('Your name').fill('Browser Verification');
  await page.getByLabel('Email address').fill('verification@example.invalid');
  await page.getByLabel('Your country').fill('India');
  await page.getByLabel('Quantity & unit').fill('25 kg');
  await submit.click();
  await page.getByRole('alert').filter({ hasText: 'Test validation rejection' }).waitFor();
  assert.deepEqual(await events(), [], 'Server rejection must not track');
  status = 201; body = { emailDelivery: 'pending' };
  await submit.click();
  await page.getByRole('alert').filter({ hasText: 'reference could not be confirmed' }).waitFor();
  assert.deepEqual(await events(), [], 'Missing reference must not track');
  const reference = 'PV-BROWSER-TRACKING-CHECK';
  body = { reference, emailDelivery: 'pending' }; release = {};
  const previousRequests = requests;
  await submit.click();
  await page.waitForFunction(() => document.querySelector('.enquiry-form')?.getAttribute('aria-busy') === 'true');
  const deadline = Date.now() + 10000;
  while ((requests === previousRequests || !release.resolve) && Date.now() < deadline) await new Promise(resolve => setTimeout(resolve, 20));
  assert.ok(release.resolve, 'Submission must reach the intercepted endpoint');
  assert.deepEqual(await events(), [], 'Click and pending response must not track');
  release.resolve(); release = undefined;
  await page.getByRole('status').filter({ hasText: `Enquiry saved. Reference: ${reference}` }).waitFor();
  assert.deepEqual(await events(), [{ event: 'generate_lead', enquiry_ref: reference }]);
  assert.equal((await directEvents()).length, 1);
  assert.equal((await directEvents())[0][2].enquiry_ref, reference);
  await submit.click();
  await page.waitForFunction(() => document.querySelector('.enquiry-form')?.getAttribute('aria-busy') === 'false');
  assert.equal((await events()).length, 1, 'Retry of the same saved enquiry must not count twice');
  assert.equal((await directEvents()).length, 1, 'Direct GA tracking must not count the retry twice');
  console.log('PASS: validation, server error, missing reference and pending response produce no lead; success emits dataLayer and direct GA events with reference once. No real submissions or tracking requests sent.');
} finally { await browser.close(); }
