import assert from 'node:assert/strict';
import { readFile, readdir, lstat } from 'node:fs/promises';
import { resolve, posix } from 'node:path';
import { root, outputFiles } from './build.mjs';

export async function validate(directory = resolve(root, 'dist')) {
  const found = [];
  async function walk(relative = '') {
    for (const name of await readdir(resolve(directory, relative))) {
      const file = posix.join(relative, name);
      const stat = await lstat(resolve(directory, file));
      assert(!name.startsWith('.') && name !== 'node_modules', `Internal path in output: ${file}`);
      assert(!stat.isSymbolicLink(), `Symlink in output: ${file}`);
      if (stat.isDirectory()) await walk(file);
      else {
        assert(stat.size <= 25 * 1024 * 1024, `Asset exceeds limit: ${file}`);
        found.push(file);
      }
    }
  }
  await walk();
  assert.deepEqual(found.sort(), outputFiles, 'Output must exactly match the publication allowlist');

  for (const file of found.filter(name => /\.(html|css|js|xml|txt)$/.test(name) || name === '_headers')) {
    const text = await readFile(resolve(directory, file), 'utf8');
    assert(!/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|AKIA[A-Z0-9]{16}/.test(text), `Possible credential in ${file}`);
    let refs = [];
    if (file.endsWith('.html')) refs = [...text.matchAll(/(?:src|href)="([^"]+)"/g)].map(m => m[1]);
    if (file.endsWith('.css')) refs = [...text.matchAll(/url\(['"]?([^'"()]+)['"]?\)/g)].map(m => m[1]);
    if (file.endsWith('.js')) refs = [...text.matchAll(/from\s+['"]([^'"]+)['"]/g)].map(m => m[1]);
    for (const ref of refs) {
      if (/^(?:[a-z]+:|\/\/|#)/i.test(ref)) continue;
      const clean = ref.split(/[?#]/)[0];
      const path = posix.normalize(ref.startsWith('/') ? clean.slice(1) : posix.join(posix.dirname(file), clean));
      assert(found.includes(path === '.' ? 'index.html' : path), `Missing dependency ${ref} in ${file}`);
    }
  }
  console.log(`Validated ${found.length} public files; dependencies resolved; no internal paths or recognized credential patterns.`);
  return found;
}

if (process.argv[1]?.endsWith('/validate.mjs')) await validate();
