const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
class Element {
  constructor(tag){this.tag=tag;this.children=[];this.style={};this.listeners={};this.attributes={};}
  append(...nodes){this.children.push(...nodes);}
  attachShadow(){return this.root=new Element('shadow');}
  setAttribute(k,v){this.attributes[k]=v;}
  addEventListener(k,f){this.listeners[k]=f;}
  contains(node){return this===node||this.children.some(c=>c.contains(node));}
  animate(frames,options){this.animation={frames,options};return {};}
  remove(){this.removed=true;}
}
const events=new Map(),timers=new Map();let next=0;
const document={documentElement:new Element('html'),createElement:t=>new Element(t),addEventListener(k,f){events.set(k,f);},removeEventListener(k,f){if(events.get(k)===f)events.delete(k);}};
const context={document,Date,matchMedia:()=>({matches:false}),setTimeout:f=>{timers.set(++next,f);return next;},clearTimeout:id=>timers.delete(id)};
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
