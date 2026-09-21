import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
const base='https://evolutionmusicstore.com';
const tmp=path.join(os.tmpdir(),'gatto-research');await fs.mkdir(tmp,{recursive:true});
async function get(url,json=false){const r=await fetch(url,{signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error(`${r.status}: ${url}`);return json?r.json():r.text();}
async function pool(items,n,fn){const out=[];let i=0;await Promise.all(Array.from({length:n},async()=>{while(i<items.length){const j=i++;out[j]=await fn(items[j],j);}}));return out;}
const index=await get(base+'/sitemap.xml');const maps=[...index.matchAll(/<loc>([^<]*sitemap_products_[^<]*)<\/loc>/g)].map(m=>m[1].replaceAll('&amp;','&'));
const found=new Set();const failures=[];
await pool(maps,4,async(url,i)=>{try{const xml=await get(url);for(const m of xml.matchAll(/<loc>([^<]*\/products\/gatto-[^<]*)<\/loc>/g))found.add(m[1]);}catch(e){failures.push(String(e));}if((i+1)%10===0)console.log(`Read ${i+1}/${maps.length} product sitemaps`);});
const extra=['gatto-strat-style-transparent-red','gatto-tele-style-trans-black-finish','gatto-tele-style-electric-guitar-natural-finish','gatto-partscaster-strat-warmoth-build-electric-guitar','gatto-telecaster-with-hot-rails-pickups-electric-guitar','gatto-custom-black-nitro-finish-semi-hollow-guitar-semi-hollow','gatto-strat-style-red-electric-guitar','gatto-candy-green-stratocaster-with-emg'];extra.forEach(h=>found.add(base+'/products/'+h));
await fs.writeFile(path.join(tmp,'discovery.json'),JSON.stringify({maps:maps.length,urls:[...found],failures},null,2));
const products=(await pool([...found],3,async(url)=>{try{const p=await get(url+'.js',true);await fs.writeFile(path.join(tmp,p.handle+'.json'),JSON.stringify(p,null,2));return {id:p.id,handle:p.handle,title:p.title,description:p.description,tags:p.tags,available:p.available,price:p.price/100,images:p.images.map(x=>x.startsWith('//')?'https:'+x:x),url,checked:'2026-09-20'};}catch(e){failures.push(String(e));return null;}})).filter(Boolean);
await fs.mkdir('research',{recursive:true});await fs.writeFile('research/catalog.json',JSON.stringify(products,null,2));
console.log(JSON.stringify({sitemaps:maps.length,count:products.length,failures,products:products.map(p=>({handle:p.handle,title:p.title,price:p.price,available:p.available,images:p.images.length,description:p.description.split('At Evolution')[0]}))},null,2));
await fs.mkdir('dist/assets/instruments',{recursive:true});
await pool(products,3,async(p)=>{const local=[];for(let i=0;i<p.images.length;i++){const filename=`${p.handle}-${i+1}.jpg`;const dest='dist/assets/instruments/'+filename;try{await fs.access(dest);}catch{const r=await fetch(p.images[i]+(p.images[i].includes('?')?'&':'?')+'width=1400');if(!r.ok)throw Error('Image '+r.status);await fs.writeFile(dest,Buffer.from(await r.arrayBuffer()));}local.push('/assets/instruments/'+filename);}p.localImages=local;});
await fs.writeFile('research/catalog.json',JSON.stringify(products,null,2));console.log('All listing galleries downloaded.');
