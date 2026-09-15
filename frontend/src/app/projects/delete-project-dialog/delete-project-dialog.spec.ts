import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { signal } from '@angular/core';
import { DeleteProjectDialogComponent } from './delete-project-dialog';
import { AppStateService } from '../../state/app-state.service';
import type { Project } from '../../core/api/types';

describe('DeleteProjectDialogComponent', () => {
  let fixture: ComponentFixture<DeleteProjectDialogComponent>;
  let deleteProject: ReturnType<typeof vi.fn>;
  const dialogRef = { close: vi.fn() };
  const project: Project = {
    id: 'project-1', name: 'Batey', path: '/work',
    created_at: '2026-01-01', updated_at: '2026-01-01',
  };

  async function setup(data: Project, chatsByProject: Record<string, unknown[]> = {}): Promise<void> {
    deleteProject = vi.fn(async () => undefined);
    await TestBed.configureTestingModule({
      imports: [DeleteProjectDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: AppStateService, useValue: { deleteProject, chatsByProject: signal(chatsByProject) } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(DeleteProjectDialogComponent);
    fixture.detectChanges();
  }

  beforeEach(() => vi.clearAllMocks());

  it('names how many chats will be deleted, using the durable count', async () => {
    await setup({ ...project, chat_count: 3 });
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('3 chats in this project');
    expect(text).toContain('history and configuration');
  });

  it('falls back to the cached chat list when no durable count is present', async () => {
    await setup({ ...project, chat_count: undefined }, { 'project-1': [{}, {}] });
    expect(fixture.nativeElement.textContent).toContain('2 chats in this project');
  });

  it('omits the chat-count line for a project with no chats', async () => {
    await setup({ ...project, chat_count: 0 });
    expect(fixture.nativeElement.textContent).not.toContain('chats in this project');
  });

  it('explains managed worktree cleanup and that project files are preserved', async () => {
    await setup({ ...project, chat_count: 1 });
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Batey-managed worktrees');
    expect(text).toContain('uncommitted changes blocks deletion');
    expect(text).toContain('will not be deleted');
  });

  it('keeps a deletion error visible and the dialog open', async () => {
    await setup({ ...project, chat_count: 1 });
    deleteProject.mockRejectedValueOnce(new Error('a chat has an active turn'));
    await fixture.componentInstance.delete();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]')?.textContent).toContain('active turn');
    expect(dialogRef.close).not.toHaveBeenCalledWith(true);
  });

  it('closes the dialog on successful deletion', async () => {
    await setup({ ...project, chat_count: 0 });
    await fixture.componentInstance.delete();
    expect(deleteProject).toHaveBeenCalledWith('project-1');
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });
});
