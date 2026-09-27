// Runs in the extension's isolated world, only in managed playlist tabs.
function renderSignageOverlay(info) {
  const key='__networkSignageOverlayV12';
  const previous=globalThis[key];
  if(previous) { previous.cleanup(); }
  if(!info.visible) { delete globalThis[key]; return; }
  const host=document.createElement('div');
  host.style.cssText='all:initial!important;position:fixed!important;inset:0!important;pointer-events:none!important;z-index:2147483647!important;';
  const root=host.attachShadow({mode:'closed'});
  const style=document.createElement('style');
  style.textContent=`.rail{position:absolute;right:10px;top:10vh;height:80vh;width:6px;border-radius:8px;background:rgba(15,23,42,.35);box-shadow:0 0 0 1px rgba(255,255,255,.25);overflow:hidden}.fill{height:100%;width:100%;background:#005bdb;transform-origin:bottom;border-radius:8px;box-shadow:0 0 12px #005bdb}.veil{position:absolute;inset:0;background:#07111f;pointer-events:none}@media(prefers-reduced-motion:reduce){.veil{display:none}}`;
  const accent=/^#[0-9a-f]{6}$/i.test(info.accent)?info.accent:'#005bdb';
  style.textContent+=`.fill{background:${accent};box-shadow:0 0 12px ${accent}}`;
  style.textContent+=`.controls{position:absolute;bottom:44px;left:50%;transform:translateX(-50%);display:flex;gap:6px;padding:8px;border:1px solid #52637a;border-radius:14px;background:#07111ff2;box-shadow:0 8px 30px #0006;pointer-events:auto;font:14px system-ui;max-width:95vw;flex-wrap:wrap;justify-content:center}.controls[hidden]{display:none}button{font:600 14px system-ui;background:#14283e;color:#fff;border:1px solid #52637a;border-radius:8px;padding:10px;cursor:pointer}button:hover{border-color:${accent}}button:focus-visible{outline:3px solid ${accent};outline-offset:2px}.handle{position:absolute;bottom:8px;left:50%;transform:translateX(-50%);pointer-events:auto;padding:6px 14px}.status{color:#fff;align-self:center}.zone{position:absolute;bottom:0;left:calc(50% - 120px);width:240px;height:12px;pointer-events:auto}`;
  const rail=document.createElement('div'),fill=document.createElement('div');rail.className='rail';fill.className='fill';rail.append(fill);root.append(style,rail);
  rail.hidden=info.showTimer===false;
  document.documentElement.append(host);
  const remaining=info.running?Math.max(0,info.deadline-Date.now()):Math.max(0,info.remaining||0);
  const fraction=Math.min(1,remaining/(info.seconds*1000));
  fill.style.transform=`scaleY(${fraction})`;
  if(info.running && remaining>0) fill.animate([{transform:`scaleY(${fraction})`},{transform:'scaleY(0)'}],{duration:remaining,fill:'forwards',easing:'linear'});
  const controls=document.createElement('nav');controls.className='controls';controls.setAttribute('aria-label','Signage controls');
  const handle=document.createElement('button');handle.className='handle';handle.textContent='Controls';handle.setAttribute('aria-expanded','true');
  const zone=document.createElement('div');zone.className='zone';
  let hideTimer;
  function show(){controls.hidden=false;handle.setAttribute('aria-expanded','true');clearTimeout(hideTimer);if(info.running) hideTimer=setTimeout(()=>{if(!controls.matches(':hover')&&!controls.contains(root.activeElement)){controls.hidden=true;handle.setAttribute('aria-expanded','false');}},3000);}
  handle.addEventListener('click',show);zone.addEventListener('pointerenter',show);controls.addEventListener('pointerenter',()=>clearTimeout(hideTimer));controls.addEventListener('pointerleave',show);controls.addEventListener('focusin',()=>clearTimeout(hideTimer));controls.addEventListener('focusout',show);
  for(const [label,action] of [['Previous','previous'],[info.running?'Pause':'Play',info.running?'pause':'resume'],['Next','next'],['Fullscreen','fullscreen']]) {
    const b=document.createElement('button');b.textContent=label;b.type='button';
    b.addEventListener('click',async()=>{b.disabled=true;try{const r=await chrome.runtime.sendMessage({action:'overlayControl',control:action});if(!r.ok)throw Error(r.error);}catch(e){handle.textContent='Open extension to reconnect';handle.title=e.message;}finally{b.disabled=false;}});controls.append(b);
  }
  if(!info.running){const label=document.createElement('span');label.className='status';label.textContent='Paused';controls.append(label);}
  root.append(zone,handle,controls);show();
  if(info.enter && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const veil=document.createElement('div');veil.className='veil';root.prepend(veil);
    const animation=veil.animate([{opacity:.65},{opacity:0}],{duration:350,easing:'ease-out',fill:'forwards'});
    animation.onfinish=()=>veil.remove();
  }
  // Safety cleanup if the extension is disabled or removed while displaying.
  globalThis[key]={host,cleanup(){clearTimeout(hideTimer);host.remove();}};
}
