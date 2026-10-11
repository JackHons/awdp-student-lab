import {cpSync,existsSync,lstatSync,mkdirSync,readFileSync,realpathSync,rmSync,writeFileSync} from 'node:fs';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=realpathSync(resolve(dirname(fileURLToPath(import.meta.url)),'..'));
const output=resolve(root,'_site');
if(dirname(output)!==root||output===root)throw new Error('Output must be the project _site directory.');
if(existsSync(output)){
  if(lstatSync(output).isSymbolicLink()||realpathSync(output)!==output)throw new Error('Refusing a redirected output directory.');
  rmSync(output,{recursive:true});
}
mkdirSync(output);
cpSync(join(root,'site'),output,{recursive:true});
for(const filename of ['備賽指南.md','平台設計.md','Linux-CLI入門.md','Linux實驗操作.md','Web與Pwn練習路線.md','Defender修補速查.md','Patch打包與提交.md','lab-catalog.json','defender-resources.json']){
  cpSync(join(root,'docs',filename),join(output,filename));
}
mkdirSync(join(output,'exercises'),{recursive:true});
for(const filename of ['waf_guard.py','test_waf_guard.py','linux_lab.py'])cpSync(join(root,'docs/exercises',filename),join(output,'exercises',filename));
const labs=JSON.parse(readFileSync(join(root,'docs/lab-catalog.json'),'utf8'));
const defender=JSON.parse(readFileSync(join(root,'docs/defender-resources.json'),'utf8'));
writeFileSync(join(output,'resources-data.js'),'// Generated from teaching catalogues.\nconst labCatalog='+JSON.stringify(labs,null,2)+';\nconst defenderResources='+JSON.stringify(defender,null,2)+';\n');
writeFileSync(join(output,'.nojekyll'),'');
console.log(JSON.stringify({output:'_site',webLabs:labs.filter(l=>l.track==='web').length,pwnResources:labs.filter(l=>l.track==='pwn').length,defenderLessons:defender.length}));
