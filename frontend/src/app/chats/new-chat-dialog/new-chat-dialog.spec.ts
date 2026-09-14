import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiService } from '../../core/api/api.service';
import { AppStateService } from '../../state/app-state.service';
import { NewChatDialogComponent } from './new-chat-dialog';

describe('NewChatDialogComponent', () => {
  let fixture: ComponentFixture<NewChatDialogComponent>;
  let state: { agents: ReturnType<typeof vi.fn>; createChat: ReturnType<typeof vi.fn> };
  let api: { fetchWorkspaceOptions: ReturnType<typeof vi.fn> };
  let close: ReturnType<typeof vi.fn>;

  async function setup(options: unknown) {
    state = { agents: vi.fn(() => ['codex', 'claude']), createChat: vi.fn(async () => ({ id: 'chat-1' })) };
    api = { fetchWorkspaceOptions: vi.fn(async () => options) };
    close = vi.fn();
    await TestBed.configureTestingModule({
      imports: [NewChatDialogComponent],
      providers: [
        { provide: ApiService, useValue: api },
        { provide: AppStateService, useValue: state },
        { provide: MAT_DIALOG_DATA, useValue: { projectId: 'project-1' } },
        { provide: MatDialogRef, useValue: { close } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(NewChatDialogComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(() => TestBed.resetTestingModule());

  it('defaults Git chats to isolated mode and the current branch, and shows dirty guidance', async () => {
    await setup({ is_git: true, current_branch: 'main', head_sha: 'a'.repeat(40), dirty: true,
      branches: [{ name: 'main', sha: 'a'.repeat(40), current: true }, { name: 'feature', sha: 'b'.repeat(40), current: false }] });
    expect(fixture.componentInstance.selectedMode()).toBe('managed_worktree');
    expect(fixture.componentInstance.selectedBranch()).toBe('main');
    expect(fixture.nativeElement.textContent).toContain('not included');
    fixture.componentInstance.selectedMode.set('project_checkout');
    fixture.detectChanges();
    await fixture.componentInstance.create();
    expect(state.createChat).toHaveBeenCalledWith('project-1', 'codex', undefined, {
      mode: 'project_checkout', branch: 'main',
    });
  });

  it('keeps non-Git creation to agent selection', async () => {
    await setup({ is_git: false, current_branch: null, head_sha: null, dirty: false, branches: [] });
    expect(fixture.nativeElement.textContent).not.toContain('Workspace mode');
    expect(fixture.nativeElement.textContent).not.toContain('Branch');
    await fixture.componentInstance.create();
    expect(state.createChat).toHaveBeenCalledWith('project-1', 'codex', undefined, undefined);
  });
});
