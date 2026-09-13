import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { MessageItemComponent } from './message-item';

describe('MessageItemComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageItemComponent],
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
});
