import fs from 'node:fs/promises';
import path from 'node:path';

// GitHub project sites live under /repository-name; the Sites build stays at /.
const base = (process.argv[2] || '').replace(/\/$/, '');
if (base && !/^\/[A-Za-z0-9._-]+$/.test(base)) throw Error('Invalid Pages base path');
const root = path.resolve('.');
const output = path.resolve('.github-pages');
if (path.dirname(output) !== root || path.basename(output) !== '.github-pages') {
  throw Error('Pages output must stay in the project');
}
await fs.rm(output, { recursive: true, force: true });
await fs.cp(path.resolve('dist'), output, { recursive: true });
await fs.writeFile(path.join(output, '.nojekyll'), '');

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory()
    ? walk(path.join(dir, entry.name)) : path.join(dir, entry.name)))).flat();
}
const files = await walk(output);
let references = 0;
for (const file of files) {
  const ext = path.extname(file);
  if (!['.html', '.css'].includes(ext)) continue;
  let text = await fs.readFile(file, 'utf8');
  if (ext === '.html') {
    text = text.replace(/\b(href|src|data-photo)="\/(?!\/)/g, `$1="${base}/`);
  } else {
    text = text.replace(/url\((['"]?)\/(?!\/)/g, `url($1${base}/`);
  }
  await fs.writeFile(file, text);
  const urls = ext === '.html'
    ? [...text.matchAll(/\b(?:href|src|data-photo)="([^\"]+)"/g)].map(m => m[1])
    : [...text.matchAll(/url\(['"]?([^'"\)]+)['"]?\)/g)].map(m => m[1]);
  for (const url of urls.filter(url => url.startsWith('/') && !url.startsWith('//'))) {
    if (!url.startsWith(`${base}/`)) throw Error(`Missing Pages prefix: ${url}`);
    const local = url.slice(base.length).split(/[?#]/)[0];
    const target = path.join(output, local, local.endsWith('/') ? 'index.html' : '');
    await fs.access(target);
    references++;
  }
}
console.log(`Prepared ${files.filter(f => f.endsWith('.html')).length - 1} pages at ${base || '/'}, verified ${references} local references.`);
