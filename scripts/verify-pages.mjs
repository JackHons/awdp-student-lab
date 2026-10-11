import assert from 'node:assert/strict';
import {existsSync,lstatSync,readFileSync,readdirSync} from 'node:fs';
import {dirname,extname,join,relative,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const output=join(root,'_site');
const files=[];
function walk(folder){for(const name of readdirSync(folder)){const path=join(folder,name),info=lstatSync(path);assert(!info.isSymbolicLink(),`Symlink not supported: ${path}`);if(info.isDirectory())walk(path);else if(info.isFile()){assert.equal(info.nlink,1,`Hard link not supported: ${path}`);files.push(path);}}}
assert(existsSync(join(output,'index.html')),'Run build-pages.mjs first.');
walk(output);
assert(!files.some(path=>relative(output,path).split(/[\\/]/).some(part=>['.git','.openai','.codex','.env'].includes(part))),'Platform metadata must not be published.');
const index=readFileSync(join(output,'index.html'),'utf8');
let localLinks=0;
for(const match of index.matchAll(/(?:src|href)="([^"]+)"/g)){
  const url=match[1];if(/^(?:https?:|data:|#)/.test(url))continue;
  assert(!url.startsWith('/'),`Root-absolute asset breaks project Pages: ${url}`);
  const path=decodeURIComponent(url.split(/[?#]/)[0]);assert(existsSync(join(output,path)),`Missing asset: ${path}`);localLinks++;
}
let javascriptFiles=0;
for(const file of files){if(extname(file)==='.js'){execFileSync(process.execPath,['--check',file],{stdio:'pipe'});javascriptFiles++;}}
for(const name of ['linux_lab.py','waf_guard.py','test_waf_guard.py'])assert(existsSync(join(output,'exercises',name)),`Missing exercise: ${name}`);
for(const doc of ['Linux-CLI入門.md','Linux實驗操作.md','Web與Pwn練習路線.md','Defender修補速查.md','Patch打包與提交.md','備賽指南.md','平台設計.md','lab-catalog.json','defender-resources.json'])assert(existsSync(join(output,doc)),`Missing download: ${doc}`);
const labs=JSON.parse(readFileSync(join(output,'lab-catalog.json'),'utf8'));
const defender=JSON.parse(readFileSync(join(output,'defender-resources.json'),'utf8'));
assert.equal(labs.filter(item=>item.track==='web').length,20);
assert.equal(labs.filter(item=>item.track==='pwn').length,12);
assert.equal(defender.length,11);
console.log(JSON.stringify({verified:true,files:files.length,javascriptFiles,localLinks,projectPathSupported:true}));
