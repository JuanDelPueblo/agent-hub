import type {
  DisplayItem,
  DisplayTurn,
  DisplayUserMessage,
  DisplayError,
  DisplayStateChange,
  SessionEvent,
  TurnEntry,
  TurnEntryTool,
  TurnEntryPermission,
} from '../api/types';

export class EventReducer {
  private nextId = 1;
  private seenSeqs: Set<number> = new Set();
  public items: DisplayItem[] = [];
  public currentTurn: DisplayTurn | null = null;

  constructor(initialEvents: SessionEvent[] = []) {
    for (const ev of initialEvents) {
      this.ingest(ev);
    }
  }

  public ingest(ev: SessionEvent): DisplayItem | null {
    if (typeof ev.seq === 'number') {
      if (this.seenSeqs.has(ev.seq)) {
        return null;
      }
      this.seenSeqs.add(ev.seq);
    }

    const payload = ev.payload;
    if (!payload) return null;

    if (this.isTurnScoped(payload.type)) {
      const turn = this.ensureCurrentTurn(ev);
      this.mergeTurnEvent(turn, ev);
      if (payload.type === 'turn_complete') {
        turn.status = 'complete';
        turn.completedAt = ev.timestamp;
        turn.stopReason = payload.stop_reason || payload.stopReason || null;
        this.currentTurn = null;
      }
      return turn;
    }

    if (payload.type === 'user_message') {
      // If a turn was in progress when a new user message arrives, complete it
      if (this.currentTurn) {
        this.currentTurn.status = 'complete';
        this.currentTurn = null;
      }
      const item: DisplayUserMessage = {
        id: this.nextId++,
        type: 'user_message',
        text: payload.text || '',
        timestamp: ev.timestamp,
      };
      this.items.push(item);
      return item;
    }

    if (payload.type === 'error') {
      const item: DisplayError = {
        id: this.nextId++,
        type: 'error',
        message: payload.message || 'Unknown error',
        timestamp: ev.timestamp,
      };
      this.items.push(item);
      return item;
    }

    if (payload.type === 'state_change') {
      if (this.shouldDisplayStateChange(payload)) {
        const item: DisplayStateChange = {
          id: this.nextId++,
          type: 'state_change',
          process: payload.process,
          turn: payload.turn,
          timestamp: ev.timestamp,
        };
        this.items.push(item);
        return item;
      }
      return null;
    }

    return null;
  }

  private isTurnScoped(type: string): boolean {
    return (
      type === 'message_chunk' ||
      type === 'thought_chunk' ||
      type === 'tool_call' ||
      type === 'tool_call_update' ||
      type === 'plan' ||
      type === 'permission_request' ||
      type === 'permission_response' ||
      type === 'turn_complete'
    );
  }

  private shouldDisplayStateChange(payload: any): boolean {
    if (
      payload.process === 'DEAD' ||
      payload.process === 'STARTING' ||
      payload.process === 'STOPPED'
    ) {
      return true;
    }
    return payload.turn === 'CANCELLING';
  }

  private ensureCurrentTurn(ev: SessionEvent): DisplayTurn {
    if (this.currentTurn) {
      return this.currentTurn;
    }
    const turn: DisplayTurn = {
      id: this.nextId++,
      type: 'turn',
      agent: ev.agent || 'Agent',
      timestamp: ev.timestamp,
      completedAt: null,
      status: 'in_progress',
      stopReason: null,
      entries: [],
    };
    this.items.push(turn);
    this.currentTurn = turn;
    return turn;
  }

  private mergeTurnEvent(turn: DisplayTurn, ev: SessionEvent) {
    const p = ev.payload;
    const last = turn.entries[turn.entries.length - 1];

    if (p.type === 'message_chunk' || p.type === 'thought_chunk') {
      const text = p.text || '';
      if (last && last.type === p.type) {
        last.text += text;
      } else {
        turn.entries.push({
          id: this.nextId++,
          type: p.type,
          text,
        });
      }
      return;
    }

    if (p.type === 'tool_call') {
      const toolId =
        p.id || p.toolCallId || p.tool_call_id || String(this.nextId);
      turn.entries.push({
        id: this.nextId++,
        type: 'tool_call',
        toolCallId: toolId,
        title: p.title || 'Tool Call',
        status: p.status || 'in_progress',
        output: null,
      });
      return;
    }

    if (p.type === 'tool_call_update') {
      const toolId = p.id || p.toolCallId || p.tool_call_id || '';
      const tool = this.findToolCall(turn, toolId);
      if (tool) {
        if (p.status) tool.status = p.status;
        if (p.output !== undefined && p.output !== null) {
          tool.output = (tool.output || '') + p.output;
        }
      } else {
        turn.entries.push({
          id: this.nextId++,
          type: 'tool_call',
          toolCallId: toolId,
          title: p.title || 'Tool Call',
          status: p.status || 'in_progress',
          output: p.output || null,
        });
      }
      return;
    }

    if (p.type === 'plan') {
      const lastEntry = turn.entries[turn.entries.length - 1];
      if (lastEntry && lastEntry.type === 'plan') {
        lastEntry.entries = p.entries || [];
      } else {
        turn.entries.push({
          id: this.nextId++,
          type: 'plan',
          entries: p.entries || [],
        });
      }
      return;
    }

    if (p.type === 'permission_request') {
      turn.entries.push({
        id: this.nextId++,
        type: 'permission_request',
        requestId: p.id || '',
        method: p.method || '',
        description: p.description || '',
        responded: false,
      });
      return;
    }

    if (p.type === 'permission_response') {
      const permId = p.id;
      const markEntry = (entries: TurnEntry[]): boolean => {
        for (const entry of entries) {
          if (
            entry.type === 'permission_request' &&
            (!permId || entry.requestId === permId)
          ) {
            entry.responded = true;
            entry.decision = p.granted ? 'Allowed' : 'Denied';
            return true;
          }
        }
        return false;
      };

      if (turn && markEntry(turn.entries)) {
        return;
      }
      for (const item of this.items) {
        if (item.type === 'turn' && markEntry(item.entries)) {
          return;
        }
      }
      return;
    }
  }

  private findToolCall(turn: DisplayTurn, id: string): TurnEntryTool | undefined {
    return turn.entries
      .slice()
      .reverse()
      .find((e): e is TurnEntryTool => e.type === 'tool_call' && e.toolCallId === id);
  }
}
