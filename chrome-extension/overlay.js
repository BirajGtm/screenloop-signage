// Prepare only the cursor in a background tab; never start its countdown there.
function prepareSignageCursor(until) {
  const key='__screenLoopPreparedCursor';
  globalThis[key]?.remove();
  const style=document.createElement('style');
  style.textContent=until>Date.now()?'':'html,body,body *{cursor:none!important}';
  document.documentElement.append(style);globalThis[key]=style;
}
// Runs in the extension's isolated world, only in managed playlist tabs.
function renderSignageOverlay(info) {
  const key='__networkSignageOverlayV12';
  const previous=globalThis[key];
  if(previous) { previous.cleanup(); }
  if(!info.visible) { globalThis.__screenLoopPreparedCursor?.remove();delete globalThis.__screenLoopPreparedCursor;delete globalThis[key]; return; }
  const host=document.createElement('div');
  host.style.cssText='all:initial!important;position:fixed!important;inset:0!important;pointer-events:none!important;z-index:2147483647!important;';
  const root=host.attachShadow({mode:'closed'});
  const style=document.createElement('style');
  style.textContent=`.rail{position:absolute;right:10px;top:10vh;height:80vh;width:6px;padding:0;box-sizing:border-box;border-radius:8px;backdrop-filter:blur(14px) saturate(150%);-webkit-backdrop-filter:blur(14px) saturate(150%);box-shadow:0 0 0 1px rgba(255,255,255,.5),0 0 0 2px rgba(0,0,0,.18),0 3px 14px rgba(0,0,0,.22);overflow:hidden}.fill{height:100%;width:100%;background:#005bdb;transform-origin:bottom;border-radius:8px}.veil{position:absolute;inset:0;background:rgba(15,23,42,.24);backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);pointer-events:none}@media(prefers-reduced-motion:reduce){.veil{display:none}}`;
  const accent=/^#[0-9a-f]{6}$/i.test(info.accent)?info.accent:'#005bdb';
  style.textContent+=`.fill{background:${accent};box-shadow:inset 0 0 0 1px rgba(255,255,255,.22)}`;
  style.textContent+=`.controls{position:absolute;bottom:44px;left:50%;transform:translateX(-50%);display:flex;gap:6px;padding:8px;border:1px solid #52637a;border-radius:14px;background:#07111ff2;box-shadow:0 8px 30px #0006;pointer-events:auto;font:14px system-ui;max-width:95vw;flex-wrap:wrap;justify-content:center}.controls[hidden]{display:none}button{font:600 14px system-ui;background:#14283e;color:#fff;border:1px solid #52637a;border-radius:8px;padding:10px;cursor:pointer}button:hover{border-color:${accent}}button:focus-visible{outline:3px solid ${accent};outline-offset:2px}.handle{position:absolute;bottom:8px;left:50%;transform:translateX(-50%);pointer-events:auto;padding:6px 14px}.status{color:#fff;align-self:center}`;
  const rail=document.createElement('div'),fill=document.createElement('div');rail.className='rail';fill.className='fill';rail.append(fill);root.append(style,rail);
  const rgb=accent.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
  const ink=(.2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2])>.179?'#000':'#fff';
  // A contrasting translucent track keeps even pure black/white accents legible.
  const track=ink==='#fff'?'rgba(245,248,255,.78)':'rgba(15,23,42,.72)';
  const solidTrack=ink==='#fff'?'#e8edf5':'#202b3c';
  style.textContent+=`.rail{background:linear-gradient(90deg,rgba(255,255,255,.25),rgba(255,255,255,0) 65%),${track}}@media(prefers-reduced-transparency:reduce){.rail{background:${solidTrack};backdrop-filter:none;-webkit-backdrop-filter:none}}`;

  style.textContent+=`.controls{border-color:${accent}}button{background:${accent};border-color:${accent};color:${ink}}button:disabled{opacity:.4;cursor:not-allowed}button:not(:disabled):hover{filter:brightness(1.12)}`;
  rail.hidden=info.showTimer===false;
  document.documentElement.append(host);
  let barAnimation;
  function syncBar(){
    barAnimation?.cancel();
    const remaining=info.running?Math.max(0,(info.deadline||0)-Date.now()):Math.max(0,info.remaining||0);
    const fraction=Math.min(1,remaining/(info.seconds*1000));
    fill.style.transform=`scaleY(${fraction})`;
    if(info.singlePage){
      fill.style.height='25%';fill.style.transform='translateY(150%)';
      if(info.running&&info.showTimer!==false&&!matchMedia('(prefers-reduced-motion: reduce)').matches)
        barAnimation=fill.animate([{transform:'translateY(0)'},{transform:'translateY(300%)'}],{duration:1800,iterations:Infinity,direction:'alternate',easing:'ease-in-out'});
    }else if(info.running&&remaining>0&&!document.hidden){
      barAnimation=fill.animate([{transform:`scaleY(${fraction})`},{transform:'scaleY(0)'}],{duration:remaining,fill:'forwards',easing:'linear'});
    }
  }
  syncBar();
  document.addEventListener('visibilitychange',syncBar);
  const controls=document.createElement('nav');controls.className='controls';controls.setAttribute('aria-label','Signage controls');
  const handle=document.createElement('button');handle.className='handle';handle.textContent='Controls';handle.setAttribute('aria-expanded','true');
  let hideTimer,keyboardMode=false,visibleUntil=0;
  const cursorStyle=document.createElement('style');
  let cursorTimer;
  function restoreCursor(){cursorStyle.textContent='';}
  function hideCursor(){cursorStyle.textContent='html,body,body *{cursor:none!important}';}
  function scheduleCursor(until){
    clearTimeout(cursorTimer);restoreCursor();
    if(info.fullscreen){
      const delay=until-Date.now();
      if(delay>0)cursorTimer=setTimeout(hideCursor,delay);else hideCursor();
    }
  }
  document.documentElement.append(cursorStyle);
  // Only real activity extends this deadline; rebuilding an overlay does not.
  scheduleCursor(info.controlsUntil||0);
  globalThis.__screenLoopPreparedCursor?.remove();delete globalThis.__screenLoopPreparedCursor;

  const introUntil=info.controlsUntil||0;
  function hide(){visibleUntil=0;controls.hidden=true;handle.hidden=true;handle.setAttribute('aria-expanded','false');}
  function show(notify=true){
    controls.hidden=false;handle.hidden=false;handle.setAttribute('aria-expanded','true');clearTimeout(hideTimer);
    visibleUntil=Math.max(Date.now()+3000,introUntil);
    if(notify)chrome.runtime.sendMessage({action:'controlsVisibility',until:visibleUntil}).catch(()=>{});
    hideTimer=setTimeout(()=>{if(!keyboardMode || (!controls.contains(root.activeElement)&&root.activeElement!==handle)) hide();},Math.max(3000,introUntil-Date.now()));
  }
  function pointerActivity(e){if(e?.type==='pointermove'&&e.movementX===0&&e.movementY===0)return;scheduleCursor(Math.max(Date.now()+3000,introUntil));keyboardMode=false;show();}
  function keyboardActivity(e){const until=Math.max(Date.now()+3000,introUntil);scheduleCursor(until);chrome.runtime.sendMessage({action:'controlsVisibility',until}).catch(()=>{});if(e.key==='Tab'){keyboardMode=true;show();}}
  document.addEventListener('pointermove',pointerActivity,true);
  document.addEventListener('pointerdown',pointerActivity,true);
  document.addEventListener('keydown',keyboardActivity,true);
  handle.addEventListener('click',show);
  controls.addEventListener('focusin',show);controls.addEventListener('focusout',show);
  handle.addEventListener('focusin',show);handle.addEventListener('focusout',show);
  for(const [label,action] of [['Previous','previous'],[info.running?'Pause':'Play',info.running?'pause':'resume'],['Next','next'],['Fullscreen','fullscreen'],['Stop & close signage','stop']]) {
    const b=document.createElement('button');b.textContent=label;b.type='button';
    b.disabled=Boolean(info.singlePage&&['previous','next'].includes(action));
    b.addEventListener('click',async()=>{b.disabled=true;try{const r=await chrome.runtime.sendMessage({action:'overlayControl',control:action,controlsUntil:visibleUntil});if(!r.ok)throw Error(r.error);}catch(e){handle.textContent='Open extension to reconnect';handle.title=e.message;}finally{b.disabled=Boolean(info.singlePage&&['previous','next'].includes(action));}});controls.append(b);
  }
  if(!info.running){const label=document.createElement('span');label.className='status';label.textContent='Paused';controls.append(label);}
  // Briefly introduce controls at startup; later switches stay unobtrusive.
  root.append(handle,controls);hide();
  if(introUntil>Date.now()){show(false);visibleUntil=introUntil;clearTimeout(hideTimer);hideTimer=setTimeout(()=>{if(!keyboardMode)hide();},introUntil-Date.now());}
  let transitionAnimation;
  if(info.enter && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const veil=document.createElement('div');veil.className='veil';root.prepend(veil);
    transitionAnimation=veil.animate([{opacity:1},{opacity:0}],{duration:450,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'});
    transitionAnimation.onfinish=()=>veil.remove();
  }
  // Remove document listeners when the overlay is replaced or playback stops.
  globalThis[key]={host,cleanup(){transitionAnimation?.cancel();barAnimation?.cancel();document.removeEventListener('visibilitychange',syncBar);clearTimeout(cursorTimer);cursorStyle.remove();clearTimeout(hideTimer);document.removeEventListener('pointermove',pointerActivity,true);document.removeEventListener('pointerdown',pointerActivity,true);document.removeEventListener('keydown',keyboardActivity,true);host.remove();}};
}
