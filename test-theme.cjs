const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const source=fs.readFileSync(__dirname+'/chrome-extension/theme.js','utf8');
(async()=>{
 for(const saved of [undefined,'system','light','dark','invalid']){
  const document={documentElement:{dataset:{}}};let changed;
  const chrome={storage:{local:{get:async()=>({settings:{theme:saved}})},onChanged:{addListener:fn=>changed=fn}}};
  vm.runInNewContext(source,{document,chrome});await new Promise(r=>setImmediate(r));
  assert.equal(document.documentElement.dataset.theme,['light','dark'].includes(saved)?saved:'system');
  changed({settings:{newValue:{theme:'dark'}}},'local');assert.equal(document.documentElement.dataset.theme,'dark');
  changed({settings:{newValue:{theme:'light'}}},'local');assert.equal(document.documentElement.dataset.theme,'light');
  changed({settings:{}},'local');assert.equal(document.documentElement.dataset.theme,'system');
 }
 console.log('PASS: default System appearance, saved overrides, live settings updates, and reset fallback');
})().catch(e=>{console.error(e);process.exitCode=1;});
