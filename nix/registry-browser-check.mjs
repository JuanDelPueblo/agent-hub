// Check the rendered OCI Registry with Chromium and the DevTools protocol.
// Run with Node 22: node nix/registry-browser-check.mjs http://localhost:8765
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const base = process.argv[2] ?? 'http://localhost:8765';
const offline = process.argv.includes('--offline');
const profile = await mkdtemp(join(tmpdir(), 'batey-registry-browser-'));
const browser = spawn(process.env.CHROMIUM ?? 'chromium', [
  '--headless', '--no-sandbox', '--disable-gpu', '--remote-debugging-port=0',
  `--user-data-dir=${profile}`, 'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] });
const timeout = setTimeout(() => { browser.kill(); process.exitCode = 1; }, 60000);
let socket;
try {
  const endpoint = await new Promise((resolve, reject) => {
    browser.once('error', reject);
    browser.once('exit', (code) => reject(new Error(`Chromium exited: ${code}`)));
    browser.stderr.on('data', (chunk) => {
      const match = chunk.toString().match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) resolve(match[1]);
    });
  });
  const url = new URL(endpoint);
  const tabs = await (await fetch(`http://${url.host}/json/list`)).json();
  socket = new WebSocket(tabs.find((tab) => tab.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.onopen = resolve;
    socket.onerror = reject;
  });
  let nextId = 0;
  const pending = new Map();
  socket.onclose = () => {
    for (const request of pending.values()) request.reject(new Error('Chromium connection closed'));
    pending.clear();
  };
  const errors = [];
  let requests = 0;
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    if (message.id) {
      const request = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) request.reject(new Error(JSON.stringify(message.error)));
      else request.resolve(message.result);
    }
    if (message.method === 'Runtime.exceptionThrown') {
      errors.push(message.params.exceptionDetails.exception?.description ?? message.params.exceptionDetails.text);
    }
    if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') {
      errors.push(message.params.args.map((arg) => arg.description ?? arg.value).join(' '));
    }
    if (message.method === 'Network.requestWillBeSent' &&
        message.params.request.url.startsWith(`${base}/api/agents/registry`)) requests++;
  };
  const call = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async (expression) => {
    const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
    return result.result.value;
  };
  const waitFor = async (expression) => {
    for (let attempt = 0; attempt < 100; attempt++) {
      if (errors.length) throw new Error(errors.join('\n'));
      if (await evaluate(expression)) return;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    throw new Error(`Condition failed: ${expression}`);
  };
  await call('Runtime.enable');
  await call('Page.enable');
  await call('Network.enable');
  await call('Page.navigate', { url: `${base}/agents/registry` });
  await waitFor('document.querySelectorAll(".entry").length > 0');
  const count = await evaluate('document.querySelectorAll(".entry").length');
  const initialStatus = await evaluate('document.querySelector(".status").textContent');
  const initialRequests = requests;
  assert.equal(initialRequests, 1);
  const query = async (value) => {
    await evaluate(`(() => { const input = document.querySelector('input[aria-label="Search the registry"]'); input.value = ${JSON.stringify(value)}; input.dispatchEvent(new Event('input', { bubbles: true })); })()`);
  };
  for (const value of ['codex', 'claude']) {
    await query(value);
    await waitFor(`document.querySelectorAll('.entry').length > 0 && [...document.querySelectorAll('.entry')].every(entry => entry.textContent.toLowerCase().includes('${value}'))`);
  }
  await evaluate(`document.querySelector('button[aria-label="Clear search"]').click()`);
  await waitFor(`document.querySelectorAll('.entry').length === ${count}`);
  assert.equal(requests, initialRequests, 'Local search sent a Registry request');
  await query('codex');
  await evaluate("[...document.querySelectorAll('.search-row > button')].find(button => button.textContent.includes('Refresh')).click()");
  await waitFor("document.querySelector('.search-row > button').disabled === false && document.querySelector('mat-progress-bar') === null");
  await waitFor("document.querySelector('.status').textContent.includes('Freshly fetched') || document.querySelector('[role=alert]') !== null");
  await waitFor("document.querySelectorAll('.entry').length > 0 && [...document.querySelectorAll('.entry')].every(entry => entry.textContent.toLowerCase().includes('codex'))");
  assert.equal(await evaluate('document.querySelector("input").value'), 'codex');
  await query('');
  await waitFor(`document.querySelectorAll('.entry').length === ${count}`);
  assert.equal(requests, initialRequests + 1);
  assert.equal(await evaluate("document.querySelector('.status').textContent.includes('Freshly fetched')"), !offline);
  assert.equal(await evaluate("document.querySelector('[role=alert]') !== null"), offline);
  assert.ok(await evaluate('document.querySelector("time")?.dateTime'));
  assert.equal(await evaluate(`(() => {
    const field = document.querySelector('.search-row .search').getBoundingClientRect();
    const button = document.querySelector('.search-row > button').getBoundingClientRect();
    return Math.abs(field.y + field.height / 2 - button.y - button.height / 2) < 2;
  })()`), true, 'The search field and refresh button are not aligned');
  await call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  assert.equal(await evaluate('document.documentElement.scrollWidth <= window.innerWidth'), true);
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ initialEntries: count, initialStatus, finalEntries: await evaluate('document.querySelectorAll(".entry").length'), requests, status: await evaluate('document.querySelector(".status").textContent'), refreshError: await evaluate('document.querySelector("[role=alert]")?.textContent ?? null') }));
} finally {
  clearTimeout(timeout);
  socket?.close();
  if (browser.exitCode === null && browser.signalCode === null) {
    const exited = new Promise((resolve) => browser.once('exit', resolve));
    browser.kill();
    await exited;
  }
  await rm(profile, { recursive: true, force: true });
}
