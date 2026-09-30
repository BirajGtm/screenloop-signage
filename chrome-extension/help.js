// Keep help for non-obvious behavior that is not already explained inline.
// Help lives outside labels/buttons so opening it never changes a setting.
const helpText={
 reload:['Page refresh','Reloads every display page at this interval, including background tabs. Off by default. Runs only while signage is playing. Click Save settings to apply.'],
 timer:['Side bar','Shows time remaining before the next page. With one page, it bounces as an activity indicator. Pausing stops movement.'],
 url:['Website URL','Use an HTTP or HTTPS address without embedded credentials. Sign in in the page Chrome opens. For redirects, use the final dashboard URL.'],
};
for(const [id,[title,text]] of Object.entries(helpText)){
 const target=document.getElementById(id);if(!target)continue;
 const details=document.createElement('details');details.className='help';
 const summary=document.createElement('summary');summary.textContent='?';summary.setAttribute('aria-label','Help: '+title);
 const description=document.createElement('span');description.className='help-text';description.textContent=text;
 details.append(summary,description);
 const anchor=target.closest('label')||target.closest('.accent-field')||target;
 const slot=document.getElementById(id+'-help');
 if(slot)slot.append(details);else anchor.after(details);
 if(anchor.hidden)details.hidden=true;
 new MutationObserver(()=>{details.hidden=anchor.hidden;}).observe(anchor,{attributes:true,attributeFilter:['hidden']});
 details.addEventListener('keydown',e=>{if(e.key==='Escape'){details.open=false;summary.blur();}});
}

// Close help on any other click, including clicks inside the explanation.
document.addEventListener('click',event=>{
 for(const details of document.querySelectorAll('.help[open]')){
  if(!details.querySelector('summary').contains(event.target))details.open=false;
 }
},true);
