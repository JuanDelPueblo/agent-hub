import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { ChatConfigComponent } from './chat-config';
import { AppStateService } from '../../state/app-state.service';
import type { Chat } from '../../core/api/types';

describe('ChatConfigComponent workspace metadata', () => {
  let fixture: ComponentFixture<ChatConfigComponent>;
  const baseChat: Chat = {
    id: 'chat-1', project_id: 'project-1', agent: 'codex', title: 'Chat',
    created_at: '2026-09-13', updated_at: '2026-09-13', archived: false,
    permission_policy: 'ask', config_values: {}, workspace: null,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatConfigComponent],
      providers: [{ provide: AppStateService, useValue: {
        setChatPolicy: async () => undefined, setChatConfig: async () => undefined,
      } }],
    }).compileComponents();
    fixture = TestBed.createComponent(ChatConfigComponent);
  });

  it('shows managed workspace details read-only', () => {
    fixture.componentRef.setInput('chat', { ...baseChat, workspace: {
      mode: 'managed_worktree', branch: 'agent-hub/chat/chat-1',
      base_commit: 'abcdef1234567890',
    } });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Isolated worktree');
    expect(fixture.nativeElement.textContent).toContain('agent-hub/chat/chat-1');
    expect(fixture.nativeElement.textContent).toContain('abcdef1');
    expect(fixture.nativeElement.querySelector('.workspace-section input, .workspace-section select')).toBeNull();
  });

  it('shows direct checkout details and omits the section for legacy chats', () => {
    fixture.componentRef.setInput('chat', { ...baseChat, workspace: {
      mode: 'project_checkout', branch: 'feature/ui', base_commit: null,
    } });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Project checkout');
    expect(fixture.nativeElement.textContent).toContain("This chat works directly in the project's checkout.");
    expect(fixture.nativeElement.textContent).toContain('feature/ui');
    fixture.componentRef.setInput('chat', baseChat);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.workspace-section')).toBeNull();
  });
});
