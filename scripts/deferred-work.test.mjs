import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const observers=[];
class Observer {
  constructor(callback,options){this.callback=callback;this.options=options;observers.push(this);}
  observe(element){this.element=element;}
  disconnect(){this.disconnected=true;}
  emit(visible){this.callback([{isIntersecting:visible}]);}
}
const loadedModule={exports:{}};
vm.runInNewContext(ts.transpileModule(readFileSync(new URL('../lib/when-near.ts',import.meta.url),'utf8'),{
  compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022},
}).outputText,{module:loadedModule,exports:loadedModule.exports,IntersectionObserver:Observer});
const {whenNear}=loadedModule.exports;
const element={};let downloads=0;
const stop=whenNear(element,()=>downloads++,1400);
assert.equal(downloads,0,'Offscreen animations must not compete with first paint');
assert.equal(observers[0].element,element);
assert.equal(observers[0].options.rootMargin,'1400px');
observers[0].emit(false);assert.equal(downloads,0);
observers[0].emit(true);assert.equal(downloads,1,'Start ahead of the approaching section');
observers[0].emit(true);assert.equal(downloads,1,'Repeated observations must not duplicate imports');
stop();
const cancel=whenNear(element,()=>downloads++);
cancel();observers[1].emit(true);
assert.equal(downloads,1,'Unmounting cancels a pending offscreen load');
console.log('PASS: deferred work stays idle offscreen, starts once when approaching, and cancels on unmount.');
