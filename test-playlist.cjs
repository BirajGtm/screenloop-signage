const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const session={},prefs={urls:['https://one.test/','https://two.test/','https://three.test/','https://four.test/'],names:[],seconds:60,reloadMinutes:0,accent:'#005bdb'};
let message,activate,alarm,updated;const shots=[];let allowAll=false;
const hook={addListener(){}};
const chrome={runtime:{getURL:p=>'chrome-extension://test/'+p,onMessage:{addListener:f=>message=f},onStartup:hook},storage:{local:{get:async()=>({settings:prefs}),set:async()=>{}},session:{get:async()=>structuredClone(session),set:async v=>Object.assign(session,structuredClone(v))}},action:{setBadgeText:async()=>{}},permissions:{contains:async({origins})=>allowAll||!origins.some(o=>/three|four/.test(o))},scripting:{executeScript:async v=>{shots.push(v);}},alarms:{clear:async()=>{},create:async()=>{},onAlarm:{addListener:f=>alarm=f}},tabs:{get:async id=>({id,windowId:7}),update:async()=>{},onRemoved:hook,onActivated:{addListener:f=>activate=f},onUpdated:{addListener:f=>updated=f}},windows:{create:async()=>({id:7,tabs:[1,2,3,4].map(id=>({id}))}),update:async()=>{}}};
vm.runInNewContext(fs.readFileSync(__dirname+'/chrome-extension/site-access.js','utf8')+'\n'+fs.readFileSync(__dirname+'/chrome-extension/background.js','utf8'),{chrome,console,URL,importScripts(){},renderSignageOverlay(){}});
const send=m=>new Promise(r=>message(m,{},r));
const current=()=>shots.at(-1);
(async()=>{
 assert.equal((await send({action:'start',seconds:60})).ok,true);
 for(const id of [2,3,4,1]){alarm({name:'signage-rotate'});await send({action:'status'});assert.equal(current().target.tabId,id);assert.equal(current().args[0].visible,true);}
 activate({tabId:4,windowId:7});await send({action:'status'});assert.equal(session.player.index,3);assert.equal(current().target.tabId,4);
 updated(4,{status:'complete'});await send({action:'status'});assert.equal(current().target.tabId,4);
 const result=await send({action:'overlayAccess'});assert.equal(JSON.stringify(result.state.missing.map(x=>x.page)),'[3,4]');
 allowAll=true;assert.equal((await send({action:'overlayAccess'})).state.granted,true);
 await send({action:'pause'});activate({tabId:3,windowId:7});await send({action:'status'});assert.equal(current().target.tabId,3);assert.equal(current().args[0].running,false);assert.equal(current().args[0].visible,true);
 console.log('PASS: four-page automatic rotation, wraparound, manual activation, reload, per-page access reporting, paused tab switching');
})().catch(e=>{console.error(e);process.exitCode=1});
