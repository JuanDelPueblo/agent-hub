import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiService } from '../../core/api/api.service';
import type { Chat, TerminalTaskDetails, TerminalTaskSummary } from '../../core/api/types';
import { TerminalTaskDialogComponent } from './terminal-task-dialog';

describe('TerminalTaskDialogComponent', () => {
  let fixture: ComponentFixture<TerminalTaskDialogComponent>;

  const chat: Chat = {
    id: 'chat-1',
    project_id: 'proj-1',
    agent: 'antigravity',
    title: 'Test Chat',
    created_at: '2026-09-14T00:00:00Z',
    updated_at: '2026-09-14T00:00:00Z',
    archived: false,
    permission_policy: 'ask',
    config_values: {},
  };

  const tasks: TerminalTaskSummary[] = [
    {
      id: 'task-1',
      chat_id: 'chat-1',
      command: 'cargo test',
      cwd: '/workspace',
      state: 'running',
      started_at: '2026-09-14T00:00:00Z',
    },
    {
      id: 'task-2',
      chat_id: 'chat-1',
      command: 'npm run build',
      cwd: '/workspace/frontend',
      state: 'completed',
      exit_code: 0,
      started_at: '2026-09-14T00:00:00Z',
      completed_at: '2026-09-14T00:01:00Z',
    },
  ];

  const task1Details: TerminalTaskDetails = {
    ...tasks[0],
    output: 'running 5 tests...\ntest result: ok',
    truncated: false,
  };

  const mockApi = {
    fetchChatTasks: vi.fn(async () => tasks),
    fetchChatTask: vi.fn(async (_chatId: string, taskId: string) => {
      if (taskId === 'task-1') return task1Details;
      return { ...tasks[1], output: 'built successfully', truncated: false };
    }),
    stopChatTask: vi.fn(async () => undefined),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [TerminalTaskDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: chat },
        { provide: MatDialogRef, useValue: { close: vi.fn() } },
        { provide: ApiService, useValue: mockApi },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TerminalTaskDialogComponent);
    fixture.detectChanges();
    await fixture.componentInstance.loadTasks();
    fixture.detectChanges();
  });

  it('loads tasks on init and renders them in the list', () => {
    expect(mockApi.fetchChatTasks).toHaveBeenCalledWith('chat-1');
    const items = fixture.nativeElement.querySelectorAll('.task-item');
    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain('cargo test');
    expect(items[1].textContent).toContain('npm run build');
  });

  it('selects the running task by default and renders output', () => {
    expect(mockApi.fetchChatTask).toHaveBeenCalledWith('chat-1', 'task-1');
    const output = fixture.nativeElement.querySelector('.terminal-output');
    expect(output).toBeTruthy();
    expect(output.textContent).toContain('running 5 tests...');
  });

  it('stops running task when clicking Stop task', async () => {
    const stopBtn = Array.from(fixture.nativeElement.querySelectorAll('button'))
      .find((btn: unknown) => (btn as Element).textContent?.includes('Stop task')) as HTMLButtonElement;
    expect(stopBtn).toBeTruthy();
    stopBtn.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(mockApi.stopChatTask).toHaveBeenCalledWith('chat-1', 'task-1');
  });
});
