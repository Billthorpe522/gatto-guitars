import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const sharp=require('C:/Users/lucas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
for(const name of ['gatto-campaign','tonewood-study'])await sharp('dist/assets/'+name+'.png').webp({quality:88}).toFile('dist/assets/'+name+'.webp');
await import('./prepare-fonts.mjs');
console.log('Campaign artwork optimized; typefaces stored locally.');
