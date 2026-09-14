import { describe, expect, it } from 'vitest';
import type { DisplayItem } from '../core/api/types';
import { EventReducer } from './event-reducer';
import {
  chatActivityLabel,
  deriveChatActivity,
  formatElapsed,
} from './chat-activity';

function ingestAll(reducer: EventReducer, types: Array<{ type: string; extra?: Record<string, unknown> }>): void {
  let seq = 1;
  for (const entry of types) {
    reducer.ingest({
      seq: seq++,
      session_id: 'chat-1',
      agent: 'codex',
      timestamp: '2026-09-13T12:00:00Z',
      payload: { type: entry.type, ...(entry.extra ?? {}) },
    } as never);
  }
}

function itemsFor(events: Array<{ type: string; extra?: Record<string, unknown> }>): DisplayItem[] {
  const reducer = new EventReducer();
  ingestAll(reducer, events);
  return reducer.items();
}

describe('deriveChatActivity', () => {
  it('reports Idle for an ordinary completed chat', () => {
    const items = itemsFor([
      { type: 'user_message', extra: { text: 'Hello' } },
      { type: 'message_chunk', extra: { text: 'Hi there' } },
      { type: 'turn_complete', extra: { stop_reason: 'end_turn' } },
    ]);
    expect(deriveChatActivity({ turnState: 'IDLE', items })).toBe('idle');
    expect(chatActivityLabel('idle')).toBe('Idle');
  });

  it('reports Working while PROMPTING and while CANCELLING', () => {
    expect(deriveChatActivity({ turnState: 'PROMPTING', items: [] })).toBe('working');
    expect(deriveChatActivity({ turnState: 'CANCELLING', items: [] })).toBe('working');
    expect(chatActivityLabel('working')).toBe('Working…');
    expect(chatActivityLabel('working', '2026-09-13T11:58:36Z', Date.parse('2026-09-13T12:00:00Z')))
      .toBe('Working… 1m 24s');
    expect(formatElapsed(3_661_000)).toBe('1h 1m 1s');
  });

  it('prefers Waiting for you over Working for an unresolved permission', () => {
    const items = itemsFor([
      { type: 'user_message', extra: { text: 'Edit the file' } },
      { type: 'permission_request', extra: { id: 'permission-1', method: 'fs/write_text_file', description: 'Write file' } },
    ]);
    expect(deriveChatActivity({ turnState: 'PROMPTING', items })).toBe('waiting');
    expect(chatActivityLabel('waiting')).toBe('Waiting for you');
  });

  it('returns to Working after the permission is answered while the turn continues', () => {
    const items = itemsFor([
      { type: 'user_message', extra: { text: 'Edit the file' } },
      { type: 'permission_request', extra: { id: 'permission-1', method: 'fs/write_text_file', description: 'Write file' } },
      { type: 'permission_response', extra: { id: 'permission-1', granted: true } },
    ]);
    expect(deriveChatActivity({ turnState: 'PROMPTING', items })).toBe('working');
  });

  it('reports Error for a current connection/config failure', () => {
    expect(
      deriveChatActivity({ turnState: 'IDLE', connectError: 'Failed to connect to agent', items: [] }),
    ).toBe('error');
    expect(
      deriveChatActivity({ turnState: 'PROMPTING', connectError: 'Failed to connect', items: [] }),
    ).toBe('error');
    expect(
      deriveChatActivity({ turnState: 'IDLE', rejectedConfig: 'model', items: [] }),
    ).toBe('error');
    expect(chatActivityLabel('error')).toBe('Error');
  });

  it('reports Error when the latest turn ends in an error', () => {
    const withErrorItem = itemsFor([
      { type: 'user_message', extra: { text: 'Do it' } },
      { type: 'thought_chunk', extra: { text: 'Trying' } },
      { type: 'error', extra: { message: 'Agent process exited with code 1' } },
      { type: 'turn_complete', extra: { stop_reason: 'error' } },
    ]);
    expect(deriveChatActivity({ turnState: 'IDLE', items: withErrorItem })).toBe('error');

    const turnOnly = itemsFor([
      { type: 'user_message', extra: { text: 'Do it' } },
      { type: 'message_chunk', extra: { text: 'Partial' } },
      { type: 'turn_complete', extra: { stop_reason: 'error' } },
    ]);
    expect(deriveChatActivity({ turnState: 'IDLE', items: turnOnly })).toBe('error');
  });

  it('clears a stale transcript error when a later turn starts or succeeds', () => {
    const reducer = new EventReducer();
    ingestAll(reducer, [
      { type: 'user_message', extra: { text: 'Break it' } },
      { type: 'thought_chunk', extra: { text: 'Trying' } },
      { type: 'error', extra: { message: 'boom' } },
      { type: 'turn_complete', extra: { stop_reason: 'error' } },
    ]);
    expect(deriveChatActivity({ turnState: 'IDLE', items: reducer.items() })).toBe('error');

    reducer.ingest({
      seq: 99,
      session_id: 'chat-1',
      agent: 'codex',
      timestamp: '2026-09-13T12:01:00Z',
      payload: { type: 'user_message', text: 'Try again' },
    } as never);
    expect(deriveChatActivity({ turnState: 'PROMPTING', items: reducer.items() })).toBe('working');

    reducer.ingest({
      seq: 100,
      session_id: 'chat-1',
      agent: 'codex',
      timestamp: '2026-09-13T12:01:01Z',
      payload: { type: 'message_chunk', text: 'Fixed it' },
    } as never);
    reducer.ingest({
      seq: 101,
      session_id: 'chat-1',
      agent: 'codex',
      timestamp: '2026-09-13T12:01:02Z',
      payload: { type: 'turn_complete', stop_reason: 'end_turn' },
    } as never);
    expect(deriveChatActivity({ turnState: 'IDLE', items: reducer.items() })).toBe('idle');
  });

  it('ignores STARTING/RUNNING/STOPPED/DEAD alone', () => {
    for (const turnState of ['IDLE', 'PROMPTING', 'CANCELLING'] as const) {
      const expected = turnState === 'IDLE' ? 'idle' : 'working';
      expect(deriveChatActivity({ turnState, items: [] })).toBe(expected);
    }
    expect(deriveChatActivity({ turnState: 'IDLE', items: [] })).toBe('idle');
  });

  it('does not treat historical errors as current once a new turn succeeds', () => {
    const items = itemsFor([
      { type: 'error', extra: { message: 'old failure' } },
      { type: 'turn_complete', extra: { stop_reason: 'error' } },
      { type: 'user_message', extra: { text: 'Next question' } },
      { type: 'message_chunk', extra: { text: 'Answer' } },
      { type: 'turn_complete', extra: { stop_reason: 'end_turn' } },
    ]);
    expect(deriveChatActivity({ turnState: 'IDLE', items })).toBe('idle');
  });
});
