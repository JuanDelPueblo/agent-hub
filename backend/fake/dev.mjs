#!/usr/bin/env node
// Starts the fake backend and the Angular dev server together.
// Run it through `npm run dev` in `frontend/`.

import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const frontendDir = resolve(here, '..', '..', 'frontend');

const children = [];

function start(name, command, args, cwd) {
  const child = spawn(command, args, { cwd, stdio: 'inherit', shell: false });
  child.on('exit', (code, signal) => {
    if (shuttingDown) return;
    console.error(`[dev] ${name} stopped (code ${code ?? signal}). Shutting down.`);
    shutdown(code ?? 1);
  });
  children.push(child);
  return child;
}

let shuttingDown = false;
function shutdown(code) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) child.kill('SIGTERM');
  }
  setTimeout(() => process.exit(code), 300);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

const extra = process.argv.slice(2);

start('fake-backend', process.execPath, [resolve(here, 'server.mjs'), ...extra], here);
start('ng serve', 'npx', ['ng', 'serve'], frontendDir);
