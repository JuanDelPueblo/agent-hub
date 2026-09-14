import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Chat } from '../../core/api/types';
import { AppStateService } from '../../state/app-state.service';
import { RenameChatDialogComponent } from './rename-chat-dialog';

describe('RenameChatDialogComponent', () => {
  const chat = {
    id: 'chat-1',
    project_id: 'project-1',
    agent: 'codex',
    title: 'Old title',
    archived: false,
    permission_policy: 'ask',
    config_values: {},
    process_state: 'RUNNING',
    turn_state: 'PROMPTING',
  } as Chat;
  const renameChat = vi.fn(async () => undefined);
  const close = vi.fn();

  beforeEach(() => {
    renameChat.mockClear();
    close.mockClear();
    TestBed.configureTestingModule({
      imports: [RenameChatDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: chat },
        { provide: MatDialogRef, useValue: { close } },
        { provide: AppStateService, useValue: { renameChat } },
      ],
    });
  });

  it('renames from the value entered in the signal form', async () => {
    const fixture = TestBed.createComponent(RenameChatDialogComponent);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    input.value = '  New title  ';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));
    await fixture.whenStable();

    expect(renameChat).toHaveBeenCalledWith('chat-1', 'New title');
    expect(close).toHaveBeenCalledWith(true);
  });
});
