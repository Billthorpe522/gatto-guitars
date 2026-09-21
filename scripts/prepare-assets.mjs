import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const sharp=require('C:/Users/lucas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
for(const name of ['gatto-campaign','tonewood-study'])await sharp('dist/assets/'+name+'.png').webp({quality:88}).toFile('dist/assets/'+name+'.webp');
await fs.mkdir('dist/assets/fonts',{recursive:true});
for(const [name,q] of [['dm-sans','DM+Sans:wght@100..1000'],['manrope','Manrope:wght@200..800']]){const css=await(await fetch('https://fonts.googleapis.com/css2?family='+q+'&display=swap',{headers:{'User-Agent':'Mozilla/5.0'}})).text();const blocks=css.split('/* latin */');const block=blocks.at(-1);const url=block.match(/url\(([^)]+)\)/)?.[1];if(!url)throw Error('Font source missing: '+name);const r=await fetch(url);if(!r.ok)throw Error('Font request failed');await fs.writeFile('dist/assets/fonts/'+name+'.ttf',Buffer.from(await r.arrayBuffer()));}
console.log('Campaign artwork optimized; typefaces stored locally.');
