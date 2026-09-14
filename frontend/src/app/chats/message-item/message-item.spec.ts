import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import type { SessionEvent } from '../../core/api/types';
import { EventReducer } from '../../state/event-reducer';
import { EventStreamComponent } from '../event-stream/event-stream';
import { MessageItemComponent } from './message-item';

describe('MessageItemComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageItemComponent, EventStreamComponent],
    }).compileComponents();
  });

  it('uses the expandable thought process panel', () => {
    const message = TestBed.createComponent(MessageItemComponent);
    message.componentRef.setInput('item', {
      id: 1,
      type: 'turn',
      agent: 'antigravity',
      timestamp: '2026-09-13T12:00:00Z',
      completedAt: null,
      status: 'complete',
      stopReason: null,
      entries: [{ id: 2, type: 'thought_chunk', text: 'Inspecting the repository' }],
    });
    message.detectChanges();

    const thought = message.nativeElement.querySelector('.thought') as HTMLElement;
    expect(thought.querySelector('mat-expansion-panel-header')).not.toBeNull();
    expect(thought.querySelector('mat-panel-title mat-icon')?.textContent?.trim()).toBe('psychology');
    expect(thought.querySelector('mat-panel-title')?.textContent).toContain('Thought process');

    (thought.querySelector('mat-expansion-panel-header') as HTMLElement).click();
    message.detectChanges();
    expect(thought.classList.contains('mat-expanded')).toBe(true);
  });

  it('hides ACP process lifecycle events from the transcript', () => {
    const reducer = new EventReducer();
    const event = (seq: number, process: string, turn: string): SessionEvent => ({
      seq,
      session_id: 'chat-1',
      agent: 'codex',
      timestamp: '2026-09-13T12:00:00Z',
      payload: { type: 'state_change', process, turn },
    });

    for (const [index, process] of ['STARTING', 'RUNNING', 'STOPPED', 'DEAD'].entries()) {
      expect(reducer.ingest(event(index + 1, process, 'IDLE'))).toBeNull();
    }
    expect(reducer.ingest(event(5, 'RUNNING', 'PROMPTING'))).toBeNull();
    expect(reducer.ingest(event(6, 'RUNNING', 'CANCELLING'))).toBeNull();
    expect(reducer.items()).toHaveLength(0);

    const stream = TestBed.createComponent(EventStreamComponent);
    stream.componentRef.setInput('items', reducer.items());
    stream.componentRef.setInput('chatId', 'chat-1');
    stream.detectChanges();

    const text = stream.nativeElement.textContent as string;
    expect(text).not.toContain('Process:');
    expect(text).not.toContain('Process: STARTING');
    expect(text).not.toContain('Process: STOPPED');
    expect(text).not.toContain('Process: DEAD');
  });
});
