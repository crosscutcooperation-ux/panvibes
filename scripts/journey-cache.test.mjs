import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import ts from 'typescript';

// Run the actual scene/cache with deterministic image completion and RAFs.
// No browser or media re-encoding is needed to catch idle reload loops.
const require = createRequire(import.meta.url);
const pending = [], frames = new Map(), requests = [];
let nextFrame = 0;
class TestImage {
  dataset = {}; naturalWidth = 2880; naturalHeight = 809;
  decode(){return Promise.resolve();}
  set src(value) {
    this.url = value;
    if (value) { requests.push(value); pending.push(() => this.onload?.()); }
  }
  get src() { return this.url; }
}
const context = new Proxy({}, { get: (_, key) => key === 'createLinearGradient' ? () => ({ addColorStop() {} }) : () => {} });
const canvas = { dataset:{},getContext: () => context, remove() {} };
const modules = new Map();
function load(relative) {
  const filename = fileURLToPath(new URL(relative, import.meta.url));
  if (modules.has(filename)) return modules.get(filename);
  const loadedModule = { exports: {} };
  const source = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  vm.runInNewContext(source, {
    module: loadedModule, exports: loadedModule.exports,
    require: name => name.endsWith('.json') ? require(fileURLToPath(new URL(`../lib/${name}`, import.meta.url))) : load(`../lib/${name}.ts`),
    Image: TestImage, document: { createElement: () => canvas },
    window: { matchMedia: () => ({ matches: true }), devicePixelRatio: 2 },
    requestAnimationFrame: callback => { const id = ++nextFrame; frames.set(id, callback); return id; },
    cancelAnimationFrame: id => frames.delete(id),
  }, { filename });
  modules.set(filename, loadedModule.exports); return loadedModule.exports;
}
const { createJourneyScene } = load('../lib/journey-scene.ts');
const scene = createJourneyScene({ appendChild() {} });
async function settle() {
  for (let turn = 0; turn < 100; turn++) {
    await new Promise(resolve=>setImmediate(resolve));
    if (!pending.length && !frames.size) return;
    pending.splice(0).forEach(callback => callback());
    const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(callback => callback());
  }
  assert.fail('The stationary scene keeps requesting/redrawing frames');
}
scene.draw(20, 390, 844); await settle();
assert.ok(requests.length <= 12, `Stationary side view fetched ${requests.length} assets`);
const idleCount = requests.length;
for (let index = 0; index < 30; index++) { scene.draw(20, 390, 844); await settle(); }
assert.equal(requests.length, idleCount, 'Holding the scroll position must not reload cached frames');
for (const time of [24, 24.5, 25, 25.5, 26, 25, 24, 20]) { scene.draw(time, 390, 844); await settle(); }
const reverseCount = requests.length;
for (let index = 0; index < 30; index++) { scene.draw(20, 390, 844); await settle(); }
assert.equal(requests.length, reverseCount, 'The cache must also settle after reverse scrolling');
scene.dispose(); assert.equal(frames.size, 0);
console.log(`PASS: mobile truck cache settles at ${idleCount} initial assets, stays idle, and supports forward/reverse scrolling.`);
