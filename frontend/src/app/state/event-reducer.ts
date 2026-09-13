import type {
  DisplayError,
  DisplayItem,
  DisplayStateChange,
  DisplayTurn,
  DisplayUserMessage,
  SessionEvent,
  TurnEntry,
  TurnEntryTool,
} from '../core/api/types';

export class EventReducer {
  private nextId = 1;
  private readonly seenSeqs = new Set<number>();
  readonly items: DisplayItem[] = [];
  currentTurn: DisplayTurn | null = null;

  constructor(initialEvents: SessionEvent[] = []) {
    for (const event of initialEvents) this.ingest(event);
  }

  ingest(event: SessionEvent): DisplayItem | null {
    if (typeof event.seq === 'number') {
      if (this.seenSeqs.has(event.seq)) return null;
      this.seenSeqs.add(event.seq);
    }

    const payload = event.payload;
    if (!payload) return null;

    if (this.isTurnScoped(payload.type)) {
      const turn = this.ensureCurrentTurn(event);
      this.mergeTurnEvent(turn, event);
      if (payload.type === 'turn_complete') {
        turn.status = 'complete';
        turn.completedAt = event.timestamp;
        turn.stopReason = this.stringValue(payload.stop_reason ?? payload.stopReason) ?? null;
        this.currentTurn = null;
      }
      return turn;
    }

    if (payload.type === 'user_message') {
      if (this.currentTurn) {
        this.currentTurn.status = 'complete';
        this.currentTurn = null;
      }
      const item: DisplayUserMessage = {
        id: this.nextId++,
        type: 'user_message',
        text: this.stringValue(payload.text) ?? '',
        timestamp: event.timestamp,
      };
      this.items.push(item);
      return item;
    }

    if (payload.type === 'error') {
      const item: DisplayError = {
        id: this.nextId++,
        type: 'error',
        message: this.stringValue(payload.message) ?? 'Unknown error',
        timestamp: event.timestamp,
      };
      this.items.push(item);
      return item;
    }

    if (payload.type === 'state_change') {
      if (!this.shouldDisplayStateChange(payload)) return null;
      const item: DisplayStateChange = {
        id: this.nextId++,
        type: 'state_change',
        process: this.stringValue(payload.process) ?? '',
        turn: this.stringValue(payload.turn) ?? '',
        timestamp: event.timestamp,
      };
      this.items.push(item);
      return item;
    }

    return null;
  }

  private isTurnScoped(type: string): boolean {
    return [
      'message_chunk',
      'thought_chunk',
      'tool_call',
      'tool_call_update',
      'plan',
      'permission_request',
      'permission_response',
      'turn_complete',
    ].includes(type);
  }

  private shouldDisplayStateChange(payload: Record<string, unknown>): boolean {
    return (
      ['DEAD', 'STARTING', 'STOPPED'].includes(this.stringValue(payload['process']) ?? '') ||
      this.stringValue(payload['turn']) === 'CANCELLING'
    );
  }

  private ensureCurrentTurn(event: SessionEvent): DisplayTurn {
    if (this.currentTurn) return this.currentTurn;
    const turn: DisplayTurn = {
      id: this.nextId++,
      type: 'turn',
      agent: event.agent || 'Agent',
      timestamp: event.timestamp,
      completedAt: null,
      status: 'in_progress',
      stopReason: null,
      entries: [],
    };
    this.items.push(turn);
    this.currentTurn = turn;
    return turn;
  }

  private mergeTurnEvent(turn: DisplayTurn, event: SessionEvent): void {
    const payload = event.payload;
    const last = turn.entries[turn.entries.length - 1];

    if (payload.type === 'message_chunk' || payload.type === 'thought_chunk') {
      const text = this.stringValue(payload.text) ?? '';
      if (last && last.type === payload.type) {
        last.text += text;
      } else {
        turn.entries.push({
          id: this.nextId++,
          type: payload.type,
          text,
        });
      }
      return;
    }

    if (payload.type === 'tool_call') {
      const toolId =
        this.stringValue(payload.id ?? payload.toolCallId ?? payload.tool_call_id) ??
        String(this.nextId);
      turn.entries.push({
        id: this.nextId++,
        type: 'tool_call',
        toolCallId: toolId,
        title: this.stringValue(payload.title) ?? 'Tool Call',
        status: this.stringValue(payload.status) ?? 'in_progress',
        output: null,
      });
      return;
    }

    if (payload.type === 'tool_call_update') {
      const toolId =
        this.stringValue(payload.id ?? payload.toolCallId ?? payload.tool_call_id) ?? '';
      const tool = this.findToolCall(turn, toolId);
      if (tool) {
        const status = this.stringValue(payload.status);
        if (status) tool.status = status;
        if (payload.output !== undefined && payload.output !== null) {
          tool.output = (tool.output || '') + String(payload.output);
        }
      } else {
        turn.entries.push({
          id: this.nextId++,
          type: 'tool_call',
          toolCallId: toolId,
          title: this.stringValue(payload.title) ?? 'Tool Call',
          status: this.stringValue(payload.status) ?? 'in_progress',
          output: payload.output == null ? null : String(payload.output),
        });
      }
      return;
    }

    if (payload.type === 'plan') {
      const entries = Array.isArray(payload.entries) ? payload.entries : [];
      const planEntries = entries as Array<{ content: string; status: string }>;
      const lastEntry = turn.entries[turn.entries.length - 1];
      if (lastEntry?.type === 'plan') {
        lastEntry.entries = planEntries;
      } else {
        turn.entries.push({ id: this.nextId++, type: 'plan', entries: planEntries });
      }
      return;
    }

    if (payload.type === 'permission_request') {
      turn.entries.push({
        id: this.nextId++,
        type: 'permission_request',
        requestId: this.stringValue(payload.id) ?? '',
        method: this.stringValue(payload.method) ?? '',
        description: this.stringValue(payload.description) ?? '',
        responded: false,
      });
      return;
    }

    if (payload.type === 'permission_response') {
      const permissionId = this.stringValue(payload.id);
      const markEntry = (entries: TurnEntry[]): boolean => {
        for (const entry of entries) {
          if (
            entry.type === 'permission_request' &&
            (!permissionId || entry.requestId === permissionId)
          ) {
            entry.responded = true;
            entry.decision = payload.granted ? 'Allowed' : 'Denied';
            return true;
          }
        }
        return false;
      };

      if (markEntry(turn.entries)) return;
      for (const item of this.items) {
        if (item.type === 'turn' && markEntry(item.entries)) return;
      }
    }
  }

  private findToolCall(turn: DisplayTurn, id: string): TurnEntryTool | undefined {
    return turn.entries
      .slice()
      .reverse()
      .find((entry): entry is TurnEntryTool => entry.type === 'tool_call' && entry.toolCallId === id);
  }

  private stringValue(value: unknown): string | undefined {
    return typeof value === 'string' ? value : value == null ? undefined : String(value);
  }
}
