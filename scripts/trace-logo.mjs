// Vector transcription of the photographed headstock mark. No font substitution.
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const sharp=require('C:/Users/lucas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const {data,info}=await sharp('dist/assets/green-7.jpg').extract({left:1700,top:1310,width:290,height:660}).rotate(90).removeAlpha().raw().toBuffer({resolveWithObject:true});
const {width:w,height:h,channels:c}=info;
const cells=new Set();
for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*c;if(data[i]<87&&data[i+1]<74&&data[i+2]<61)cells.add(y*w+x);}
// Keep only connected ink components, discarding photographic sensor noise.
const kept=new Set();while(cells.size){const first=cells.values().next().value,queue=[first],part=[];cells.delete(first);for(let i=0;i<queue.length;i++){const v=queue[i];part.push(v);const x=v%w,y=Math.floor(v/w);for(const n of [x>0?v-1:-1,x<w-1?v+1:-1,y>0?v-w:-1,y<h-1?v+w:-1])if(cells.delete(n))queue.push(n);}if(part.length>15&&!part.some(v=>Math.floor(v/w)<3))for(const v of part)kept.add(v);}
const paths=[];for(let y=0;y<h;y++){let x=0;while(x<w){if(!kept.has(y*w+x)){x++;continue;}const start=x;while(x<w&&kept.has(y*w+x))x++;paths.push(`M${start} ${y}h${x-start}v1H${start}z`);}}
const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="Gatto Custom Guitars"><path fill="#f1f1eb" d="${paths.join('')}"/></svg>`;
await fs.writeFile('dist/assets/gatto-logo.svg',svg);
await sharp(Buffer.from(svg)).resize(990).png().toFile('research/logo-vector-preview.png');
console.log('Headstock signature transcribed as SVG');
