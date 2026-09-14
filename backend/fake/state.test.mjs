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
});
