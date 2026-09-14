import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DeleteChatDialogComponent } from './delete-chat-dialog';
import { AppStateService } from '../../state/app-state.service';
import type { Chat } from '../../core/api/types';

describe('DeleteChatDialogComponent', () => {
  let fixture: ComponentFixture<DeleteChatDialogComponent>;
  let deleteChat: ReturnType<typeof vi.fn>;
  const dialogRef = { close: vi.fn() };
  const chat: Chat = {
    id: 'chat-1', project_id: 'project-1', agent: 'codex', title: 'A chat',
    created_at: '2026-01-01', updated_at: '2026-01-01', archived: false,
    permission_policy: 'ask', config_values: {},
  };

  async function setup(workspace: Chat['workspace'] = null): Promise<void> {
    deleteChat = vi.fn(async () => undefined);
    await TestBed.configureTestingModule({
      imports: [DeleteChatDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { ...chat, workspace } },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: AppStateService, useValue: { deleteChat } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(DeleteChatDialogComponent);
    fixture.detectChanges();
  }

  beforeEach(() => vi.clearAllMocks());

  it('explains managed worktree cleanup and shows its branch', async () => {
    await setup({ mode: 'managed_worktree', branch: 'hub/chat-1', base_commit: null });
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('removed only if it is safe and clean');
    expect(text).toContain('uncommitted files would be lost');
    expect(text).toContain('hub/chat-1');
    expect(text).toContain('Git branch is preserved');
    expect(text).not.toMatch(/(?:^|\s)\/(?:home|srv|var|tmp)\//);
    expect(text).not.toContain('cannot be undone');
  });

  it('explains that a project checkout is untouched', async () => {
    await setup({ mode: 'project_checkout', branch: 'feature/ui', base_commit: null });
    expect(fixture.nativeElement.textContent).toContain('branch and working files are left unchanged');
  });

  it('keeps simple wording for chats without a workspace', async () => {
    await setup(null);
    expect(fixture.nativeElement.textContent).toContain('This action cannot be undone.');
  });

  it('keeps a deletion error visible and the dialog open', async () => {
    await setup({ mode: 'managed_worktree', branch: 'hub/chat-1', base_commit: null });
    deleteChat.mockRejectedValueOnce(new Error('worktree has uncommitted changes'));
    await fixture.componentInstance.remove();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]')?.textContent).toContain('uncommitted changes');
    expect(dialogRef.close).not.toHaveBeenCalledWith(true);
  });
});
