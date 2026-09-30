const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
let saved={urls:[],names:[],seconds:60,reloadMinutes:0,accent:'#005bdb'},storage={},opened=[],requests=[],grant=false;
function element(){return {value:'',children:[],setAttribute(){},focus(){},append(...v){this.children.push(...v)},replaceChildren(){this.children=[]}};}
function launch(){
 const nodes={};const document={getElementById:id=>nodes[id]??=element(),createElement:element};
 const chrome={storage:{local:{get:async()=>storage,set:async v=>Object.assign(storage,v),remove:async k=>delete storage[k]}},tabs:{create:async v=>opened.push(v.url)},runtime:{sendMessage:async m=>{if(m.action==='settings')return {ok:true,state:saved};if(m.action==='saveSettings')saved=m.settings;return {ok:true,state:{}}}}};
 chrome.permissions={contains:async()=>grant,request:async v=>{requests.push(v);return grant;}};
 vm.runInNewContext(fs.readFileSync(__dirname+'/chrome-extension/site-access.js','utf8')+'\n'+fs.readFileSync(__dirname+'/chrome-extension/setup.js','utf8'),{document,chrome,URL,console});return nodes;
}
const settle=()=>new Promise(r=>setImmediate(r));
(async()=>{
 let n=launch();await settle();assert.equal(n.save.disabled,true);assert.equal(n['short-timing-note'].hidden,true);
 assert.equal(n.add.hidden,true);n['toggle-add'].onclick();assert.equal(n.add.hidden,false);n['cancel-add'].onclick();assert.equal(n.add.hidden,true);
 n.url.value='https://example.com/monitor';n.url.oninput();n.name.value='Operations';n.name.oninput();await settle();
 n=launch();await settle();assert.equal(n.url.value,'https://example.com/monitor');
 assert.equal(n.seconds.value,30);n.seconds.value='31';n.seconds.onchange();
 await n.add.onsubmit({preventDefault(){}});assert.equal(opened[0],'https://example.com/monitor');assert.equal(n.confirm.hidden,false);assert.equal(n.save.disabled,true);
 await n.ready.onclick();await settle();assert.equal(requests.length,1);assert.equal(requests[0].origins[0],'https://example.com/*');assert.match(n.status.textContent,/declined/);
 assert.equal(n.add.hidden,true);
 const retry=n.pages.children[0].children.at(-1);assert.equal(retry.disabled,false);grant=true;await retry.onclick();assert.equal(retry.disabled,true);
 assert.equal(n.save.disabled,false);await n.save.onclick();assert.equal(saved.names[0],'Operations');assert.equal(saved.urls[0],opened[0]);assert.equal(storage.setupDraft,undefined);
 assert.equal(saved.durations[0],30);assert.equal(n.seconds.value,30);assert.equal(n.pages.children[0].children[2].hidden,true);
 n['toggle-add'].onclick();assert.equal(n.save.disabled,true);assert.equal(n.start.disabled,true);
 assert.equal(n['duration-field'].hidden,false);
 await n.save.onclick();assert.match(n.status.textContent,/Page is ready/);
 n['cancel-add'].onclick();assert.equal(n.save.disabled,false);assert.equal(n.start.disabled,false);
 n['toggle-add'].onclick();n.url.value='https://example.com/second';n.seconds.value='30';await n.add.onsubmit({preventDefault(){}});
 assert.equal(n.save.disabled,true);assert.equal(n.start.disabled,true);await n.start.onclick();assert.equal(saved.urls.length,1);
 n=launch();await settle();assert.equal(n.save.disabled,true);assert.equal(n.start.disabled,true);
 n.cancel.onclick();assert.equal(n.confirm.hidden,true);assert.equal(n.add.hidden,true);assert.equal(n.save.disabled,false);assert.equal(n.start.disabled,false);
 n['toggle-add'].onclick();n.url.value='https://example.com/second';n.seconds.value='5';await n.add.onsubmit({preventDefault(){}});await n.ready.onclick();
 assert.equal(n.pages.children[0].children[2].hidden,false);assert.equal(n.pages.children[1].children[2].hidden,false);
 await n.save.onclick();assert.equal(saved.durations[1],5);
 assert.equal(n['short-timing-note'].hidden,false);
 const duration=n.pages.children[1].children[2].children[0];
 duration.value='29';duration.oninput();assert.equal(n['short-timing-note'].hidden,false);
 duration.value='30';duration.onchange();assert.equal(n['short-timing-note'].hidden,true);
 duration.value='5';duration.onchange();assert.equal(n['short-timing-note'].hidden,false);
 n.pages.children[1].children[3].children[2].onclick();assert.equal(n['short-timing-note'].hidden,true);

 console.log('PASS: draft recovery, open/check step, readiness gate, named playlist saving');
})().catch(e=>{console.error(e);process.exitCode=1});
