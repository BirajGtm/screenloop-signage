const el=id=>document.getElementById(id);let prefs,origins=[];
async function call(action,extra={}){const r=await chrome.runtime.sendMessage({action,...extra});if(!r.ok)throw Error(r.error);return r.state;}
const report=e=>el('status').textContent=e.message;
el('manage').onclick=()=>chrome.tabs.create({url:chrome.runtime.getURL('setup.html')});
el('demo').onclick=()=>call('demo').catch(report);
el('form').onsubmit=async e=>{e.preventDefault();el('save').disabled=true;try{const current=await call('settings');await call('saveSettings',{settings:{...current,seconds:Number(el('seconds').value),reloadMinutes:Number(el('reload').value),accent:el('accent').value,showTimer:el('timer').checked,transitions:el('fade').checked}});el('status').textContent='Saved. Restart playback from the extension dropdown.';}catch(e){report(e);}finally{el('save').disabled=false;}};
el('access').onclick=async()=>{try{const granted=await chrome.permissions.request({origins});if(granted){await call('visuals');el('status').textContent='On-screen controls and visuals enabled for your playlist sites.';}else el('status').textContent='Permission declined. Tab rotation still works.';}catch(e){report(e);}};
(async()=>{prefs=await call('settings');el('seconds').value=prefs.seconds;el('reload').value=prefs.reloadMinutes;el('accent').value=prefs.accent;el('timer').checked=prefs.showTimer;el('fade').checked=prefs.transitions;origins=(await call('overlayAccess')).origins;el('access').disabled=!origins.length;el('save').disabled=false;})().catch(report);
