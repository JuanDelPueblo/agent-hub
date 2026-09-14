import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { FakeState } from './state.mjs';

function historyFor(state, chatId) {
  return state.events.filter((event) => event.session_id === chatId);
}

function payloadTypes(history) {
  return history.map((event) => event.payload.type);
}

describe('fake backend seed history', () => {
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
});
