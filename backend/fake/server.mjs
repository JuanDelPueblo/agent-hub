#!/usr/bin/env node
// Fake Agent Hub backend.
//
// It serves the REST and WebSocket surface of `backend/src/web/` from memory, so the
// frontend runs without a Rust build and without an ACP agent binary. It is a
// development tool only. It has no persistence, no authentication and no
// access to the real filesystem.
//
// Usage: node fake-backend/server.mjs [--port 8765] [--latency 1.0]

import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';

import { upgrade } from './websocket.mjs';
import { AGENTS, FakeState, PERMISSION_POLICIES, PROJECT_ROOT, defaultConfigOptions } from './state.mjs';
import { answerPermission, cancel, isRunning, startTurn } from './turns.mjs';

const options = parseArgs(process.argv.slice(2));
const state = new FakeState();

// ---------------------------------------------------------------- routing

/** Route table. The patterns mirror the axum router of `backend/src/web/mod.rs`. */
const routes = [
  ['GET', /^\/api\/projects$/, () => json(state.listProjects())],
  ['POST', /^\/api\/projects$/, createProject],
  ['POST', /^\/api\/projects\/clone$/, cloneProject],
  ['GET', /^\/api\/filesystem\/directories$/, listDirectories],
  ['PATCH', /^\/api\/projects\/([^/]+)$/, editProject],
  ['DELETE', /^\/api\/projects\/([^/]+)$/, deleteProject],
  ['GET', /^\/api\/projects\/([^/]+)\/chats$/, listChats],
  ['POST', /^\/api\/projects\/([^/]+)\/chats$/, createChat],
  ['GET', /^\/api\/chats\/([^/]+)$/, getChat],
  ['PATCH', /^\/api\/chats\/([^/]+)$/, editChat],
  ['DELETE', /^\/api\/chats\/([^/]+)$/, deleteChat],
  ['POST', /^\/api\/chats\/([^/]+)\/prompt$/, promptChat],
  ['POST', /^\/api\/chats\/([^/]+)\/cancel$/, cancelChat],
  ['POST', /^\/api\/chats\/([^/]+)\/resume$/, resumeChat],
  ['POST', /^\/api\/chats\/([^/]+)\/stop$/, stopChat],
  ['POST', /^\/api\/chats\/([^/]+)\/permission$/, respondPermission],
  ['GET', /^\/api\/chats\/([^/]+)\/config$/, getConfig],
  ['PATCH', /^\/api\/chats\/([^/]+)\/config$/, setConfig],
  ['DELETE', /^\/api\/chats\/([^/]+)\/config\/([^/]+)$/, clearConfig],
  ['GET', /^\/api\/chats\/([^/]+)\/remote-sessions$/, remoteSessions],
  ['GET', /^\/api\/agents$/, () => json(AGENTS)],
  ['GET', /^\/api\/status$/, getStatus],
];

const server = createServer(async (request, response) => {
  const url = new URL(request.url, 'http://localhost');
  const method = request.method ?? 'GET';

  // The Angular dev server proxies the API, so a browser preflight is rare.
  // It is answered anyway, to keep a direct browser call working.
  if (method === 'OPTIONS') {
    response.writeHead(204, corsHeaders()).end();
    return;
  }

  for (const [routeMethod, pattern, handler] of routes) {
    if (routeMethod !== method) continue;
    const match = pattern.exec(url.pathname);
    if (!match) continue;

    try {
      const body = await readJsonBody(request);
      const params = match.slice(1).map(decodeURIComponent);
      const result = await handler({ params, body, url });
      send(response, result);
    } catch (error) {
      const status = error.status ?? 500;
      log(`${method} ${url.pathname} -> ${status} ${error.message}`);
      send(response, { status, value: { error: error.message } });
    }
    return;
  }

  send(response, { status: 404, value: { error: 'Not found' } });
});

server.on('upgrade', (request, socket, head) => {
  const url = new URL(request.url, 'http://localhost');
  if (url.pathname !== '/ws') {
    socket.end('HTTP/1.1 404 Not Found\r\n\r\n');
    return;
  }
  handleWebSocket(request, socket, head);
});

server.listen(options.port, '127.0.0.1', () => {
  log(`fake Agent Hub backend on http://127.0.0.1:${options.port}`);
  log(`${state.projects.size} projects, ${state.chats.size} chats, latency x${options.latency}`);
  log('prompt keywords: plan, tool, permission, error, long, quiet');
});

// ------------------------------------------------------------- websocket

function handleWebSocket(request, rawSocket, head) {
  const socket = upgrade(request, rawSocket, head);
  if (!socket) return;

  let unsubscribe = null;

  socket.onMessage = (text) => {
    let message;
    try {
      message = JSON.parse(text);
    } catch {
      return; // A malformed frame cannot change state.
    }

    if (message.type === 'subscribe') {
      const fromSeq = Number(message.from_seq) || 0;
      for (const event of state.replayFrom(fromSeq)) {
        socket.send(JSON.stringify(event));
      }
      socket.send(JSON.stringify({ type: 'subscribed', through_seq: state.nextSeq - 1 }));

      // Live events start only after the replay, so no event is sent twice.
      unsubscribe?.();
      let lastSent = state.nextSeq - 1;
      unsubscribe = state.subscribe((event) => {
        if (event.seq <= lastSent) return;
        lastSent = event.seq;
        socket.send(JSON.stringify(event));
      });
      return;
    }

    if (message.type === 'permission_response') {
      answerPermission(message.session_id, message.id, Boolean(message.granted));
    }
    // Prompt and cancel over the WebSocket are unsupported, as in the backend.
  };

  socket.onClose = () => unsubscribe?.();
}

// --------------------------------------------------------------- handlers

function createProject({ body }) {
  const name = requireString(body, 'name');
  const path = requireString(body, 'path');
  requireInsideRoots(path);
  if ([...state.projects.values()].some((project) => project.path === path)) {
    throw httpError(409, 'A project already uses that directory');
  }
  const project = state.createProject(name, path);
  state.metadataChanged();
  return json(state.projectView(project), 200);
}

function editProject({ params, body }) {
  const project = state.projects.get(params[0]);
  if (!project) throw httpError(404, 'Project not found');

  const name = requireString(body, 'name');
  const path = requireString(body, 'path');
  requireInsideRoots(path);

  const hasChats = [...state.chats.values()].some((chat) => chat.project_id === project.id);
  if (project.path !== path && hasChats) {
    throw httpError(
      409,
      "Move or delete the project's chats before changing its path; saved ACP sessions belong to their original directory",
    );
  }

  project.name = name;
  project.path = path;
  project.updated_at = new Date().toISOString();
  state.metadataChanged();
  return json(state.projectView(project));
}

function deleteProject({ params }) {
  const project = state.projects.get(params[0]);
  if (!project) throw httpError(404, 'Project not found');
  if ([...state.chats.values()].some((chat) => chat.project_id === project.id)) {
    throw httpError(409, "Delete the project's chats first (project files are never deleted)");
  }
  state.projects.delete(project.id);
  state.metadataChanged();
  return json({ success: true });
}

async function cloneProject({ body }) {
  const url = requireString(body, 'url');
  const parentPath = requireString(body, 'parent_path');
  requireInsideRoots(parentPath);
  validateGitUrl(url);

  const name = (body.name ?? '').trim() || deriveRepoName(url);
  if (!name) throw httpError(400, 'Could not derive project name from repository URL');
  if (name.includes('/') || name.includes('\\')) {
    throw httpError(400, 'Clone destination name cannot contain path separators');
  }

  const destination = `${parentPath}/${name}`;
  if ([...state.projects.values()].some((project) => project.path === destination)) {
    throw httpError(409, `Destination directory already exists: ${destination}`);
  }

  // A real clone takes time. The delay keeps the progress state visible.
  await new Promise((resolve) => setTimeout(resolve, 1200 * options.latency));

  const project = state.createProject(name, destination);
  state.metadataChanged();
  return json(state.projectView(project));
}

function listChats({ params }) {
  if (!state.projects.has(params[0])) throw httpError(404, 'Project not found');
  return json(state.listChats(params[0]));
}

function createChat({ params, body }) {
  if (!state.projects.has(params[0])) throw httpError(404, 'Project not found');
  const agent = requireString(body, 'agent');
  if (!AGENTS.includes(agent)) throw httpError(400, 'Unknown agent');

  const chat = state.createChat(params[0], agent, body.title);
  state.metadataChanged();
  return json(state.chatView(chat));
}

function getChat({ params }) {
  return json(state.chatView(requireChat(params[0])));
}

function editChat({ params, body }) {
  const chat = requireChat(params[0]);

  if (body.title !== undefined) {
    const title = requireString(body, 'title');
    if (title.length > 200) throw httpError(400, 'Name must contain 1–200 bytes');
    chat.title = title;
    chat.title_overridden = true;
  }
  if (body.archived !== undefined) {
    chat.archived = Boolean(body.archived);
  }
  if (body.permission_policy !== undefined) {
    if (!PERMISSION_POLICIES.includes(body.permission_policy)) {
      throw httpError(400, 'Unknown permission policy');
    }
    chat.permission_policy = body.permission_policy;
  }

  chat.updated_at = new Date().toISOString();
  state.metadataChanged();
  return json(state.chatView(chat));
}

function deleteChat({ params }) {
  const chat = requireChat(params[0]);
  cancel(chat.id);
  state.chats.delete(chat.id);
  state.configByChat.delete(chat.id);
  state.runtime.delete(chat.id);
  state.forgetChat(chat.id);
  state.metadataChanged();
  return json({ success: true });
}

function promptChat({ params, body }) {
  const chat = requireChat(params[0]);
  const text = typeof body.text === 'string' ? body.text : '';
  if (!text.trim() || text.length > 100_000) {
    throw httpError(400, 'Prompt must contain 1–100000 bytes');
  }
  if (isRunning(chat.id)) {
    throw httpError(409, 'Wait for the active turn to finish');
  }

  ensureRunning(chat);
  startTurn(state, chat, text, options.latency);
  // The backend answers 202 and streams the result on the WebSocket.
  return json({ accepted: true }, 202);
}

function cancelChat({ params }) {
  const chat = requireChat(params[0]);
  if (cancel(chat.id)) state.setRuntime(chat.id, 'RUNNING', 'CANCELLING');
  return json({ success: true });
}

async function resumeChat({ params }) {
  const chat = requireChat(params[0]);
  if (chat.archived) throw httpError(409, 'Restore the chat before you connect it');

  state.setRuntime(chat.id, 'STARTING', 'IDLE');
  if (!chat.acp_session_id) chat.acp_session_id = `acp-${randomUUID()}`;

  // `AcpSession::resume` awaits the process, so the real endpoint answers only
  // after the agent runs. The caller fetches the config right after this
  // response, and that fetch must not race the spawn.
  await new Promise((resolve) => setTimeout(resolve, 400 * options.latency));

  state.setRuntime(chat.id, 'RUNNING', 'IDLE');
  state.emit(chat.id, chat.agent, {
    type: 'config_options',
    options: state.configByChat.get(chat.id) ?? defaultConfigOptions(chat.agent),
  });

  return json(state.chatView(chat));
}

function stopChat({ params }) {
  const chat = requireChat(params[0]);
  cancel(chat.id);
  state.setRuntime(chat.id, 'STOPPED', 'IDLE');
  return json({ success: true });
}

function respondPermission({ params, body }) {
  const chat = requireChat(params[0]);
  const id = requireString(body, 'id');
  answerPermission(chat.id, id, Boolean(body.granted));
  return json({ success: true });
}

function getConfig({ params }) {
  const chat = requireChat(params[0]);
  ensureRunning(chat);
  return json(state.configByChat.get(chat.id) ?? []);
}

function setConfig({ params, body }) {
  const chat = requireChat(params[0]);
  if (isRunning(chat.id)) {
    throw httpError(400, 'Wait for the active turn before changing configuration');
  }

  const id = requireString(body, 'id');
  const config = state.configByChat.get(chat.id) ?? [];
  const option = config.find((entry) => entry.id === id);
  if (!option) throw httpError(400, `Unknown config option: ${id}`);

  option.currentValue = body.value;
  chat.config_values = { ...chat.config_values, [id]: body.value };

  state.emit(chat.id, chat.agent, { type: 'config_options', options: config });
  return json(config);
}

function clearConfig({ params }) {
  const chat = requireChat(params[0]);
  const optionId = params[1];
  const next = { ...chat.config_values };
  delete next[optionId];
  chat.config_values = next;
  return { status: 204, value: null };
}

function remoteSessions({ params }) {
  const chat = requireChat(params[0]);
  return json({
    sessions: [
      { sessionId: chat.acp_session_id ?? 'acp-unknown', title: chat.title },
      { sessionId: 'acp-older-session', title: 'Earlier conversation' },
    ],
    nextCursor: null,
  });
}

function getStatus() {
  return json({
    project_root: PROJECT_ROOT,
    agents: AGENTS.map((name) => ({
      name,
      process_state: 'STOPPED',
      turn_state: 'IDLE',
    })),
  });
}

// ------------------------------------------------------- fake filesystem

// A synthetic tree. It keeps the folder picker independent of the machine.
const DIRECTORY_TREE = {
  [PROJECT_ROOT]: ['agent-hub', 'corolla-firmware', 'scratch', 'vendor'],
  [`${PROJECT_ROOT}/agent-hub`]: ['frontend', 'src', 'tests'],
  [`${PROJECT_ROOT}/agent-hub/frontend`]: ['public', 'src'],
  [`${PROJECT_ROOT}/agent-hub/src`]: ['acp', 'config', 'session', 'state', 'web'],
  [`${PROJECT_ROOT}/corolla-firmware`]: ['calibration', 'flash', 'tools'],
  [`${PROJECT_ROOT}/scratch`]: [],
  [`${PROJECT_ROOT}/vendor`]: ['libmvci', 'openssl'],
};

function listDirectories({ url }) {
  const requested = url.searchParams.get('path');
  const target = requested && requested.trim() ? requested : PROJECT_ROOT;

  if (!target.startsWith('/')) throw httpError(400, 'Directory path must be absolute');
  if (!target.startsWith(PROJECT_ROOT)) {
    throw httpError(403, 'Directory is outside configured project roots');
  }
  const children = DIRECTORY_TREE[target];
  if (!children) throw httpError(404, 'Directory does not exist');

  const segments = target.slice(PROJECT_ROOT.length).split('/').filter(Boolean);

  const breadcrumbs = [{ name: 'projects', path: PROJECT_ROOT }];
  let walked = PROJECT_ROOT;
  for (const segment of segments) {
    walked = `${walked}/${segment}`;
    breadcrumbs.push({ name: segment, path: walked });
  }

  return json({
    current: target,
    name: segments.at(-1) ?? 'projects',
    parent: target === PROJECT_ROOT ? null : target.slice(0, target.lastIndexOf('/')),
    roots: [PROJECT_ROOT],
    breadcrumbs,
    directories: children.map((name) => ({ name, path: `${target}/${name}` })),
  });
}

// --------------------------------------------------------------- helpers

function ensureRunning(chat) {
  const runtime = state.runtime.get(chat.id);
  if (runtime?.process !== 'RUNNING') {
    if (!chat.acp_session_id) chat.acp_session_id = `acp-${randomUUID()}`;
    state.setRuntime(chat.id, 'RUNNING', 'IDLE');
  }
}

function requireChat(id) {
  const chat = state.chats.get(id);
  if (!chat) throw httpError(404, 'Chat not found');
  return chat;
}

function requireString(body, field) {
  const value = body?.[field];
  if (typeof value !== 'string' || !value.trim()) {
    throw httpError(400, `Field "${field}" must be a non-empty string`);
  }
  return value.trim();
}

function requireInsideRoots(path) {
  if (!path.startsWith('/')) throw httpError(400, 'Path must be absolute');
  if (!path.startsWith(PROJECT_ROOT)) {
    throw httpError(403, `Path is outside the configured project root ${PROJECT_ROOT}`);
  }
}

/** Mirrors `hub::validate_git_url`. */
function validateGitUrl(url) {
  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();
  if (
    trimmed.startsWith('file://') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('./') ||
    trimmed.startsWith('../') ||
    trimmed.startsWith('~') ||
    trimmed.includes('::')
  ) {
    throw httpError(400, 'Unsafe or unsupported repository URL transport');
  }
  if (lower.startsWith('http://')) {
    throw httpError(400, 'Plain HTTP repository URLs are not allowed. Use HTTPS or SSH');
  }
  const isUrl = lower.startsWith('https://') || lower.startsWith('ssh://');
  const isScp = trimmed.includes('@') && trimmed.includes(':') && !trimmed.includes('://');
  if (!isUrl && !isScp) {
    throw httpError(400, 'Repository URL must be a valid HTTPS or SSH URL');
  }
}

function deriveRepoName(url) {
  const trimmed = url.trim().replace(/\/+$/, '');
  const withoutGit = trimmed.endsWith('.git') ? trimmed.slice(0, -4) : trimmed;
  return withoutGit.split(/[/:]/).pop() ?? '';
}

function json(value, status = 200) {
  return { status, value };
}

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function corsHeaders() {
  return {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    'access-control-allow-headers': 'content-type,authorization',
  };
}

function send(response, { status, value }) {
  const body = JSON.stringify(value ?? null);
  response.writeHead(status, {
    'content-type': 'application/json',
    'content-length': Buffer.byteLength(body),
    ...corsHeaders(),
  });
  response.end(body);
}

function readJsonBody(request) {
  if (request.method === 'GET' || request.method === 'DELETE') return Promise.resolve({});

  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    request.on('data', (chunk) => {
      size += chunk.length;
      if (size > 1_000_000) {
        reject(httpError(413, 'Request body is too large'));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw.trim()) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(httpError(400, 'Request body is not valid JSON'));
      }
    });
    request.on('error', reject);
  });
}

function parseArgs(argv) {
  const parsed = { port: 8765, latency: 1 };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--port') parsed.port = Number(argv[++index]);
    else if (arg === '--latency') parsed.latency = Number(argv[++index]);
    else if (arg === '--help') {
      console.log('Usage: node fake-backend/server.mjs [--port 8765] [--latency 1.0]');
      process.exit(0);
    }
  }
  if (!Number.isFinite(parsed.port) || parsed.port <= 0) throw new Error('Invalid --port');
  if (!Number.isFinite(parsed.latency) || parsed.latency < 0) throw new Error('Invalid --latency');
  return parsed;
}

function log(message) {
  console.log(`[fake-backend] ${message}`);
}
