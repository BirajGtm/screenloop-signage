// CSS handles System, including live browser appearance changes.
(()=>{
 const apply=value=>{document.documentElement.dataset.theme=['light','dark'].includes(value)?value:'system';};
 let changed=false;
 chrome.storage.onChanged.addListener((changes,area)=>{
  if(area==='local'&&changes.settings){changed=true;apply(changes.settings.newValue?.theme);}
 });
 chrome.storage.local.get('settings').then(({settings})=>{if(!changed)apply(settings?.theme);}).catch(()=>apply('system'));
})();
