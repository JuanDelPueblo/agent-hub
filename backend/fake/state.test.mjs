import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { AGENTS, FakeState, validateCustomInput } from './state.mjs';

function historyFor(state, chatId) {
  return state.events.filter((event) => event.session_id === chatId);
}

function payloadTypes(history) {
  return history.map((event) => event.payload.type);
}

describe('fake backend seed history', () => {
  it('mirrors the extended agent summary contract', () => {
    for (const agent of AGENTS) {
      assert.ok(['editable', 'registry_managed', 'read_only'].includes(agent.mutability));
      assert.equal(typeof agent.display, 'object');
      if (agent.availability === 'unavailable') {
        assert.equal(typeof agent.unavailable_reason, 'string');
      } else {
        assert.equal('unavailable_reason' in agent, false);
      }
    }
  });

  it('reports structural custom-agent validation failures without mutation', () => {
    const report = validateCustomInput({ id: 'not valid', command: '' });
    assert.equal(report.valid, false);
    assert.deepEqual(report.issues.map((issue) => issue.field), ['id', 'command']);
  });
  it('seeds four chats, each with a completed conversation', () => {
    const state = new FakeState();
    const chats = [...state.chats.values()];

    assert.equal(chats.length, 4);

    const userTexts = new Set();
    for (const chat of chats) {
      const history = historyFor(state, chat.id);
      const types = payloadTypes(history);

      assert.ok(types.includes('user_message'), `chat "${chat.title}" has no user_message`);
      assert.ok(types.includes('message_chunk'), `chat "${chat.title}" has no message_chunk`);
      assert.ok(types.includes('turn_complete'), `chat "${chat.title}" has no turn_complete`);

      const userIndex = types.indexOf('user_message');
      const messageIndex = types.indexOf('message_chunk');
      const turnIndex = types.lastIndexOf('turn_complete');
      assert.ok(userIndex < messageIndex, `chat "${chat.title}" orders user_message before message_chunk`);
      assert.ok(messageIndex < turnIndex, `chat "${chat.title}" orders message_chunk before turn_complete`);

      for (const event of history) {
        assert.equal(event.session_id, chat.id);
        assert.equal(event.agent, chat.agent);
      }

      const firstUser = history.find((event) => event.payload.type === 'user_message');
      userTexts.add(firstUser.payload.text);
    }

    assert.equal(userTexts.size, chats.length, 'each seeded chat shows its own history');
  });

  it('replays the seeded history from seq 0 for a fresh page', () => {
    const state = new FakeState();
    const replayed = state.replayFrom(0);

    for (const chat of state.chats.values()) {
      const history = replayed.filter((event) => event.session_id === chat.id);
      const types = history.map((event) => event.payload.type);

      assert.ok(types.includes('user_message'), `replay misses user_message for "${chat.title}"`);
      assert.ok(types.includes('message_chunk'), `replay misses message_chunk for "${chat.title}"`);
      assert.ok(types.includes('turn_complete'), `replay misses turn_complete for "${chat.title}"`);
    }
  });

  it('returns bounded, chat-scoped pages with stable older cursors', () => {
    const state = new FakeState();
    const chat = [...state.chats.values()][0];
    const all = historyFor(state, chat.id);
    const first = state.historyPage(chat.id, undefined, 2);
    assert.equal(first.events.length, 2);
    assert.equal(first.has_older, true);
    assert.deepEqual(first.events.map((event) => event.seq), all.slice(-2).map((event) => event.seq));

    const older = state.historyPage(chat.id, first.next_cursor, 2);
    assert.ok(older.events.every((event) => event.session_id === chat.id));
    assert.ok(older.events.at(-1).seq < first.events[0].seq);

    const bounded = state.historyPage(chat.id, undefined, 10, all.at(-3).seq);
    assert.ok(bounded.events.every((event) => event.seq <= all.at(-3).seq));
    assert.equal(bounded.has_older, false);
  });

  it('keeps history for the archived seed chat and none for a new chat', () => {
    const state = new FakeState();
    const archived = [...state.chats.values()].find((chat) => chat.archived);
    assert.ok(archived, 'expected one archived seed chat');
    const archivedTypes = payloadTypes(historyFor(state, archived.id));
    assert.ok(archivedTypes.includes('user_message'));
    assert.ok(archivedTypes.includes('message_chunk'));
    assert.ok(archivedTypes.includes('turn_complete'));

    const projectId = [...state.projects.values()][0].id;
    const fresh = state.createChat(projectId, 'codex');
    assert.equal(historyFor(state, fresh.id).length, 0);
  });

  it('numbers default titles without reusing deleted numbers', () => {
    const state = new FakeState();
    const projectId = [...state.projects.values()][0].id;
    const first = state.createChat(projectId, 'codex');
    const second = state.createChat(projectId, 'codex');

    assert.equal(first.title, 'New chat 1');
    assert.equal(second.title, 'New chat 2');
    assert.equal(first.title_overridden, false);
    assert.equal(second.title_overridden, false);

    state.chats.delete(first.id);
    const third = state.createChat(projectId, 'codex');
    assert.equal(third.title, 'New chat 3');
    assert.equal(third.title_overridden, false);
  });

  it('lets generated titles update until a manual title wins', () => {
    const state = new FakeState();
    const projectId = [...state.projects.values()][0].id;
    const chat = state.createChat(projectId, 'codex');

    assert.equal(state.updateGeneratedTitle(chat, 'Generated title'), true);
    assert.equal(chat.title, 'Generated title');
    chat.title = 'Manual title';
    chat.title_overridden = true;
    assert.equal(state.updateGeneratedTitle(chat, 'Later generated title'), false);
    assert.equal(chat.title, 'Manual title');
  });

  it('provides Git and non-Git workspace options and retains selections', () => {
    const state = new FakeState();
    const gitProject = [...state.projects.values()].find((project) => project.name === 'pueblo-hub');
    const nonGitProject = [...state.projects.values()].find((project) => project.name === 'scratch');
    const options = state.workspaceOptions(gitProject.id);
    assert.equal(options.is_git, true);
    assert.equal(options.current_branch, 'master');
    assert.equal(options.dirty, true);
    assert.ok(options.branches.some((branch) => branch.name === 'feature/ui'));
    assert.equal(state.workspaceOptions(nonGitProject.id).is_git, false);

    const chat = state.createChat(gitProject.id, 'codex', undefined, {
      mode: 'project_checkout', branch: 'feature/ui',
    });
    assert.deepEqual(chat.workspace, {
      mode: 'project_checkout',
      branch: 'feature/ui',
      base_commit: '2222222222222222222222222222222222222222',
    });
  });

  it('sorts chat collections by activity newest first with a deterministic tie-breaker', () => {
    const state = new FakeState();
    const projectId = [...state.projects.values()][0].id;
    const older = state.createChat(projectId, 'codex', 'Older');
    const newer = state.createChat(projectId, 'codex', 'Newer');
    state.touchChatActivity(older.id, '2026-01-01T00:00:00.000Z');
    state.touchChatActivity(newer.id, '2026-02-01T00:00:00.000Z');
    assert.deepEqual(
      state.listChats(projectId).slice(-2).map((chat) => chat.id),
      [newer.id, older.id],
    );
  });

  it('records prompt activity at the durable user-message timestamp', () => {
    const state = new FakeState();
    const projectId = [...state.projects.values()][0].id;
    const chat = state.createChat(projectId, 'codex', 'Prompt activity');
    const event = state.emit(chat.id, chat.agent, { type: 'user_message', text: 'Hello' });
    state.touchChatActivity(chat.id, event.timestamp);
    assert.equal(chat.updated_at, event.timestamp);
  });

  it('derives an active turn start independently of the history page', () => {
    const state = new FakeState();
    const projectId = [...state.projects.values()][0].id;
    const chat = state.createChat(projectId, 'codex', 'Long turn');
    const user = state.emit(chat.id, chat.agent, { type: 'user_message', text: 'Working' });
    state.touchChatActivity(chat.id, user.timestamp);
    state.emit(chat.id, chat.agent, { type: 'message_chunk', text: 'Still working' });
    state.setRuntime(chat.id, 'RUNNING', 'PROMPTING');

    assert.equal(state.chatView(chat).turn_started_at, user.timestamp);

    state.emit(chat.id, chat.agent, { type: 'turn_complete', stop_reason: 'end_turn' });
    assert.equal(state.chatView(chat).turn_started_at, null);
  });

  it('seeds representative managed and direct workspace summaries without paths', () => {
    const state = new FakeState();
    const gitProject = [...state.projects.values()].find((project) => project.name === 'pueblo-hub');
    const chats = state.listChats(gitProject.id);
    const managed = chats.find((chat) => chat.workspace?.mode === 'managed_worktree');
    const direct = chats.find((chat) => chat.workspace?.mode === 'project_checkout');
    assert.ok(managed?.workspace?.branch?.startsWith(`pueblo-hub/chat/${managed.id}`));
    assert.equal(direct?.workspace?.branch, 'feature/ui');
    for (const chat of [managed, direct]) {
      assert.ok(chat);
      assert.equal('workspace_path' in chat.workspace, false);
      assert.equal('repository_root' in chat.workspace, false);
    }
  });
  it('tracks terminal tasks and reflects active count in chat view', () => {
    const state = new FakeState();
    const projectId = [...state.projects.values()][0].id;
    const chat = state.createChat(projectId, 'antigravity');

    assert.equal(state.chatView(chat).active_tasks, 0);
    assert.deepEqual(state.listTasks(chat.id), []);

    const task1 = state.createTask(chat.id, 'cargo test', '/home/dev/projects/agent-hub', 'running tests...');
    assert.equal(task1.state, 'running');
    assert.equal(state.chatView(chat).active_tasks, 1);

    const task2 = state.createTask(chat.id, 'npm run build', '/home/dev/projects/agent-hub/frontend');
    assert.equal(state.chatView(chat).active_tasks, 2);

    const tasks = state.listTasks(chat.id);
    assert.equal(tasks.length, 2);
    assert.equal('output' in tasks[0], false); // listTasks omits output

    const detail1 = state.getTask(chat.id, task1.id);
    assert.equal(detail1.output, 'running tests...');

    state.completeTask(chat.id, task1.id, 0, 'passed');
    assert.equal(state.getTask(chat.id, task1.id).state, 'completed');
    assert.equal(state.chatView(chat).active_tasks, 1);

    state.stopTask(chat.id, task2.id);
    assert.equal(state.getTask(chat.id, task2.id).state, 'stopped');
    assert.equal(state.chatView(chat).active_tasks, 0);
  });

  it('manages blocked direnv workspace state and authorization', () => {
    const state = new FakeState();
    const projectId = [...state.projects.values()][0].id;
    const chat = state.createChat(projectId, 'codex');

    assert.equal(state.isEnvironmentBlocked(chat.id), false);
    state.blockEnvironment(chat.id);
    assert.equal(state.isEnvironmentBlocked(chat.id), true);
    state.authorizeEnvironment(chat.id);
    assert.equal(state.isEnvironmentBlocked(chat.id), false);
  });

  it('derives registry installed state from the one agent catalog', () => {
    const state = new FakeState();
    const view = state.registryView();
    const installed = view.agents.find((entry) => entry.id === 'example-acp');
    assert.equal(installed.installed_as, 'example-acp');
    assert.equal(installed.installed_version, '1.0.0');
    assert.equal(installed.update_available, true);

    const unsupported = view.agents.find((entry) => entry.id === 'windows-only');
    assert.equal(typeof unsupported.unsupported_reason, 'string');
    assert.equal('installed_as' in unsupported, false);

    assert.deepEqual(state.registryView('native').agents.map((entry) => entry.id), ['native-agent']);
  });

  it('installs, updates, and uninstalls registry agents', () => {
    const state = new FakeState();
    const installed = state.installRegistryAgent({ registry_id: 'native-agent' });
    assert.equal(installed.source, 'registry');
    assert.equal(installed.display.version, '2.0.0');

    const outcome = state.updateRegistryAgent('example-acp');
    assert.equal(outcome.updated, true);
    assert.equal(outcome.to_version, '1.2.0');

    const removal = state.removeAgent('example-acp');
    assert.equal(removal.deleted, true);
    assert.equal(state.agent('example-acp'), undefined);

    state.removeAgent(installed.id);
    assert.equal(state.agent(installed.id), undefined);
  });

  it('exposes authenticated custom detail and edits a Pueblo-managed agent', () => {
    const state = new FakeState();
    const detail = state.agentDetail('my-custom');
    assert.equal(detail.command, 'my-agent');
    assert.deepEqual(detail.args, ['--acp']);
    assert.equal(detail.env.MY_AGENT_TOKEN, 'fake-token');

    const edited = state.editCustomAgent('my-custom', {
      id: 'my-custom', command: 'my-agent', args: [], env: {}, display_name: 'Renamed',
    });
    assert.equal(edited.display_name, 'Renamed');
    assert.equal(state.agentDetail('my-custom').display_name, 'Renamed');

    assert.throws(() => state.agentDetail('codex'), /not an editable/);
    assert.throws(() => state.removeAgent('codex'), /read-only/);
  });

  it('reports provider-neutral authentication state', () => {
    const state = new FakeState();
    const codex = state.agentAuth('codex');
    assert.equal(codex.agent_id, 'codex');
    assert.equal(codex.logout_supported, true);
    assert.equal(codex.terminal_supported, true);
    assert.equal(codex.methods.length, 2);
    assert.equal(codex.methods[0].id, 'openai-oauth');
    assert.equal(codex.methods[0].type, 'agent');
    assert.equal(codex.methods[0].supported, true);
    assert.equal(codex.methods[1].id, 'api-key');
    assert.equal(codex.methods[1].type, 'terminal');
    assert.equal(codex.methods[1].supported, true);

    const opencode = state.agentAuth('opencode');
    assert.equal(opencode.logout_supported, false);
    assert.equal(opencode.methods[1].type, 'device_code');
    assert.equal(opencode.methods[1].supported, false);

    const afterLogin = state.authenticateAgent('codex', 'openai-oauth');
    assert.equal(afterLogin.agent_id, 'codex');

    const afterLogout = state.logoutAgent('codex');
    assert.equal(afterLogout.agent_id, 'codex');

    assert.throws(() => state.authenticateAgent('codex', 'missing'), /Unknown authentication method/);
    assert.throws(() => state.authenticateAgent('opencode', 'device-code'), /unsupported/i);
    assert.throws(() => state.authenticateAgent('codex', 'api-key'), /terminal/i);
    assert.throws(() => state.logoutAgent('opencode'), /does not support logout/);
  });

  function attach(state, flowId) {
    const sent = [];
    const socket = {
      open: true,
      send: (text) => sent.push(JSON.parse(text)),
      close() { this.open = false; },
      onMessage: () => {},
      onClose: () => {},
    };
    state.attachFlowSocket(flowId, socket);
    return sent;
  }

  it('runs a terminal authentication flow over the flow socket', () => {
    const state = new FakeState();
    const flow = state.startTerminalFlow('codex', 'api-key');
    assert.equal(flow.state, 'running');
    assert.equal(flow.reason, null);

    const view = state.flowView(flow.flow_id);
    assert.equal(view.flow_id, flow.flow_id);
    assert.equal(view.agent_id, 'codex');
    assert.equal(view.method_id, 'api-key');
    assert.equal(view.state, 'running');
    assert.equal(view.method_name, undefined);

    const sent = attach(state, flow.flow_id);
    assert.equal(sent[0].type, 'output');
    assert.equal(sent[1].type, 'state');
    assert.equal(sent[1].state, 'running');

    state.flowResize(flow.flow_id, 120, 40);
    state.flowInput(flow.flow_id, 'secret-token');
    assert.ok(sent.some((message) => message.type === 'output' && message.data.includes('secret-token')));

    state.flowInput(flow.flow_id, '\r');
    const terminal = sent.at(-1);
    assert.equal(terminal.type, 'state');
    assert.equal(terminal.state, 'succeeded');
    assert.equal(terminal.exit_code, 0);
    assert.equal(state.flowView(flow.flow_id).state, 'succeeded');
  });

  it('supports failure, cancellation, and timeout terminal flows', () => {
    const state = new FakeState();
    const failing = state.startTerminalFlow('codex', 'api-key');
    const sent = attach(state, failing.flow_id);
    state.flowInput(failing.flow_id, 'fail\r');
    assert.equal(state.flowView(failing.flow_id).state, 'failed');
    assert.equal(state.flowView(failing.flow_id).reason, 'The authentication command failed.');
    assert.equal(sent.at(-1).state, 'failed');
    assert.equal(sent.at(-1).reason, 'The authentication command failed.');

    const timedOut = state.startTerminalFlow('codex', 'api-key');
    attach(state, timedOut.flow_id);
    state.flowInput(timedOut.flow_id, 'timeout\r');
    assert.equal(state.flowView(timedOut.flow_id).state, 'timed_out');
    assert.equal(state.flowView(timedOut.flow_id).reason, 'The authentication flow timed out.');

    const cancelled = state.startTerminalFlow('codex', 'api-key');
    attach(state, cancelled.flow_id);
    const view = state.cancelFlow(cancelled.flow_id);
    assert.equal(view.state, 'cancelled');
    assert.throws(() => state.cancelFlow('missing-flow'), /not found/);
  });

  it('rejects terminal flows for non-terminal methods', () => {
    const state = new FakeState();
    assert.throws(() => state.startTerminalFlow('codex', 'openai-oauth'), /not a terminal method/);
    assert.throws(() => state.startTerminalFlow('codex', 'missing'), /Unknown authentication method/);
  });
});
