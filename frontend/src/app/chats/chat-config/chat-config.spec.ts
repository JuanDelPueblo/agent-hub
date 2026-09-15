import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { ChatConfigComponent } from './chat-config';
import { AppStateService } from '../../state/app-state.service';
import { ApiService } from '../../core/api/api.service';
import type { Chat } from '../../core/api/types';

describe('ChatConfigComponent workspace metadata', () => {
  let fixture: ComponentFixture<ChatConfigComponent>;
  const api = {
    fetchMcpServers: vi.fn(async () => []), fetchAdditionalRoots: vi.fn(async () => []),
    fetchProjects: vi.fn(async () => []), editMcpServer: vi.fn(async () => []),
  };
  const state = {
    setChatPolicy: async () => undefined, setChatConfig: async () => undefined,
    retryConnection: vi.fn(async () => undefined),
  };
  const baseChat: Chat = {
    id: 'chat-1', project_id: 'project-1', agent: 'codex', title: 'Chat',
    created_at: '2026-09-13', updated_at: '2026-09-13', archived: false,
    permission_policy: 'ask', config_values: {}, workspace: null,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatConfigComponent],
      providers: [
        { provide: AppStateService, useValue: state },
        { provide: ApiService, useValue: api },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ChatConfigComponent);
  });

  it('shows managed workspace details read-only', () => {
    fixture.componentRef.setInput('chat', { ...baseChat, workspace: {
      mode: 'managed_worktree', branch: 'pueblo-hub/chat/chat-1',
      base_commit: 'abcdef1234567890',
    } });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Isolated worktree');
    expect(fixture.nativeElement.textContent).toContain('pueblo-hub/chat/chat-1');
    expect(fixture.nativeElement.textContent).toContain('abcdef1');
    expect(fixture.nativeElement.querySelector('[aria-labelledby="workspace-heading"] input, [aria-labelledby="workspace-heading"] select')).toBeNull();
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
    expect(fixture.nativeElement.querySelector('[aria-labelledby="workspace-heading"]')).toBeNull();
  });

  it('edits ordered arguments and every redacted secret without exposing values', async () => {
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('chat', baseChat);
    component.mcpServers.set([{
      id: 'mcp-1', position: 0, name: 'stdio tools', transport: 'stdio', url: null,
      command: '/bin/tool', args: ['package', 'subcommand'],
      secrets: [{ name: 'TOKEN', present: true }, { name: 'X-API-Key', present: true }],
    }]);
    component.beginMcpEdit('mcp-1');
    expect(component.editArgs()).toBe('package\nsubcommand');
    expect(component.editSecrets()).toEqual([
      { name: 'TOKEN', action: 'keep', value: '' },
      { name: 'X-API-Key', action: 'keep', value: '' },
    ]);
    component.editArgs.set('new-package\nnew-subcommand');
    component.setSecret(0, 'action', 'replace');
    component.setSecret(0, 'value', 'new-token');
    component.setSecret(1, 'action', 'remove');
    api.editMcpServer.mockResolvedValueOnce([]);

    await component.saveAdvancedMcp();

    expect(api.editMcpServer).toHaveBeenCalledWith('chat-1', 'mcp-1', expect.objectContaining({
      args: ['new-package', 'new-subcommand'],
      secrets: [
        { name: 'TOKEN', action: 'replace', value: 'new-token' },
        { name: 'X-API-Key', action: 'remove' },
      ],
    }));
    expect(state.retryConnection).toHaveBeenCalledWith('chat-1');
    expect(fixture.nativeElement.textContent).not.toContain('new-token');
  });
});
