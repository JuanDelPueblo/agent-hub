import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { EventReducer } from '../src/state/event-reducer.ts';
import type { SessionEvent } from '../src/api/types.ts';

describe('EventReducer', () => {
  it('ingests user message and creates user_message display item', () => {
    const reducer = new EventReducer();
    const event: SessionEvent = {
      seq: 1,
      session_id: 's1',
      agent: 'codex',
      timestamp: '2026-09-12T12:00:00Z',
      payload: {
        type: 'user_message',
        text: 'Hello agent!',
      },
    };

    reducer.ingest(event);
    assert.equal(reducer.items.length, 1);
    const item = reducer.items[0];
    assert.equal(item.type, 'user_message');
    if (item.type === 'user_message') {
      assert.equal(item.text, 'Hello agent!');
      assert.equal(item.timestamp, '2026-09-12T12:00:00Z');
    }
  });

  it('accumulates message chunks into active turn', () => {
    const reducer = new EventReducer();
    reducer.ingest({
      seq: 1,
      session_id: 's1',
      agent: 'codex',
      timestamp: '2026-09-12T12:00:00Z',
      payload: { type: 'message_chunk', text: 'Hello ' },
    });
    reducer.ingest({
      seq: 2,
      session_id: 's1',
      agent: 'codex',
      timestamp: '2026-09-12T12:00:01Z',
      payload: { type: 'message_chunk', text: 'world!' },
    });

    assert.equal(reducer.items.length, 1);
    const turn = reducer.items[0];
    assert.equal(turn.type, 'turn');
    if (turn.type === 'turn') {
      assert.equal(turn.entries.length, 1);
      assert.equal(turn.entries[0].type, 'message_chunk');
      if (turn.entries[0].type === 'message_chunk') {
        assert.equal(turn.entries[0].text, 'Hello world!');
      }
    }
  });

  it('handles tool calls and tool call updates', () => {
    const reducer = new EventReducer();
    reducer.ingest({
      seq: 1,
      session_id: 's1',
      agent: 'claude',
      timestamp: '2026-09-12T12:00:00Z',
      payload: {
        type: 'tool_call',
        toolCallId: 'tc-1',
        title: 'Running bash command',
        status: 'running',
      },
    });

    reducer.ingest({
      seq: 2,
      session_id: 's1',
      agent: 'claude',
      timestamp: '2026-09-12T12:00:02Z',
      payload: {
        type: 'tool_call_update',
        toolCallId: 'tc-1',
        status: 'completed',
        output: 'exit status 0\nsuccess',
      },
    });

    assert.equal(reducer.items.length, 1);
    const turn = reducer.items[0];
    if (turn.type === 'turn') {
      assert.equal(turn.entries.length, 1);
      const entry = turn.entries[0];
      assert.equal(entry.type, 'tool_call');
      if (entry.type === 'tool_call') {
        assert.equal(entry.status, 'completed');
        assert.equal(entry.output, 'exit status 0\nsuccess');
      }
    }
  });

  it('handles thought chunks and turn completion', () => {
    const reducer = new EventReducer();
    reducer.ingest({
      seq: 1,
      session_id: 's1',
      agent: 'opencode',
      timestamp: '2026-09-12T12:00:00Z',
      payload: { type: 'thought_chunk', text: 'Analyzing repository...' },
    });
    reducer.ingest({
      seq: 2,
      session_id: 's1',
      agent: 'opencode',
      timestamp: '2026-09-12T12:00:01Z',
      payload: { type: 'message_chunk', text: 'Done analyzing.' },
    });
    reducer.ingest({
      seq: 3,
      session_id: 's1',
      agent: 'opencode',
      timestamp: '2026-09-12T12:00:02Z',
      payload: { type: 'turn_complete', stopReason: 'end_turn' },
    });

    assert.equal(reducer.items.length, 1);
    const turn = reducer.items[0];
    if (turn.type === 'turn') {
      assert.equal(turn.status, 'complete');
      assert.equal(turn.stopReason, 'end_turn');
      assert.equal(turn.entries.length, 2);
      assert.equal(turn.entries[0].type, 'thought_chunk');
      assert.equal(turn.entries[1].type, 'message_chunk');
    }
  });

  it('handles permission requests and plan updates', () => {
    const reducer = new EventReducer();
    reducer.ingest({
      seq: 1,
      session_id: 's1',
      agent: 'antigravity',
      timestamp: '2026-09-12T12:00:00Z',
      payload: {
        type: 'plan',
        entries: [
          { content: 'Step 1', status: 'completed' },
          { content: 'Step 2', status: 'in_progress' },
        ],
      },
    });

    reducer.ingest({
      seq: 2,
      session_id: 's1',
      agent: 'antigravity',
      timestamp: '2026-09-12T12:00:01Z',
      payload: {
        type: 'permission_request',
        requestId: 'req-1',
        toolCall: { title: 'git push' },
        options: [{ optionId: 'opt-allow', name: 'Allow', kind: 'allow_once' }],
      },
    });

    assert.equal(reducer.items.length, 1);
    const turn = reducer.items[0];
    if (turn.type === 'turn') {
      assert.equal(turn.entries.length, 2);
      assert.equal(turn.entries[0].type, 'plan');
      assert.equal(turn.entries[1].type, 'permission_request');
    }
  });

  it('deduplicates events with identical seq', () => {
    const reducer = new EventReducer();
    reducer.ingest({
      seq: 1,
      session_id: 's1',
      agent: 'codex',
      timestamp: '2026-09-12T12:00:00Z',
      payload: { type: 'user_message', text: 'Ping' },
    });
    reducer.ingest({
      seq: 1,
      session_id: 's1',
      agent: 'codex',
      timestamp: '2026-09-12T12:00:00Z',
      payload: { type: 'user_message', text: 'Ping duplicate' },
    });

    assert.equal(reducer.items.length, 1);
    const item = reducer.items[0];
    if (item.type === 'user_message') {
      assert.equal(item.text, 'Ping');
    }
  });
});
