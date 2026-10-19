import assert from 'node:assert/strict';
import { contrastingNavInk } from '../lib/header-contrast.ts';
assert.equal(contrastingNavInk([[255,255,255,1]]),'#104e87');
assert.equal(contrastingNavInk([[16,78,135,1]]),'#ffffff');
assert.equal(contrastingNavInk([[0,0,0,1]]),'#ffffff');
assert.equal(contrastingNavInk([[255,250,210,1]]),'#104e87');
console.log('PASS: contrasting navigation ink on white, brand blue, black and a bright background.');
