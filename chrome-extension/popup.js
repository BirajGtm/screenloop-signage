const el=id=>document.getElementById(id);let player={},prefs={};
let access={origins:[],granted:true,error:''};
const accessButton=document.createElement('button');accessButton.textContent='Enable timer & on-screen controls';accessButton.hidden=true;
const accessNote=document.createElement('p');accessNote.setAttribute('role','status');
const stopButton=document.createElement('button');stopButton.textContent='Stop & close signage';stopButton.title='Close display tabs launched by ScreenLoop in this browser session';
el('remote').append(stopButton);stopButton.onclick=()=>act('stop');
stopButton.disabled=true;
stopButton.id='stop';
el('remote').append(accessNote,accessButton);
accessButton.onclick=async()=>{try{
 const granted=await chrome.permissions.request({origins:access.origins});
 if(!granted){el('status').textContent='Site access was declined. Rotation continues without overlays.';return;}
 await call('visuals');el('status').textContent='Site access enabled. Overlays appear during playback.';await refresh();
}catch(e){el('status').textContent=e.message;}};
async function call(action,extra={}){const r=await chrome.runtime.sendMessage({action,...extra});if(!r.ok)throw Error(r.error);return r.state;}
function setup(){chrome.tabs.create({url:chrome.runtime.getURL('setup.html')});}
async function refresh(){
 [player,prefs]=await Promise.all([call('status'),call('settings')]);
 access=await call('overlayAccess');
 stopButton.disabled=!(player.running||player.paused);
 accessButton.hidden=player.demo||!access.origins.length||(access.granted&&!access.error);
 accessNote.textContent=player.demo?'':access.error||(!access.granted?'Site access needed: '+access.missing.map(p=>'page '+p.page+' ('+p.name+')').join(', ')+'. Enable access below to show the timer and controls.':'');
 const show=Boolean(prefs.urls.length||player.running||player.paused);el('welcome').hidden=show;el('remote').hidden=!show;el('own').hidden=prefs.urls.length>0;
 el('play').textContent=player.running?'Pause':player.paused?'Resume':'Play';
 const name=player.demo?['Operations','Welcome','Schedule'][player.index]:prefs.names?.[player.index]||prefs.urls[player.index]||'';
 el('playing').textContent=(player.demo?'Demo · ':'')+(player.running?'Playing':player.paused?'Paused':'Ready')+(name?' · '+name:'')+(player.tabIds.length?' · '+(player.index+1)+' / '+player.tabIds.length:'');
 for(const id of ['previous','next','fullscreen'])el(id).disabled=!player.tabIds.length;
 for(const id of ['previous','next'])el(id).disabled=player.tabIds.length<2;
}
async function act(action,extra){try{await call(action,extra);el('status').textContent='';await refresh();}catch(e){el('status').textContent=e.message;}}
el('setup').onclick=setup;el('own').onclick=setup;el('manage').onclick=setup;el('settings').onclick=()=>chrome.runtime.openOptionsPage();el('demo').onclick=()=>act('demo');
el('play').onclick=()=>act(player.running?'pause':player.paused?'resume':'start');
for(const id of ['previous','next','fullscreen'])el(id).onclick=()=>act(id);

refresh().catch(e=>el('status').textContent=e.message);setInterval(()=>refresh().catch(()=>{}),1500);
