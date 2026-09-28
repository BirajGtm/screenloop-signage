// Help lives outside labels/buttons so opening it never changes a setting.
const helpText={
 reload:['Page refresh','Reloads every display page at this interval, including background tabs. Off by default. Runs only while signage is playing. Click Save settings to apply.'],
 accent:['Accent color','Changes the side bar and floating control colors. Click the color swatch to choose, then Save settings.'],
 timer:['Side bar','Shows time remaining before the next page. With one page, it bounces as an activity indicator. Pausing stops movement.'],
 fade:['Page transition','Adds a brief fade when switching pages. Reduced-motion preferences disable the animation.'],
 access:['Website access','Allows controls and visuals on your playlist websites. Changes apply on Save settings and may show a Chrome permission prompt. Rotation works without access; demo pages need none.'],
 reset:['Reset settings','After confirmation, restores 30-second page durations, reload Off, blue accent, and enabled bar/fade. Keeps saved pages and permissions; clears setup drafts and stops playback.'],
 manage:['Manage pages','Add, remove, reorder, or name websites and edit their durations. Sign in directly on websites, then confirm readiness.'],
 demo:['Demo','Opens three fictional pages without login or site permissions. Your saved playlist is kept.'],
 setup:['Set up pages','Build your playlist, open each website, sign in if needed, and confirm Page is ready.'],
 fullscreen:['Fullscreen','Switches the signage window between fullscreen and normal view.'],
 play:['Playback controls','Play starts signage; Pause stops rotation and automatic refresh without closing pages; Resume continues. Previous/Next switch pages and reset the countdown. They are disabled for a single page.'],
 stop:['Stop and close signage','Stops playback and closes tracked display tabs launched this browser session. Unrelated tabs and saved settings stay. Unsaved work in display tabs may be lost.'],
 settings:['All settings','Configure automatic reload, colors, visual effects, and site access. Apply edits with Save settings.'],
 url:['Website URL','Use an HTTP or HTTPS address without embedded credentials. Sign in in the page Chrome opens. For redirects, use the final dashboard URL.'],
 name:['Page name','Optional friendly name shown in the playlist and playback popup.'],
 seconds:['Page duration','Whole seconds from 30 to 600, default 30. Appears starting with the second page; edit existing durations on page cards. One page stays open without rotation.'],
 ready:['Page readiness','Confirm the website is ready after logging in. ScreenLoop does not detect login status. Chrome may ask for permission to show controls.'],
 save:['Save','Applies your edits and stops current playback. In setup, confirm readiness or cancel adding a page before saving. Restart playback from the popup.'],
 start:['Save and start','Saves your confirmed playlist and starts signage. Unfinished page additions must be confirmed or cancelled first.']
};
for(const [id,[title,text]] of Object.entries(helpText)){
 const target=document.getElementById(id);if(!target)continue;
 const details=document.createElement('details');details.className='help';
 const summary=document.createElement('summary');summary.textContent='?';summary.setAttribute('aria-label','Help: '+title);
 const description=document.createElement('span');description.className='help-text';description.textContent=text;
 details.append(summary,description);
 const anchor=target.closest('label')||target.closest('.accent-field')||(id==='play'?target.parentElement:target);
 anchor.after(details);
 if(anchor.hidden)details.hidden=true;
 new MutationObserver(()=>{details.hidden=anchor.hidden;}).observe(anchor,{attributes:true,attributeFilter:['hidden']});
 details.addEventListener('keydown',e=>{if(e.key==='Escape'){details.open=false;summary.blur();}});
}
