import test from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { root, build } from './build.mjs';
import { validate } from './validate.mjs';

async function fixture(t) {
  const dir = await mkdtemp(join(tmpdir(), 'site-build-test-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  for (const name of ['index.html', 'assets', 'public']) {
    await cp(join(root, name), join(dir, name), { recursive: true });
  }
  return dir;
}

test('internal files and stale output never enter publication', async t => {
  const dir = await fixture(t);
  for (const name of ['.git/config', '.git/HEAD', '.env', 'wrangler.jsonc', 'node_modules/internal.js', 'dist/stale.txt']) {
    await mkdir(join(dir, name, '..'), { recursive: true });
    await writeFile(join(dir, name), 'TEST FIXTURE — not a credential');
  }
  await validate(await build(dir));
});

test('reject output symlink', async t => {
  const dir = await fixture(t);
  await symlink(join(dir, 'assets'), join(dir, 'dist'));
  await assert.rejects(build(dir), /dist must not be a symlink/);
});

test('reject contaminated output and unresolved local dependencies', async t => {
  const dir = await fixture(t);
  const output = await build(dir);
  await writeFile(join(output, 'internal.txt'), 'not public');
  await assert.rejects(validate(output), /publication allowlist/);
  await rm(join(output, 'internal.txt'));
  await writeFile(join(output, 'assets/css/style.css'), "body{background:url('../img/missing.webp')}");
  await assert.rejects(validate(output), /Missing dependency/);
});
