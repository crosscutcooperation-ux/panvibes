import assert from 'node:assert/strict';
import test from 'node:test';
import { initialHeaderScroll, nextHeaderScroll } from '../lib/header-scroll.ts';

test('scrolling down hides navigation; scrolling up reveals it far from the top',()=>{
  let state=initialHeaderScroll(4000);
  state=nextHeaderScroll(state,4200);
  assert.equal(state.hidden,true);
  state=nextHeaderScroll(state,4190);
  assert.equal(state.hidden,false);
  state=nextHeaderScroll(state,4250);
  assert.equal(state.hidden,true);
});

test('slow one-pixel upward movements accumulate and reveal navigation',()=>{
  let state=nextHeaderScroll(initialHeaderScroll(8000),8100);
  for(let y=8099;y>=8090;y--)state=nextHeaderScroll(state,y);
  assert.equal(state.hidden,false);
});

test('tiny alternating movements do not flicker the hidden header',()=>{
  let state=nextHeaderScroll(initialHeaderScroll(1000),1100);
  for(const y of [1099,1100,1099,1100])state=nextHeaderScroll(state,y);
  assert.equal(state.hidden,true);
});

test('page top and an open menu or keyboard focus keep navigation visible',()=>{
  const hidden=nextHeaderScroll(initialHeaderScroll(1000),1200);
  assert.equal(nextHeaderScroll(hidden,0).hidden,false);
  assert.equal(nextHeaderScroll(hidden,1400,true).hidden,false);
  assert.equal(initialHeaderScroll(6000).hidden,false);
});
