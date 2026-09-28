const el=id=>document.getElementById(id);let draft,adding=false;let writes=Promise.resolve();
async function call(action,extra={}){const r=await chrome.runtime.sendMessage({action,...extra});if(!r.ok)throw Error(r.error);return r.state;}
function persist(){const snapshot=JSON.parse(JSON.stringify(draft));writes=writes.catch(()=>{}).then(()=>chrome.storage.local.set({setupDraft:snapshot}));return writes;}
function report(e){el('status').textContent=e.message;}
function render(){
 el('pages').replaceChildren();draft.pages.forEach((p,i)=>{const card=document.createElement('div');card.className='card';const title=document.createElement('strong');title.textContent=p.name||p.url;const text=document.createElement('p');text.textContent=p.url;card.append(title,text);const duration=document.createElement('label');duration.hidden=draft.pages.length<2;duration.textContent='Time on this page (seconds, 30–600)';const select=document.createElement('input');select.type='number';select.min='30';select.max='600';select.step='1';select.required=true;select.value=p.seconds??30;select.onchange=()=>{p.seconds=Number(select.value);persist().catch(report);};duration.append(select);card.append(duration);const row=document.createElement('div');row.className='row';
 for(const [label,delta] of [['Up',-1],['Down',1],['Remove',0]]){const b=document.createElement('button');b.textContent=label;b.disabled=(delta<0&&i===0)||(delta>0&&i===draft.pages.length-1);b.onclick=()=>{if(delta)[draft.pages[i],draft.pages[i+delta]]=[draft.pages[i+delta],draft.pages[i]];else draft.pages.splice(i,1);persist().catch(report);render();};row.append(b);}card.append(row);el('pages').append(card);});
 el('add').hidden=!adding||Boolean(draft.pending);el('toggle-add').hidden=adding||Boolean(draft.pending);el('toggle-add').textContent='Add a page';el('toggle-add').setAttribute('aria-expanded',String(adding&&!draft.pending));el('confirm').hidden=!draft.pending;el('checking').textContent=draft.pending?.url||'';el('url').value=draft.url||'';el('name').value=draft.name||'';el('seconds').value=draft.newSeconds??30;el('save').disabled=el('start').disabled=!draft.pages.length||adding||Boolean(draft.pending);
 el('duration-field').hidden=draft.pages.length===0;el('seconds').disabled=draft.pages.length===0;
 showAccessButtons();
}
function showAccessButtons(){
 // Recheck each rendered card, including pages restored from an older setup.
 for(const [i,p] of draft.pages.entries()) {
   const card=el('pages').children[i],button=document.createElement('button');button.textContent='Enable timer & controls';card.append(button);
   const origins=overlayOrigins([p.url]);
   chrome.permissions.contains({origins}).then(granted=>{button.textContent=granted?'Site access enabled':'Enable timer & controls';button.disabled=granted;}).catch(report);
   button.onclick=async()=>{try{
     const granted=await chrome.permissions.request({origins});
     button.textContent=granted?'Site access enabled':'Retry site access';button.disabled=granted;
     el('status').textContent=granted?'Site access enabled. Restart playback to show its controls.':'Access declined. This page can rotate, but cannot show the timer or controls.';
     if(granted)await call('visuals');
   }catch(e){report(e);}};
 }
}
el('back-settings').onclick=()=>chrome.runtime.openOptionsPage();
el('toggle-add').onclick=()=>{adding=true;render();el('url').focus();};
el('cancel-add').onclick=()=>{adding=false;render();el('toggle-add').focus();};
el('url').oninput=()=>{draft.url=el('url').value;persist().catch(report);};el('name').oninput=()=>{draft.name=el('name').value;persist().catch(report);};el('seconds').onchange=()=>{draft.newSeconds=Number(el('seconds').value);persist().catch(report);};
el('add').onsubmit=async e=>{e.preventDefault();try{const u=new URL(el('url').value.trim());if(!['http:','https:'].includes(u.protocol)||u.username||u.password)throw Error('Use an HTTP or HTTPS URL without a password.');const seconds=draft.pages.length?Number(el('seconds').value):30;if(!Number.isInteger(seconds)||seconds<30||seconds>600)throw Error('Use a whole number of seconds from 30 to 600.');draft.pending={url:u.href,name:el('name').value.trim(),seconds};await persist();render();await chrome.tabs.create({url:u.href});}catch(e){report(e);}};
el('reopen').onclick=()=>chrome.tabs.create({url:draft.pending.url}).catch(report);
el('ready').onclick=async()=>{
 if(!draft.pending)return;
 const page={...draft.pending};el('ready').disabled=true;el('cancel').disabled=true;
 try{
   // Request immediately within the click gesture, before storage or messages.
   const granted=await chrome.permissions.request({origins:overlayOrigins([page.url])});
   draft.pages.push(page);draft.pending=null;draft.url='';draft.name='';draft.newSeconds=30;adding=false;await persist();render();
   el('status').textContent=granted?'Page added with timer and controls enabled. Add another page, or save your setup.':'Page added without overlays because site access was declined. Use Enable timer & controls on its card to retry.';
 }catch(e){report(e);}finally{el('ready').disabled=false;el('cancel').disabled=false;}
};el('cancel').onclick=()=>{adding=false;draft.pending=null;persist().catch(report);render();};
async function finish(start){if(adding||draft.pending||!draft.pages.length){el('status').textContent='Confirm Page is ready or cancel adding the page before saving.';return;}try{await writes;const latest=await call('settings');await call('saveSettings',{settings:{...latest,urls:draft.pages.map(p=>p.url),names:draft.pages.map(p=>p.name),seconds:30,durations:draft.pages.map(p=>p.seconds??draft.seconds??30)}});await chrome.storage.local.remove('setupDraft');el('status').textContent='Setup saved. Your extension dropdown is now your playback remote.';if(start)await call('start',{seconds:draft.seconds});}catch(e){report(e);}}
el('save').onclick=()=>finish(false);el('start').onclick=()=>finish(true);
(async()=>{const prefs=await call('settings');draft=(await chrome.storage.local.get('setupDraft')).setupDraft||{pages:prefs.urls.map((url,i)=>({url,name:prefs.names?.[i]||'',seconds:prefs.durations?.[i]??prefs.seconds??30})),seconds:prefs.seconds,pending:null,url:'',name:''};draft.pages.forEach(p=>p.seconds??=draft.seconds??30);if(draft.pending)draft.pending.seconds??=draft.seconds??30;render();})().catch(report);
