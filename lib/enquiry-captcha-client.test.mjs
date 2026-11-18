import { afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { getEnquiryCaptchaToken } from './enquiry-captcha-client.ts';

const originalWindow = globalThis.window;
const originalDocument = globalThis.document;

afterEach(() => {
  globalThis.window = originalWindow;
  globalThis.document = originalDocument;
});

test('waits for a slow reCAPTCHA script before rejecting a real submission', async () => {
  globalThis.window = {};
  globalThis.document = { getElementById: () => null, createElement: () => ({}), head: { appendChild: () => assert.fail('fallback was unnecessary') } };
  setTimeout(() => {
    globalThis.window.grecaptcha = { ready: callback => callback(), execute: async () => 'valid-test-token' };
  }, 20);

  assert.equal(await getEnquiryCaptchaToken('public-test-key', { primaryWaitMs: 200, fallbackWaitMs: 50 }), 'valid-test-token');
});

test('tries recaptcha.net when Google script stays unavailable', async () => {
  globalThis.window = {};
  let fallbackSrc = '';
  globalThis.document = {
    getElementById: () => null,
    createElement: () => ({}),
    head: { appendChild: script => {
      fallbackSrc = script.src;
      globalThis.window.grecaptcha = { ready: callback => callback(), execute: async () => 'fallback-token' };
    } },
  };

  assert.equal(await getEnquiryCaptchaToken('public-test-key', { primaryWaitMs: 20, fallbackWaitMs: 100 }), 'fallback-token');
  assert.match(fallbackSrc, /^https:\/\/www\.recaptcha\.net\/recaptcha\/api\.js\?render=/);
});

test('explains when both script hosts are unavailable', async () => {
  globalThis.window = {};
  globalThis.document = { getElementById: () => null, createElement: () => ({}), head: { appendChild: () => {} } };

  await assert.rejects(getEnquiryCaptchaToken('public-test-key', { primaryWaitMs: 20, fallbackWaitMs: 20 }), /Spam check could not load/);
});
