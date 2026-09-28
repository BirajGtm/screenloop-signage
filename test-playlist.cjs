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
 prefs.durations=[30,60,120,300];
 activate({tabId:4,windowId:7});await send({action:'status'});assert.equal(session.player.seconds,300);assert.equal(session.player.remaining,300000);
 await send({action:'resume'});await send({action:'next'});assert.equal(session.player.seconds,30);
 for(const seconds of [60,120,300,30]){alarm({name:'signage-rotate'});await send({action:'status'});assert.equal(session.player.seconds,seconds);assert.equal(current().args[0].seconds,seconds);}
 let removedDraft=false;chrome.storage.local.remove=async key=>{removedDraft=key==='setupDraft';};chrome.storage.local.set=async v=>Object.assign(prefs,v.settings);
 for(const seconds of [31,95,600]){assert.equal((await send({action:'setInterval',seconds})).ok,true);assert.equal(session.player.seconds,seconds);}
 for(const seconds of [0,29,601,31.5])assert.equal((await send({action:'setInterval',seconds})).ok,false);
 await send({action:'setInterval',seconds:120});assert.equal(prefs.durations[0],120);assert.equal(prefs.durations[1],60);
 const invalid=await send({action:'saveSettings',settings:{...prefs,durations:[0,60,120,300]}});assert.equal(invalid.ok,false);
 const reset=await send({action:'resetSettings'});assert.equal(reset.ok,true);assert.equal(JSON.stringify(prefs.durations),'[30,30,30,30]');assert.equal(prefs.urls.length,4);assert.equal(session.player.running,false);assert.equal(removedDraft,true);assert.equal(prefs.reloadMinutes,0);assert.equal(prefs.accent,'#005bdb');
 console.log('PASS: four-page automatic rotation, wraparound, manual activation, reload, per-page access reporting, paused tab switching');
 prefs.urls=['https://one.test/'];prefs.durations=[30];prefs.reloadMinutes=1;
 chrome.windows.create=async()=>({id:7,tabs:[{id:10}]});const scheduled=[];chrome.alarms.create=async name=>scheduled.push(name);
 await send({action:'start'});assert.equal(current().args[0].showTimer,true);assert.equal(current().args[0].singlePage,true);assert.equal(scheduled.includes('signage-rotate'),false);assert.equal(scheduled.includes('signage-refresh'),true);
 await send({action:'pause'});await send({action:'resume'});assert.equal(scheduled.includes('signage-rotate'),false);
})().catch(e=>{console.error(e);process.exitCode=1});
