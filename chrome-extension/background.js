importScripts('overlay.js','site-access.js');
const URLS = [];
const DEMO_URLS=['operations','welcome','schedule'].map(page=>chrome.runtime.getURL('demo.html#'+page));
const ALARM = 'signage-rotate';
const REFRESH = 'signage-refresh';
async function settings() { return {urls:URLS,names:[],seconds:30,durations:[],reloadMinutes:0,accent:'#005bdb',showTimer:true,transitions:true,...(await chrome.storage.local.get('settings')).settings}; }
function validDuration(n){return Number.isInteger(n)&&n>=30&&n<=600;}
function validate(c) {
  if(!Array.isArray(c.urls) || c.urls.length>50) throw Error('Use up to 50 pages.');
  const urls=c.urls.map(value=>{ const u=new URL(value); if(!['http:','https:'].includes(u.protocol) || u.username || u.password) throw Error('Use HTTP or HTTPS URLs without embedded passwords.'); return u.href; });
  if(!validDuration(c.seconds) || ![0,1,5,10,15,30,60].includes(c.reloadMinutes)) throw Error('Choose a valid interval.');
  if(!/^#[0-9a-f]{6}$/i.test(c.accent)) throw Error('Choose a valid accent color.');
  return {urls,names:urls.map((u,i)=>String(c.names?.[i]||'').slice(0,100)),durations:urls.map((u,i)=>{const n=c.durations?.[i]??c.seconds;if(!validDuration(n))throw Error('Use a whole number of seconds from 30 to 600.');return n;}),seconds:30,reloadMinutes:c.reloadMinutes,accent:c.accent,showTimer:c.showTimer!==false,transitions:c.transitions!==false};
}
let queue = Promise.resolve();
function serial(work) { const job = queue.then(work); queue = job.catch(() => {}); return job; }
async function state() { return (await chrome.storage.session.get('player')).player || {running:false,seconds:30,index:0,tabIds:[]}; }
async function save(s) {
  await chrome.storage.session.set({player:s});
  await chrome.action.setBadgeText({text:s.running?'ON':''});
}
async function overlay(s,id,enter=false) {
  const prefs=await settings();
  const info={running:s.running,visible:s.running||s.paused,remaining:s.remaining,seconds:s.seconds,deadline:s.deadline,enter:enter&&prefs.transitions,showTimer:prefs.showTimer,singlePage:s.tabIds.length===1,accent:prefs.accent};
  try {
    if(s.demo) await chrome.tabs.sendMessage(id,{type:'signageOverlay',info});
    else await chrome.scripting.executeScript({target:{tabId:id},func:renderSignageOverlay,args:[info]});
    const errors=(await chrome.storage.session.get('overlayErrors')).overlayErrors||{};delete errors[id];await chrome.storage.session.set({overlayErrors:errors});
  }
  catch(e) {
    if(!info.visible)return;
    const errors=(await chrome.storage.session.get('overlayErrors')).overlayErrors||{};
    errors[id]='Controls could not be added. Enable site access below. If this page redirected to another website, save its final URL in Manage pages. Details: '+e.message;
    await chrome.storage.session.set({overlayErrors:errors});
  }
}
async function schedule(s,duration=s.seconds*1000) {
  if(s.tabIds.length<2){await chrome.alarms.clear(ALARM);s.deadline=0;await save(s);return;}
  s.deadline=Date.now()+duration;
  await chrome.alarms.create(ALARM,{when:s.deadline});
  await save(s);
}
async function pageSeconds(s){const c=await settings();return s.demo?30:(c.durations?.[s.index]??c.seconds??30);}
async function advance(s,direction=1) {
  if(s.tabIds.length<2)return;
  const old=s.tabIds[s.index];
  s.index=(s.index+direction+s.tabIds.length)%s.tabIds.length;
  s.seconds=await pageSeconds(s);s.remaining=s.seconds*1000;
  await chrome.tabs.update(s.tabIds[s.index],{active:true});
  if(s.running) await schedule(s); else await save(s);
  if(old!==s.tabIds[s.index]) await overlay({...s,running:false,paused:false},old);
  await overlay(s,s.tabIds[s.index],true);
}
async function stop(s) { await chrome.alarms.clear(ALARM); await chrome.alarms.clear(REFRESH); s.running=false; s.paused=false; await save(s); await Promise.all(s.tabIds.map(id=>overlay(s,id))); }
async function valid(s) {
  const c=await settings();
  const urls=s.demo?DEMO_URLS:c.urls;
  if(!s.tabIds.length || s.tabIds.length!==urls.length || JSON.stringify(s.urls)!==JSON.stringify(urls)) return false;
  try { for(const id of s.tabIds) { const t=await chrome.tabs.get(id); if(t.windowId!==s.windowId) return false; } return true; } catch { return false; }
}
async function prepare(s,demo=false) {
  if(Boolean(s.demo)===demo && await valid(s)) return s;
  const c=await settings();
  const urls=demo?DEMO_URLS:c.urls;
  if(!urls.length) throw Error('Add pages in Manage pages, or choose Play demo signage.');
  const w=await chrome.windows.create({url:urls,focused:true,type:'normal'});
  const launched=(await chrome.storage.session.get('launchedTabIds')).launchedTabIds||[];
  await chrome.storage.session.set({launchedTabIds:[...new Set([...launched,...s.tabIds,...w.tabs.map(t=>t.id)])]});
  s.windowId=w.id; s.tabIds=w.tabs.map(t=>t.id); s.index=0; s.urls=urls; s.demo=demo;
  return s;
}
async function command(message) {
  let s=await state();
  switch(message.action) {
    case 'status': return s;
    case 'stop': {
      await stop(s);
      const launched=(await chrome.storage.session.get('launchedTabIds')).launchedTabIds||[];
      const ids=[...new Set([...launched,...s.tabIds])],failed=[];
      for(const id of ids) {
        try { await chrome.tabs.get(id); } catch { continue; }
        try { await chrome.tabs.remove(id); } catch { failed.push(id); }
      }
      s={running:false,paused:false,seconds:(await settings()).seconds,index:0,tabIds:[]};
      await save(s);
      await chrome.storage.session.set({launchedTabIds:failed,overlayErrors:{}});
      if(failed.length) throw Error('Playback stopped, but some tabs could not close. Try Stop again.');
      break;
    }
    case 'setInterval': {
      const seconds=Number(message.seconds);if(!validDuration(seconds)) throw Error('Invalid interval.');
      if(!s.running&&!s.paused)throw Error('Start playback to change the current page duration.');
      if(!s.demo){const c=await settings();const durations=c.urls.map((u,i)=>c.durations?.[i]??c.seconds??30);durations[s.index]=seconds;await chrome.storage.local.set({settings:{...c,durations}});}
      s.seconds=seconds;s.remaining=seconds*1000;if(s.running) await schedule(s);else await save(s);
      if(s.tabIds.length) await overlay(s,s.tabIds[s.index]);return s;
    }
    case 'resetSettings': {
      await stop(s);const c=await settings();
      const defaults={...c,seconds:30,durations:c.urls.map(()=>30),reloadMinutes:0,accent:'#005bdb',showTimer:true,transitions:true};
      await chrome.storage.local.set({settings:defaults});await chrome.storage.local.remove('setupDraft');return defaults;
    }
    case 'settings': return await settings();
    case 'overlayAccess': {
      const prefs=await settings();
      const origins=overlayOrigins(prefs.urls);
      const errors=(await chrome.storage.session.get('overlayErrors')).overlayErrors||{};
      const missing=[];
      for(let i=0;i<prefs.urls.length;i++) {
        if(!await chrome.permissions.contains({origins:overlayOrigins([prefs.urls[i]])})) missing.push({page:i+1,name:prefs.names?.[i]||new URL(prefs.urls[i]).hostname});
      }
      return {origins,granted:!missing.length,missing,error:errors[s.tabIds[s.index]]||''};
    }
    case 'visuals':
      if(s.running||s.paused) {
        await overlay(s,s.tabIds[s.index]);
        const errors=(await chrome.storage.session.get('overlayErrors')).overlayErrors||{};
        if(errors[s.tabIds[s.index]]) throw Error(errors[s.tabIds[s.index]]);
      }
      return s;
    case 'saveSettings': {
      const c=validate(message.settings);
      await stop(s); await chrome.storage.local.set({settings:c}); return c;
    }
    case 'open':
      await stop(s); s=await prepare(s); await chrome.windows.update(s.windowId,{focused:true}); await save(s); break;
    case 'demo':
    case 'start':
      await stop(s);
      s=await prepare(s,message.action==='demo'); s.seconds=await pageSeconds(s);
      s.running=true; s.paused=false; await chrome.tabs.update(s.tabIds[s.index],{active:true});
      await chrome.windows.update(s.windowId,{focused:true}); await save(s);
      await schedule(s); await overlay(s,s.tabIds[s.index],true);
      await chrome.alarms.clear(REFRESH);
      if((await settings()).reloadMinutes) await chrome.alarms.create(REFRESH,{periodInMinutes:(await settings()).reloadMinutes});
      break;
    case 'pause':
      if(!await valid(s)) {await stop(s);break;}
      if(s.running) s.remaining=s.tabIds.length>1?Math.max(0,s.deadline-Date.now()):s.seconds*1000;
      await chrome.alarms.clear(ALARM);await chrome.alarms.clear(REFRESH);
      s.running=false;s.paused=true;await save(s);await overlay(s,s.tabIds[s.index]);break;
    case 'resume':
      if(!await valid(s)) throw Error('Open the dashboards first.');
      s.running=true;s.paused=false;await schedule(s,s.remaining||s.seconds*1000);
      if((await settings()).reloadMinutes) await chrome.alarms.create(REFRESH,{periodInMinutes:(await settings()).reloadMinutes});
      await overlay(s,s.tabIds[s.index]);break;
    case 'previous':
    case 'next':
      if(!await valid(s)) { await stop(s); throw Error('Open the dashboards first.'); }
      await advance(s,message.action==='previous'?-1:1); break;
    case 'fullscreen':
      if(!await valid(s)) throw Error('Open the dashboards first.');
      const w=await chrome.windows.get(s.windowId);
      await chrome.windows.update(s.windowId,{state:w.state==='fullscreen'?'normal':'fullscreen',focused:true}); break;
    default: throw Error('Unknown action.');
  }
  return s;
}
chrome.runtime.onMessage.addListener((m,sender,reply)=>{
  if(m.action==='overlayControl') {
    serial(async()=>{
      const s=await state();
      if(sender.tab?.id!==s.tabIds[s.index] || !['previous','next','pause','resume','fullscreen','stop'].includes(m.control)) throw Error('Inactive player control.');
      return command({action:m.control});
    }).then(s=>reply({ok:true,state:s}),e=>reply({ok:false,error:e.message}));return true;
  }
  if(m.action==='demoReady') {
    serial(async()=>{const s=await state();if(s.demo && (s.running||s.paused) && sender.tab?.id===s.tabIds[s.index]) await overlay(s,sender.tab.id,true);}).then(()=>reply({ok:true}),()=>reply({ok:false})); return true;
  }
  serial(()=>command(m)).then(s=>reply({ok:true,state:s}),e=>reply({ok:false,error:e.message})); return true;
});
chrome.alarms.onAlarm.addListener(a=>{
  if(![ALARM,REFRESH].includes(a.name)) return;
  serial(async()=>{
    const s=await state(); if(!s.running || !await valid(s)) {await stop(s);return;}
    if(a.name===REFRESH) { for(const id of s.tabIds) await chrome.tabs.reload(id); return; }
    await advance(s);
  }).catch(async e=>{console.error(e);await stop(await state());});
});
chrome.tabs.onRemoved.addListener(id=>{serial(async()=>{const s=await state();if(s.tabIds.includes(id)) await stop(s);}).catch(console.error);});
// Chrome fires this for both user clicks and our own tab switches. Only
// user-selected changes need a new countdown; our switches already saved it.
chrome.tabs.onActivated.addListener(({tabId,windowId})=>{
  serial(async()=>{
    const s=await state();const index=s.tabIds.indexOf(tabId);
    if(windowId!==s.windowId||index<0||(!s.running&&!s.paused)||index===s.index)return;
    const old=s.tabIds[s.index];s.index=index;s.seconds=await pageSeconds(s);s.remaining=s.seconds*1000;
    if(s.running)await schedule(s);else await save(s);
    await overlay({...s,running:false,paused:false},old);
    await overlay(s,tabId,true);
  }).catch(console.error);
});
chrome.tabs.onUpdated.addListener((id,change)=>{
  if(change.status==='complete') serial(async()=>{const s=await state();if((s.running||s.paused) && s.tabIds[s.index]===id) await overlay(s,id);}).catch(console.error);
});
chrome.runtime.onStartup.addListener(()=>{serial(async()=>{await chrome.alarms.clear(ALARM);await chrome.alarms.clear(REFRESH);await chrome.storage.session.clear();await chrome.action.setBadgeText({text:''});}).catch(console.error);});
