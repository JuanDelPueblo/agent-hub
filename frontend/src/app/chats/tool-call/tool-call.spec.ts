import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { ToolCallComponent } from './tool-call';
import type { TurnEntryTool } from '../../core/api/types';

describe('ToolCallComponent', () => {
  let fixture: ComponentFixture<ToolCallComponent>;
  let component: ToolCallComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolCallComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ToolCallComponent);
    component = fixture.componentInstance;
  });

  it('displays read icon for read kind and strips markdown fence from output', () => {
    const tool: TurnEntryTool = {
      id: 1,
      type: 'tool_call',
      toolCallId: 't-1',
      title: 'Read src/main.rs',
      kind: 'read',
      status: 'completed',
      output: '```rust\nfn main() {}\n```',
    };
    fixture.componentRef.setInput('tool', tool);
    fixture.detectChanges();

    expect(component.icon()).toBe('description');
    expect(component.isSubagentChild()).toBe(false);
    expect(component.cleanOutput()).toBe('fn main() {}');

    const titleEl = fixture.nativeElement.querySelector('.tool-title');
    expect(titleEl.textContent).toBe('Read src/main.rs');

    const badge = fixture.nativeElement.querySelector('.subagent-badge');
    expect(badge).toBeNull();
  });

  it('displays terminal icon for execute kind and shows subagent badge if parentId is set', () => {
    const tool: TurnEntryTool = {
      id: 2,
      type: 'tool_call',
      toolCallId: 't-2',
      title: 'cargo check',
      kind: 'execute',
      parentId: 'task-parent-1',
      status: 'completed',
      output: 'Finished dev profile',
    };

    fixture.componentRef.setInput('tool', tool);
    fixture.detectChanges();

    expect(component.icon()).toBe('terminal');
    expect(component.isSubagentChild()).toBe(true);

    const badge = fixture.nativeElement.querySelector('.subagent-badge');
    expect(badge).not.toBeNull();
    expect(badge.textContent).toBe('Subagent');
  });
});
