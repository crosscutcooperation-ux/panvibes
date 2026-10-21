import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';
const testModule = { exports: {} };
vm.runInNewContext(ts.transpileModule(readFileSync('lib/admin-cookie.ts', 'utf8'), {
  compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022},
}).outputText, { module:testModule, exports:testModule.exports, require:createRequire(import.meta.url) });
const { adminCookieSecure:secure } = testModule.exports;
assert.equal(secure('13.239.180.235','http','13.239.180.235'),false);
assert.equal(secure('13.239.180.235','https','13.239.180.235'),true);
assert.equal(secure('13.239.180.235','https:','13.239.180.235'),true);
assert.equal(secure('13.239.180.235','http'),true);
assert.equal(secure('13.239.180.236','http','13.239.180.235'),true);
assert.equal(secure('panvibes.com','http','panvibes.com'),true);
assert.equal(secure('panvibes.com','https','13.239.180.235'),true);
assert.equal(secure('127.0.0.1','http'),false);
console.log('PASS: explicit numeric HTTP host, HTTPS, domain and default session-cookie policies');
