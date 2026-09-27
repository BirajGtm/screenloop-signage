const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
let saved={urls:[],names:[],seconds:60,reloadMinutes:0,accent:'#005bdb'},storage={},opened=[];
function element(){return {value:'',children:[],append(...v){this.children.push(...v)},replaceChildren(){this.children=[]}};}
function launch(){
 const nodes={};const document={getElementById:id=>nodes[id]??=element(),createElement:element};
 const chrome={storage:{local:{get:async()=>storage,set:async v=>Object.assign(storage,v),remove:async k=>delete storage[k]}},tabs:{create:async v=>opened.push(v.url)},runtime:{sendMessage:async m=>{if(m.action==='settings')return {ok:true,state:saved};if(m.action==='saveSettings')saved=m.settings;return {ok:true,state:{}}}}};
 vm.runInNewContext(fs.readFileSync(__dirname+'/chrome-extension/setup.js','utf8'),{document,chrome,URL,console});return nodes;
}
const settle=()=>new Promise(r=>setImmediate(r));
(async()=>{
 let n=launch();await settle();assert.equal(n.save.disabled,true);
 n.url.value='https://example.com/monitor';n.url.oninput();n.name.value='Operations';n.name.oninput();await settle();
 n=launch();await settle();assert.equal(n.url.value,'https://example.com/monitor');
 await n.add.onsubmit({preventDefault(){}});assert.equal(opened[0],'https://example.com/monitor');assert.equal(n.confirm.hidden,false);assert.equal(n.save.disabled,true);
 n.ready.onclick();await settle();assert.equal(n.save.disabled,false);await n.save.onclick();assert.equal(saved.names[0],'Operations');assert.equal(saved.urls[0],opened[0]);assert.equal(storage.setupDraft,undefined);
 console.log('PASS: draft recovery, open/check step, readiness gate, named playlist saving');
})().catch(e=>{console.error(e);process.exitCode=1});
