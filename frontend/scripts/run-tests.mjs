/**
 * Test runner for the frontend.
 *
 * The component tests import Lit components. Those components use decorators,
 * which the type-stripping mode of Node cannot run. This script therefore
 * bundles every test file with esbuild first, then runs the bundles with the
 * test runner of Node.
 */
import { build } from 'esbuild';
import { spawn } from 'node:child_process';
import { readdir, rm, mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const testDir = join(root, 'test');
const outDir = join(root, '.test-build');

const entries = (await readdir(testDir))
  .filter((f) => f.endsWith('.test.ts'))
  .map((f) => join(testDir, f));

if (entries.length === 0) {
  console.error('No test files found in test/');
  process.exit(1);
}

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

await build({
  entryPoints: entries,
  outdir: outDir,
  outExtension: { '.js': '.mjs' },
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: 'node22',
  sourcemap: 'inline',
  logLevel: 'warning',
  // jsdom reads its own package files at run time. Keep it out of the bundle.
  external: ['jsdom'],
  tsconfig: join(root, 'tsconfig.json'),
});

const bundles = (await readdir(outDir))
  .filter((f) => f.endsWith('.test.mjs'))
  .map((f) => join(outDir, f));

const child = spawn(process.execPath, ['--test', ...bundles], {
  stdio: 'inherit',
  cwd: root,
});

child.on('exit', (code) => process.exit(code ?? 1));
