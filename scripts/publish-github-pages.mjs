import { execFileSync } from 'node:child_process';
import path from 'node:path';

const git = (args, cwd = process.cwd()) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
const origin = git(['remote', 'get-url', 'origin']);
const name = git(['config', 'user.name']);
const email = git(['config', 'user.email']);
await import('./build.mjs');
process.argv[2] = '/gatto-guitars';
await import('./prepare-github-pages.mjs');
const output = path.resolve('.github-pages');
const publishGit = args => git(args, output);
publishGit(['init', '-b', 'gh-pages']);
publishGit(['config', 'core.autocrlf', 'false']);
publishGit(['config', 'user.name', name]);
publishGit(['config', 'user.email', email]);
publishGit(['remote', 'add', 'origin', origin]);
if (git(['ls-remote', '--heads', 'origin', 'gh-pages'])) {
  publishGit(['fetch', '--depth=1', 'origin', 'gh-pages']);
  publishGit(['reset', '--mixed', 'FETCH_HEAD']);
}
publishGit(['add', '--all']);
if (!publishGit(['diff', '--cached', '--name-only'])) {
  console.log('The published files are already up to date.');
} else {
  publishGit(['commit', '-m', 'Update Gatto Guitars feedback preview']);
  publishGit(['push', 'origin', 'HEAD:refs/heads/gh-pages']);
  console.log('Updated the GitHub Pages publishing branch.');
}
