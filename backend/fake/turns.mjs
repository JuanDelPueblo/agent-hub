// Scripted agent turns. A turn streams the same event sequence that a real
// ACP agent produces, so the frontend reducer and the chat UI get exercised
// without a compiled backend and without an agent binary.

import { randomUUID } from 'node:crypto';

/** Turns that are running now, by chat id. */
const active = new Map();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Chooses the scenario from the text of the prompt.
 * The keyword makes a demo reproducible.
 */
export function scenarioFor(text) {
  const lower = text.toLowerCase();
  if (lower.includes('error')) return 'error';
  if (lower.includes('plan-approve')) return 'plan-approve';
  if (lower.includes('permission')) return 'permission';
  if (lower.includes('plan')) return 'plan';
  if (lower.includes('tool')) return 'tools';
  if (lower.includes('long')) return 'long';
  if (lower.includes('quiet')) return 'quiet';
  return 'full';
}

export function isRunning(chatId) {
  return active.has(chatId);
}

/** Marks the turn for cancellation. The turn stops at its next step. */
export function cancel(chatId) {
  const turn = active.get(chatId);
  if (!turn) return false;
  turn.cancelled = true;
  turn.resolvePermission?.(false);
  return true;
}

/** Resolves a permission request that the running turn waits on. */
export function answerPermission(chatId, requestId, granted) {
  const turn = active.get(chatId);
  if (!turn || turn.permissionId !== requestId) return false;
  turn.resolvePermission?.(granted);
  return true;
}

/**
 * Runs one turn. It returns at once; the turn streams in the background,
 * exactly like the `tokio::spawn` of `hub::prompt`.
 */
export function startTurn(state, chat, text, latency) {
  const turn = { cancelled: false, permissionId: null, resolvePermission: null };
  active.set(chat.id, turn);

  runTurn(state, chat, text, latency, turn)
    .catch((error) => {
      state.emit(chat.id, chat.agent, { type: 'error', message: String(error) });
    })
    .finally(() => {
      active.delete(chat.id);
      state.setRuntime(chat.id, 'RUNNING', 'IDLE');
    });
}

async function runTurn(state, chat, text, latency, turn) {
  const agent = chat.agent;
  const emit = (payload) => state.emit(chat.id, agent, payload);
  const pause = (ms) => sleep(Math.round(ms * latency));

  /** Streams text in chunks, so the UI shows a growing message. */
  const stream = async (type, full) => {
    for (const word of full.split(' ')) {
      if (turn.cancelled) return;
      emit({ type, text: `${word} ` });
      await pause(35);
    }
  };

  const userEvent = emit({ type: 'user_message', text });
  state.touchChatActivity(chat.id, userEvent.timestamp);
  state.setRuntime(chat.id, 'RUNNING', 'PROMPTING');
  await pause(200);

  const scenario = scenarioFor(text);

  if (scenario === 'error') {
    await stream('thought_chunk', 'Let me open the file the prompt names.');
    await pause(200);
    emit({
      type: 'error',
      message: 'Agent process exited with code 1: failed to spawn `claude-agent-acp`',
    });
    emit({ type: 'turn_complete', stop_reason: 'error' });
    return;
  }

  if (scenario === 'quiet') {
    await stream('message_chunk', 'Done.');
    emit({ type: 'turn_complete', stop_reason: 'end_turn' });
    return;
  }

  if (scenario === 'plan-approve') {
    const steps = [
      { content: 'Inspect existing codebase architecture', status: 'completed' },
      { content: 'Implement plan approval dialog & markdown rendering', status: 'in_progress' },
      { content: 'Verify with integration tests', status: 'pending' },
    ];
    emit({ type: 'plan', entries: steps });
    await pause(300);

    const requestId = randomUUID();
    turn.permissionId = requestId;
    const answered = new Promise((resolve) => {
      turn.resolvePermission = resolve;
    });

    state.emit(chat.id, chat.agent, {
      type: 'permission_request',
      id: requestId,
      method: 'session/request_permission',
      title: 'Approve Plan',
      kind: 'switch_mode',
      description: '### Proposed Implementation Plan\n\n1. **Inspect Codebase**: Check backend ACP handlers and session timeouts.\n2. **Frontend Updates**: Render plans with rich markdown and provide dedicated approve/reject actions.\n3. **Validation**: Run end-to-end and unit test suites.',
    });

    const granted = await answered;
    turn.permissionId = null;
    turn.resolvePermission = null;

    state.emit(chat.id, chat.agent, {
      type: 'permission_response',
      id: requestId,
      granted,
    });
    await pause(200);

    if (!granted) {
      await stream('message_chunk', 'Plan was rejected. Please provide feedback on what to change.');
      emit({ type: 'turn_complete', stop_reason: 'refusal' });
      return;
    }
    await stream('message_chunk', 'Plan approved! Starting implementation now.');
    emit({ type: 'turn_complete', stop_reason: 'end_turn' });
    return;
  }

  if (scenario !== 'tools') {
    await stream(
      'thought_chunk',
      'The user wants a change in the web layer. I read the router first, then the handler that owns the route.',
    );
    if (turn.cancelled) return finishCancelled(emit);
    await pause(250);
  }

  if (scenario === 'full' || scenario === 'plan' || scenario === 'long') {
    const steps = [
      { content: 'Read the router and the handlers', status: 'in_progress' },
      { content: 'Add the new route', status: 'pending' },
      { content: 'Write an integration test', status: 'pending' },
    ];
    emit({ type: 'plan', entries: steps });
    await pause(400);

    // A plan event replaces the plan, so progress shows in place.
    steps[0].status = 'completed';
    steps[1].status = 'in_progress';
    if (turn.cancelled) return finishCancelled(emit);
    emit({ type: 'plan', entries: steps.map((step) => ({ ...step })) });
    await pause(400);
  }

  if (scenario !== 'plan') {
    const reads = [
      { title: 'Read backend/src/web/mod.rs', kind: 'read', output: '203 lines. The router lists every route.' },
      { title: 'Grep "api/chats" backend/src/', kind: 'search', output: '7 matches in backend/src/web/hub.rs' },
    ];
    for (const read of reads) {
      if (turn.cancelled) return finishCancelled(emit);
      const toolId = randomUUID();
      emit({ type: 'tool_call', id: toolId, title: read.title, kind: read.kind, status: 'in_progress' });
      await pause(500);
      emit({
        type: 'tool_call_update',
        id: toolId,
        title: read.title,
        kind: read.kind,
        status: 'completed',
        output: read.output,
      });
      await pause(150);
    }
  }

  if (scenario === 'permission' || scenario === 'full' || scenario === 'long') {
    if (turn.cancelled) return finishCancelled(emit);
    const granted = await requestPermission(state, chat, turn, pause);
    if (turn.cancelled) return finishCancelled(emit);

    if (!granted) {
      await stream('message_chunk', 'I stopped, because the edit was denied.');
      emit({ type: 'turn_complete', stop_reason: 'refusal' });
      return;
    }

    const toolId = randomUUID();
    emit({ type: 'tool_call', id: toolId, title: 'Edit backend/src/web/hub.rs', kind: 'edit', status: 'in_progress' });
    await pause(600);
    emit({
      type: 'tool_call_update',
      id: toolId,
      title: 'Edit backend/src/web/hub.rs',
      kind: 'edit',
      status: 'completed',
      output: '+18 -2',
    });
    await pause(150);
  }

  if (turn.cancelled) return finishCancelled(emit);

  const answer =
    scenario === 'long'
      ? LONG_ANSWER
      : 'I added the route and its handler.\n\n### Summary of Changes\n- The handler validates the path against configured project roots.\n- Integration tests cover the rejected case.\n- Stored procedures and schema migrations updated.';
  await stream('message_chunk', answer);

  if (turn.cancelled) return finishCancelled(emit);

  // A real agent renames the chat after the first turn.
  state.updateGeneratedTitle(chat, titleFor(text));

  emit({ type: 'turn_complete', stop_reason: 'end_turn' });
}

/** Emits a request and waits for the browser, or for the chat policy. */
async function requestPermission(state, chat, turn, pause) {
  // The policy of the chat can answer without the browser, like the real
  // callback layer in `backend/src/acp/callbacks.rs`.
  if (chat.permission_policy === 'auto-approve') return true;
  if (chat.permission_policy === 'deny-all') return false;
  if (chat.permission_policy === 'read-only') return false;

  const requestId = randomUUID();
  turn.permissionId = requestId;

  const answered = new Promise((resolve) => {
    turn.resolvePermission = resolve;
  });

  state.emit(chat.id, chat.agent, {
    type: 'permission_request',
    id: requestId,
    method: 'fs/write_text_file',
    title: 'Write backend/src/web/hub.rs',
    kind: 'edit',
    description: 'Write backend/src/web/hub.rs',
  });


  const granted = await answered;
  turn.permissionId = null;
  turn.resolvePermission = null;

  state.emit(chat.id, chat.agent, {
    type: 'permission_response',
    id: requestId,
    granted,
  });
  await pause(200);
  return granted;
}

function finishCancelled(emit) {
  emit({ type: 'turn_complete', stop_reason: 'cancelled' });
}

/** Builds a chat title the way an agent does after the first turn. */
function titleFor(text) {
  const clean = text.trim().replace(/\s+/g, ' ');
  const short = clean.length > 48 ? `${clean.slice(0, 48)}…` : clean;
  return short.charAt(0).toUpperCase() + short.slice(1);
}

const LONG_ANSWER = [
  'The router now owns the new route, and the handler validates its input before it touches the store.',
  'I kept the validation in one place, because the clone endpoint and the create endpoint need the same rule.',
  'The path is canonicalized first, so a symlink cannot escape a configured project root.',
  'A rejected path returns 400 with the reason in the body, which the frontend shows in the dialog.',
  'The integration test drives the router through `oneshot`, so it needs no running server.',
  'I also removed the duplicated error mapping, which the two handlers had each written out.',
].join(' ');
