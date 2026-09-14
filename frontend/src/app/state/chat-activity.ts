import type { DisplayItem, DisplayTurn, TurnState } from '../core/api/types';

/** User-facing chat activity. Product/UI state only, never process lifecycle. */
export type ChatActivity = 'idle' | 'working' | 'waiting' | 'error';

export const CHAT_ACTIVITY_LABELS: Record<ChatActivity, string> = {
  idle: 'Idle',
  working: 'Working…',
  waiting: 'Waiting for you',
  error: 'Error',
};

export function chatActivityLabel(activity: ChatActivity): string {
  return CHAT_ACTIVITY_LABELS[activity];
}

export interface ChatActivityInput {
  turnState?: TurnState | null;
  connectError?: string | null;
  rejectedConfig?: string | null;
  items?: readonly DisplayItem[] | null;
}

/**
 * Derives the user-facing activity for one chat.
 * Precedence: waiting > error > working > idle.
 * process_state is never read here by design.
 */
export function deriveChatActivity(input: ChatActivityInput): ChatActivity {
  const items = input.items ?? [];
  if (hasUnresolvedPermission(items)) return 'waiting';
  if (input.connectError || input.rejectedConfig) return 'error';
  if (hasTranscriptError(items, input.turnState)) return 'error';
  if (input.turnState === 'PROMPTING' || input.turnState === 'CANCELLING') return 'working';
  return 'idle';
}

/** True when the latest turn is in progress and holds an unanswered request. */
export function hasUnresolvedPermission(items: readonly DisplayItem[]): boolean {
  for (let index = items.length - 1; index >= 0; index -= 1) {
    const item = items[index];
    if (item.type !== 'turn') continue;
    const turn = item as DisplayTurn;
    if (turn.status !== 'in_progress') return false;
    return turn.entries.some(
      (entry) => entry.type === 'permission_request' && !entry.responded,
    );
  }
  return false;
}

/**
 * True when the most recent conversation outcome is an error.
 * A later user message or turn clears a stale error.
 */
export function hasTranscriptError(
  items: readonly DisplayItem[],
  turnState?: TurnState | null,
): boolean {
  if (items.length === 0) return false;
  const lastTurnIndex = findLastIndex(items, (item) => item.type === 'turn');
  const lastErrorIndex = findLastIndex(items, (item) => item.type === 'error');
  const lastTurn =
    lastTurnIndex >= 0 ? (items[lastTurnIndex] as DisplayTurn) : null;
  const turnActive = turnState === 'PROMPTING' || turnState === 'CANCELLING';

  if (lastTurn && lastTurn.status === 'in_progress') {
    return lastErrorIndex > lastTurnIndex;
  }

  if (turnActive) {
    return false;
  }

  const last = items[items.length - 1];
  if (last.type === 'error') return true;
  if (last.type === 'turn') {
    const turn = last as DisplayTurn;
    return turn.status === 'complete' && isErrorStopReason(turn.stopReason);
  }
  return false;
}

export function isErrorStopReason(stopReason: string | null | undefined): boolean {
  if (!stopReason) return false;
  const lower = stopReason.toLowerCase();
  return lower === 'error' || lower === 'timeout' || lower.includes('error') || lower.includes('fail');
}

function findLastIndex(
  items: readonly DisplayItem[],
  matches: (item: DisplayItem) => boolean,
): number {
  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (matches(items[index])) return index;
  }
  return -1;
}
