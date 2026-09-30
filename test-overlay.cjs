const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
class Element {
  constructor(tag){this.tag=tag;this.children=[];this.style={};this.listeners={};this.attributes={};}
  append(...nodes){this.children.push(...nodes);}
  prepend(...nodes){this.children.unshift(...nodes);}
  attachShadow(){return this.root=new Element('shadow');}
  setAttribute(k,v){this.attributes[k]=v;}
  addEventListener(k,f){this.listeners[k]=f;}
  contains(node){return this===node||this.children.some(c=>c.contains(node));}
  animate(frames,options){this.animation={frames,options};return {cancel(){}};}
  remove(){this.removed=true;}
}
const events=new Map(),timers=new Map();let next=0;
const document={documentElement:new Element('html'),createElement:t=>new Element(t),addEventListener(k,f){events.set(k,f);},removeEventListener(k,f){if(events.get(k)===f)events.delete(k);}};
const context={chrome:{runtime:{sendMessage:async()=>({ok:true})}},document,Date,matchMedia:()=>({matches:false}),setTimeout:f=>{timers.set(++next,f);return next;},clearTimeout:id=>timers.delete(id)};
vm.createContext(context);vm.runInContext(fs.readFileSync(__dirname+'/chrome-extension/overlay.js','utf8'),context);
const idle=()=>{const jobs=[...timers.values()];timers.clear();jobs.forEach(f=>f());};
for(const running of [true,false]){
  context.renderSignageOverlay({visible:true,running,remaining:30000,seconds:30,deadline:Date.now()+30000});
  const root=context.__networkSignageOverlayV12.host.root;
  const controls=root.children.find(e=>e.tag==='nav'),handle=root.children.find(e=>e.className==='handle');
  assert.equal(controls.hidden,true);assert.equal(handle.hidden,true);
  events.get('pointermove')();assert.equal(controls.hidden,false);assert.equal(handle.hidden,false);
  events.get('pointermove')();assert.equal(timers.size,1);
  idle();assert.equal(controls.hidden,true);assert.equal(handle.hidden,true);
  events.get('pointerdown')();assert.equal(controls.hidden,false);idle();assert.equal(handle.hidden,true);
  events.get('keydown')({key:'Tab'});root.activeElement=controls.children[0];idle();assert.equal(controls.hidden,false);
  events.get('pointermove')();idle();assert.equal(controls.hidden,true);
  root.activeElement=null;events.get('keydown')({key:'Tab'});idle();assert.equal(controls.hidden,true);
  events.get('pointermove')();context.renderSignageOverlay({visible:false});
  assert.equal(events.size,0);assert.equal(timers.size,0);
}
console.log('PASS: playing/paused idle hiding, pointer and keyboard reveal, timer reset, focus protection, listener cleanup');
for(const running of [true,false]){
 context.renderSignageOverlay({visible:true,running,singlePage:true,showTimer:true,accent:'#ffcc00',seconds:30});
 const root=context.__networkSignageOverlayV12.host.root,rail=root.children.find(e=>e.className==='rail');
 assert.equal(rail.hidden,false);assert.equal(rail.children[0].style.height,'25%');
 assert.equal(Boolean(rail.children[0].animation),running);
 const controls=root.children.find(e=>e.tag==='nav');
 for(const b of controls.children.filter(e=>['Previous','Next'].includes(e.textContent)))assert.equal(b.disabled,true);
 assert.ok(root.children[0].textContent.includes('background:#ffcc00;border-color:#ffcc00;color:#000'));
}
context.matchMedia=()=>({matches:true});context.renderSignageOverlay({visible:true,running:true,singlePage:true,seconds:30});
assert.equal(context.__networkSignageOverlayV12.host.root.children.find(e=>e.className==='rail').children[0].animation,undefined);

context.renderSignageOverlay({visible:true,running:true,singlePage:true,seconds:30,controlsUntil:Date.now()+5000});
assert.equal(context.__networkSignageOverlayV12.host.root.children.find(e=>e.tag==='nav').hidden,false);
idle();assert.equal(context.__networkSignageOverlayV12.host.root.children.find(e=>e.tag==='nav').hidden,true);
console.log('PASS: startup controls appear and hide after the introductory timer');

context.renderSignageOverlay({visible:true,running:true,fullscreen:true,singlePage:true,seconds:30});
const cursorStyle=document.documentElement.children.at(-1);
assert.match(cursorStyle.textContent,/cursor:none/);idle();assert.match(cursorStyle.textContent,/cursor:none/);
events.get('pointermove')();assert.equal(cursorStyle.textContent,'');idle();assert.match(cursorStyle.textContent,/cursor:none/);
context.renderSignageOverlay({visible:true,running:true,fullscreen:false,singlePage:true,seconds:30});
assert.equal(cursorStyle.removed,true);const normalStyle=document.documentElement.children.at(-1);idle();assert.equal(normalStyle.textContent,'');
context.renderSignageOverlay({visible:false});assert.equal(normalStyle.removed,true);
console.log('PASS: fullscreen cursor idle hiding, movement restore, normal-window restore, and cleanup');

context.renderSignageOverlay({visible:true,running:true,fullscreen:true,singlePage:true,seconds:30,controlsUntil:Date.now()-1});
let switchedCursor=document.documentElement.children.at(-1);assert.match(switchedCursor.textContent,/cursor:none/);
events.get('pointermove')({type:'pointermove',movementX:0,movementY:0});assert.match(switchedCursor.textContent,/cursor:none/);
events.get('keydown')({key:'a'});assert.equal(switchedCursor.textContent,'');idle();assert.match(switchedCursor.textContent,/cursor:none/);
console.log('PASS: expired visibility stays hidden on switches; real keyboard activity restores cursor');

// A background document does not start its countdown animation until visible.
let clock=1000;context.Date={now:()=>clock};document.hidden=true;
context.renderSignageOverlay({visible:true,running:true,seconds:30,deadline:31000});
const lazyFill=context.__networkSignageOverlayV12.host.root.children.find(e=>e.className==='rail').children[0];
assert.equal(lazyFill.animation,undefined);assert.equal(lazyFill.style.transform,'scaleY(1)');
clock=6000;document.hidden=false;events.get('visibilitychange')();
assert.equal(lazyFill.animation.options.duration,25000);
assert.equal(lazyFill.animation.frames[0].transform,'scaleY(0.8333333333333334)');
context.renderSignageOverlay({visible:false});assert.equal(events.has('visibilitychange'),false);
console.log('PASS: first activation resynchronizes countdown and removes visibility listeners');

context.matchMedia=()=>({matches:false});
context.renderSignageOverlay({visible:true,running:true,singlePage:true,seconds:30,enter:true});
let transitionRoot=context.__networkSignageOverlayV12.host.root;
const veil=transitionRoot.children.find(e=>e.className==='veil');assert.ok(veil);assert.equal(veil.animation.options.duration,450);
assert.equal(transitionRoot.children.filter(e=>e.className==='rail').length,1);
context.matchMedia=()=>({matches:true});
context.renderSignageOverlay({visible:true,running:true,singlePage:true,seconds:30,enter:true});
assert.equal(context.__networkSignageOverlayV12.host.root.children.some(e=>e.className==='veil'),false);
context.matchMedia=()=>({matches:false});
context.renderSignageOverlay({visible:true,running:true,singlePage:true,seconds:30,enter:false});
assert.equal(context.__networkSignageOverlayV12.host.root.children.some(e=>e.className==='veil'),false);
console.log('PASS: soft transition, reduced-motion preference, and disabled-transition behavior');
