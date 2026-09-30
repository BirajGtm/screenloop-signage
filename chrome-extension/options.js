function initializeOptions(){
const el=id=>document.getElementById(id);let prefs,origins=[],accessChanged=false;
const required=['manage','demo','reset','form','save','access','reload','accent','timer','fade','theme','status'];
if(required.some(id=>!el(id))){
 const message='This settings page is out of date or incomplete. Reload ScreenLoop at chrome://extensions, then close this tab and reopen All settings.';
 const notice=el('status')||document.createElement('p');notice.textContent=message;notice.setAttribute('role','alert');
 if(!el('status'))document.body.append(notice);
 if(el('save'))el('save').disabled=true;
 return;
}
async function call(action,extra={}){const r=await chrome.runtime.sendMessage({action,...extra});if(!r.ok)throw Error(r.error);return r.state;}
const report=e=>el('status').textContent=e.message;
el('manage').onclick=()=>chrome.tabs.create({url:chrome.runtime.getURL('setup.html')});
el('demo').onclick=()=>call('demo').catch(report);
el('reset').onclick=async()=>{if(!confirm('Reset page durations to 30 seconds and display/reload preferences to defaults? Saved pages and site permissions are kept. Unsaved setup drafts are cleared. Playback stops.'))return;try{await call('resetSettings');location.reload();}catch(e){report(e);}};
el('form').onsubmit=async e=>{
 e.preventDefault();el('save').disabled=true;el('access').disabled=true;
 const changeAccess=accessChanged,enabling=el('access').checked;
 try{
  // Chrome requires the permission request directly within the Save gesture.
  if(changeAccess&&enabling&&origins.length&&!await chrome.permissions.request({origins})){
   el('status').textContent='Site access was declined. Settings were not saved. Uncheck the option to save without enabling access, or retry Save settings.';return;
  }
  const current=await call('settings');
  await call('saveSettings',{settings:{...current,theme:el('theme').value,reloadMinutes:Number(el('reload').value),accent:el('accent').value,showTimer:el('timer').checked,transitions:el('fade').checked}});
  // Stop playback and remove injected controls before revoking access.
  if(changeAccess&&!enabling&&origins.length&&!await chrome.permissions.remove({origins}))throw Error('Other settings saved, but site access could not be removed. Retry Save settings.');
  await refreshAccess();accessChanged=false;
  el('status').textContent='Saved. Restart playback from the extension dropdown.';
 }catch(e){report(e);}finally{el('save').disabled=false;el('access').disabled=!origins.length;}
};
async function refreshAccess(){const access=await call('overlayAccess');origins=access.origins;el('access').checked=Boolean(origins.length&&access.granted);el('access').indeterminate=Boolean(access.missing?.length&&access.missing.length<prefs.urls.length);el('access').disabled=!origins.length;}
el('access').onchange=()=>{accessChanged=true;el('status').textContent='Unsaved changes. Click Save settings to apply.';};
(async()=>{prefs=await call('settings');el('theme').value=prefs.theme||'system';el('reload').value=prefs.reloadMinutes;el('accent').value=prefs.accent;el('timer').checked=prefs.showTimer;el('fade').checked=prefs.transitions;await refreshAccess();el('save').disabled=false;})().catch(report);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initializeOptions,{once:true});
else initializeOptions();
