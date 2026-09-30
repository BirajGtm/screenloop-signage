const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const session={},prefs={urls:['https://one.test/','https://two.test/','https://three.test/','https://four.test/'],names:[],seconds:60,reloadMinutes:0,accent:'#005bdb'};
const timers=new Map();let timerId=0;
let clock=100000;let message,activate,alarm,updated;const shots=[];let allowAll=false;
const hook={addListener(){}};
const chrome={runtime:{getURL:p=>'chrome-extension://test/'+p,onMessage:{addListener:f=>message=f},onStartup:hook},storage:{local:{get:async()=>({settings:prefs}),set:async()=>{}},session:{get:async()=>structuredClone(session),set:async v=>Object.assign(session,structuredClone(v))}},action:{setBadgeText:async()=>{}},permissions:{contains:async({origins})=>allowAll||!origins.some(o=>/three|four/.test(o))},scripting:{executeScript:async v=>{shots.push(v);}},alarms:{clear:async()=>{},create:async()=>{},onAlarm:{addListener:f=>alarm=f}},tabs:{get:async id=>({id,windowId:7}),update:async()=>{},onRemoved:hook,onActivated:{addListener:f=>activate=f},onUpdated:{addListener:f=>updated=f}},windows:{create:async()=>({id:7,tabs:[1,2,3,4].map(id=>({id}))}),update:async()=>{}}};
vm.runInNewContext(fs.readFileSync(__dirname+'/chrome-extension/site-access.js','utf8')+'\n'+fs.readFileSync(__dirname+'/chrome-extension/background.js','utf8'),{setTimeout:(fn,ms)=>{timers.set(++timerId,{fn,ms});return timerId;},clearTimeout:id=>timers.delete(id),chrome,console,URL,importScripts(){},renderSignageOverlay(){},prepareSignageCursor(){},Date:{now:()=>clock}});
const send=m=>new Promise(r=>message(m,{},r));
const current=()=>shots.findLast(s=>s.args[0].visible);
(async()=>{
 assert.equal((await send({action:'start',seconds:60})).ok,true);
 const oldUpdate=chrome.tabs.update,oldExecute=chrome.scripting.executeScript;
 const switchOrder=[];chrome.windows.get=async()=>({state:'fullscreen'});
 chrome.scripting.executeScript=async v=>{switchOrder.push(v.func.name);shots.push(v);};
 chrome.tabs.update=async()=>{switchOrder.push('activate');clock+=45000;};
 await send({action:'next'});
 assert.deepEqual(switchOrder.slice(0,3),['prepareSignageCursor','activate','renderSignageOverlay']);
 assert.equal(session.player.deadline-clock,60000,'Activation delay must not consume page duration');
 assert.equal(current().args[0].deadline-clock,60000);
 chrome.tabs.update=oldUpdate;chrome.scripting.executeScript=oldExecute;await send({action:'previous'});

 for(const id of [2,3,4,1]){clock=session.player.deadline;alarm({name:'signage-rotate'});await send({action:'status'});assert.equal(current().target.tabId,id);assert.equal(current().args[0].visible,true);}
 activate({tabId:4,windowId:7});await send({action:'status'});assert.equal(session.player.index,3);assert.equal(current().target.tabId,4);
 updated(4,{status:'complete'});await send({action:'status'});assert.equal(current().target.tabId,4);
 const result=await send({action:'overlayAccess'});assert.equal(JSON.stringify(result.state.missing.map(x=>x.page)),'[3,4]');
 allowAll=true;assert.equal((await send({action:'overlayAccess'})).state.granted,true);
 const oldGet=chrome.tabs.get,oldContains=chrome.permissions.contains;
 chrome.tabs.get=async id=>({id,windowId:7,url:'https://destination.test/page'});
 chrome.permissions.contains=async({origins})=>!origins.includes('https://destination.test/*');
 const redirected=(await send({action:'overlayAccess',currentPage:true})).state;
 assert.equal(redirected.granted,false);assert.deepEqual([...redirected.origins],['https://destination.test/*']);
 assert.ok(!(await send({action:'overlayAccess'})).state.origins.includes('https://destination.test/*'));
 chrome.permissions.contains=async()=>true;
 assert.equal((await send({action:'overlayAccess',currentPage:true})).state.granted,true);
 chrome.tabs.get=async id=>({id,url:'chrome://settings/'});
 assert.equal((await send({action:'overlayAccess',currentPage:true})).state.origins.length,0);
 chrome.tabs.get=oldGet;chrome.permissions.contains=oldContains;

 await send({action:'pause'});activate({tabId:3,windowId:7});await send({action:'status'});assert.equal(current().target.tabId,3);assert.equal(current().args[0].running,false);assert.equal(current().args[0].visible,true);
 prefs.durations=[30,60,120,300];
 activate({tabId:4,windowId:7});await send({action:'status'});assert.equal(session.player.seconds,300);assert.equal(session.player.remaining,300000);
 await send({action:'resume'});await send({action:'next'});assert.equal(session.player.seconds,30);
 for(const seconds of [60,120,300,30]){clock=session.player.deadline;alarm({name:'signage-rotate'});await send({action:'status'});assert.equal(session.player.seconds,seconds);assert.equal(current().args[0].seconds,seconds);}
 let removedDraft=false;chrome.storage.local.remove=async key=>{removedDraft=key==='setupDraft';};chrome.storage.local.set=async v=>Object.assign(prefs,v.settings);
 for(const seconds of [5,7,29,31,95,600]){assert.equal((await send({action:'setInterval',seconds})).ok,true);assert.equal(session.player.seconds,seconds);}
 for(const seconds of [0,4,601,5.5])assert.equal((await send({action:'setInterval',seconds})).ok,false);
 await send({action:'setInterval',seconds:120});assert.equal(prefs.durations[0],120);assert.equal(prefs.durations[1],60);
 const invalid=await send({action:'saveSettings',settings:{...prefs,durations:[0,60,120,300]}});assert.equal(invalid.ok,false);
 const reset=await send({action:'resetSettings'});assert.equal(reset.ok,true);assert.equal(JSON.stringify(prefs.durations),'[30,30,30,30]');assert.equal(prefs.urls.length,4);assert.equal(session.player.running,false);assert.equal(removedDraft,true);assert.equal(prefs.reloadMinutes,0);assert.equal(prefs.accent,'#005bdb');
 console.log('PASS: four-page automatic rotation, wraparound, manual activation, reload, per-page access reporting, paused tab switching');
 // Short durations rotate on the timer, with stale alarms ignored.
 prefs.durations=[5,10,30,30];await send({action:'start'});
 assert.equal([...timers.values()].at(-1).ms,5000);
 const shortJob=[...timers.values()].at(-1);clock+=5000;shortJob.fn();await send({action:'status'});
 assert.equal(session.player.index,1);assert.equal(session.player.seconds,10);
 alarm({name:'signage-rotate'});await send({action:'status'});assert.equal(session.player.index,1);
 const stale=[...timers.values()].at(-1);await send({action:'pause'});assert.equal(timers.size,0);
 clock+=10000;stale.fn();await send({action:'status'});assert.equal(session.player.index,1);
 await send({action:'resume'});assert.equal([...timers.values()].at(-1).ms,10000);
 await send({action:'saveSettings',settings:prefs});assert.equal(timers.size,0);
 console.log('PASS: 5-second rotation, stale alarm suppression, pause/resume and stop cancellation');
 prefs.urls=['https://one.test/'];prefs.durations=[30];prefs.reloadMinutes=1;
 chrome.windows.create=async()=>({id:7,tabs:[{id:10}]});const scheduled=[];chrome.alarms.create=async name=>scheduled.push(name);
 await send({action:'start'});assert.equal(current().args[0].showTimer,true);assert.equal(current().args[0].singlePage,true);assert.equal(scheduled.includes('signage-rotate'),false);assert.equal(scheduled.includes('signage-refresh'),true);
 await send({action:'pause'});await send({action:'resume'});assert.equal(scheduled.includes('signage-rotate'),false);
})().catch(e=>{console.error(e);process.exitCode=1});
