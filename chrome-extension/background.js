importScripts('overlay.js');
const URLS = [];
const DEMO_URLS=['operations','welcome','schedule'].map(page=>chrome.runtime.getURL('demo.html#'+page));
const ALARM = 'signage-rotate';
const REFRESH = 'signage-refresh';
function overlayOrigins(urls) {
  const patterns=new Set();
  for(const value of urls) {
    const u=new URL(value);if(!['http:','https:'].includes(u.protocol))continue;
    const hosts=[u.hostname];
    // Only add the standard aliases for these known redirecting sites.
    if(['google.com','www.google.com','youtube.com','www.youtube.com'].includes(u.hostname)) {
      const base=u.hostname.replace(/^www\./,'');hosts.push(base,'www.'+base);
    }
    for(const host of hosts) for(const scheme of (u.protocol==='http:'?['http:','https:']:[u.protocol])) patterns.add(scheme+'//'+host+'/*');
  }
  return [...patterns];
}
async function settings() { return {urls:URLS,names:[],seconds:60,reloadMinutes:0,accent:'#005bdb',showTimer:true,transitions:true,...(await chrome.storage.local.get('settings')).settings}; }
function validate(c) {
  if(!Array.isArray(c.urls) || c.urls.length>50) throw Error('Use up to 50 pages.');
  const urls=c.urls.map(value=>{ const u=new URL(value); if(!['http:','https:'].includes(u.protocol) || u.username || u.password) throw Error('Use HTTP or HTTPS URLs without embedded passwords.'); return u.href; });
  if(![30,60,120,300].includes(c.seconds) || ![0,1,5,10,15,30,60].includes(c.reloadMinutes)) throw Error('Choose a valid interval.');
  if(!/^#[0-9a-f]{6}$/i.test(c.accent)) throw Error('Choose a valid accent color.');
  return {urls,names:urls.map((u,i)=>String(c.names?.[i]||'').slice(0,100)),seconds:c.seconds,reloadMinutes:c.reloadMinutes,accent:c.accent,showTimer:c.showTimer!==false,transitions:c.transitions!==false};
}
let queue = Promise.resolve();
function serial(work) { const job = queue.then(work); queue = job.catch(() => {}); return job; }
async function state() { return (await chrome.storage.session.get('player')).player || {running:false,seconds:60,index:0,tabIds:[]}; }
async function save(s) {
  await chrome.storage.session.set({player:s});
  await chrome.action.setBadgeText({text:s.running?'ON':''});
}
async function overlay(s,id,enter=false) {
  const prefs=await settings();
  const info={running:s.running,visible:s.running||s.paused,remaining:s.remaining,seconds:s.seconds,deadline:s.deadline,enter:enter&&prefs.transitions,showTimer:prefs.showTimer,accent:prefs.accent};
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
  s.deadline=Date.now()+duration;
  await chrome.alarms.create(ALARM,{when:s.deadline});
  await save(s);
}
async function advance(s,direction=1) {
  const old=s.tabIds[s.index];
  s.index=(s.index+direction+s.tabIds.length)%s.tabIds.length;
  s.remaining=s.seconds*1000;
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
  s.windowId=w.id; s.tabIds=w.tabs.map(t=>t.id); s.index=0; s.urls=urls; s.demo=demo;
  return s;
}
async function command(message) {
  let s=await state();
  switch(message.action) {
    case 'status': return s;
    case 'setInterval': {
      const seconds=Number(message.seconds);if(![30,60,120,300].includes(seconds)) throw Error('Invalid interval.');
      await chrome.storage.local.set({settings:{...await settings(),seconds}});
      s.seconds=seconds;s.remaining=seconds*1000;if(s.running) await schedule(s);else await save(s);
      if(s.tabIds.length) await overlay(s,s.tabIds[s.index]);return s;
    }
    case 'settings': return await settings();
    case 'overlayAccess': {
      const origins=overlayOrigins((await settings()).urls);
      const errors=(await chrome.storage.session.get('overlayErrors')).overlayErrors||{};
      return {origins,granted:origins.length?await chrome.permissions.contains({origins}):true,error:errors[s.tabIds[s.index]]||''};
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
      s=await prepare(s,message.action==='demo'); s.seconds=message.action==='demo'?30:([30,60,120,300].includes(Number(message.seconds))?Number(message.seconds):(await settings()).seconds);
      if(!s.demo) await chrome.storage.local.set({settings:{...await settings(),seconds:s.seconds}});
      s.running=true; s.paused=false; await chrome.tabs.update(s.tabIds[s.index],{active:true});
      await chrome.windows.update(s.windowId,{focused:true}); await save(s);
      await schedule(s); await overlay(s,s.tabIds[s.index],true);
      await chrome.alarms.clear(REFRESH);
      if((await settings()).reloadMinutes) await chrome.alarms.create(REFRESH,{periodInMinutes:(await settings()).reloadMinutes});
      break;
    case 'pause':
      if(!await valid(s)) {await stop(s);break;}
      if(s.running) s.remaining=Math.max(0,s.deadline-Date.now());
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
      if(sender.tab?.id!==s.tabIds[s.index] || !['previous','next','pause','resume','fullscreen'].includes(m.control)) throw Error('Inactive player control.');
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
chrome.tabs.onUpdated.addListener((id,change)=>{
  if(change.status==='complete') serial(async()=>{const s=await state();if((s.running||s.paused) && s.tabIds[s.index]===id) await overlay(s,id);}).catch(console.error);
});
chrome.runtime.onStartup.addListener(()=>{serial(async()=>{await chrome.alarms.clear(ALARM);await chrome.alarms.clear(REFRESH);await chrome.storage.session.clear();await chrome.action.setBadgeText({text:''});}).catch(console.error);});
