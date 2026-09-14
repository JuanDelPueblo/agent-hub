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

  it('provides Git and non-Git workspace options and retains selections', () => {
    const state = new FakeState();
    const gitProject = [...state.projects.values()].find((project) => project.name === 'agent-hub');
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

  it('seeds representative managed and direct workspace summaries without paths', () => {
    const state = new FakeState();
    const gitProject = [...state.projects.values()].find((project) => project.name === 'agent-hub');
    const chats = state.listChats(gitProject.id);
    const managed = chats.find((chat) => chat.workspace?.mode === 'managed_worktree');
    const direct = chats.find((chat) => chat.workspace?.mode === 'project_checkout');
    assert.ok(managed?.workspace?.branch?.startsWith(`agent-hub/chat/${managed.id}`));
    assert.equal(direct?.workspace?.branch, 'feature/ui');
    for (const chat of [managed, direct]) {
      assert.ok(chat);
      assert.equal('workspace_path' in chat.workspace, false);
      assert.equal('repository_root' in chat.workspace, false);
    }
  });
});
