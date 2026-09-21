import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('dist');
async function walk(dir){const entries=await fs.readdir(dir,{withFileTypes:true});return(await Promise.all(entries.map(x=>x.isDirectory()?walk(path.join(dir,x.name)):path.join(dir,x.name)))).flat();}
const files=await walk(root),html=files.filter(f=>f.endsWith('.html')),errors=[];
let checkedLinks=0,checkedImages=0;
for(const f of html){const s=await fs.readFile(f,'utf8');if(!s.includes('<title>'))errors.push('No title '+f);if(!s.includes('name="viewport"'))errors.push('No viewport '+f);const headings=[...s.matchAll(/<h1(?:\s[^>]*)?>/g)];if(headings.length!==1)errors.push('Expected one H1 '+f);const ids=[...s.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);if(new Set(ids).size!==ids.length)errors.push('Duplicate ids '+f);
for(const m of s.matchAll(/(?:href|src)="([^"]+)"/g)){const u=m[1];if(u.startsWith('http')||u.startsWith('mailto:')||u.startsWith('tel:'))continue;if(u.startsWith('#')){if(!ids.includes(u.slice(1)))errors.push('Missing fragment '+u+' '+f);continue;}let [url,fragment]=u.split('#');let target=path.join(root,url);if(url.endsWith('/'))target=path.join(target,'index.html');try{await fs.access(target);checkedLinks++;if(fragment){const dest=await fs.readFile(target,'utf8');if(!dest.includes('id="'+fragment+'"'))errors.push('Missing destination fragment '+u+' '+f);}}catch{errors.push('Missing local URL '+u+' '+f);}}
for(const m of s.matchAll(/<img\b[^>]*>/g)){checkedImages++;if(!/\balt="[^"]*"/.test(m[0]))errors.push('Missing image alt '+f);}
if(!f.endsWith('404.html')&&!s.includes('noindex,nofollow'))errors.push('No private indexing rule '+f);
}
for(const f of html.filter(f=>!f.endsWith('404.html'))){const url='http://127.0.0.1:4173/'+path.relative(root,f).replaceAll('\\','/').replace(/index\.html$/,'');const r=await fetch(url);if(!r.ok)errors.push('HTTP '+r.status+' '+url);}
const summary={pages:html.length-1,localReferences:checkedLinks,imageElements:checkedImages,errors};await fs.writeFile('research/validation.json',JSON.stringify(summary,null,2));console.log(JSON.stringify(summary,null,2));if(errors.length)process.exitCode=1;
