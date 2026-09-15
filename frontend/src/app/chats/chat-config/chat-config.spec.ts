import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { ChatConfigComponent } from './chat-config';
import { McpServerDialogComponent } from '../mcp-server-dialog/mcp-server-dialog';
import { AppStateService } from '../../state/app-state.service';
import { ApiService } from '../../core/api/api.service';
import type { AdditionalRoot, Chat, McpServer, Project } from '../../core/api/types';

describe('ChatConfigComponent', () => {
  let fixture: ComponentFixture<ChatConfigComponent>;
  let dialog: { open: ReturnType<typeof vi.fn> };
  const api = {
    fetchMcpServers: vi.fn(async (): Promise<McpServer[]> => []),
    fetchAdditionalRoots: vi.fn(async (): Promise<AdditionalRoot[]> => []),
    fetchProjects: vi.fn(async (): Promise<Project[]> => []),
    setAdditionalRoots: vi.fn(async (): Promise<AdditionalRoot[]> => []),
    deleteMcpServer: vi.fn(async (): Promise<void> => undefined),
    orderMcpServers: vi.fn(async (): Promise<McpServer[]> => []),
  };
  const state = {
    setChatPolicy: async () => undefined, setChatConfig: async () => undefined,
    setChatMode: async () => undefined,
    retryConnection: vi.fn(async () => undefined),
  };
  const baseChat: Chat = {
    id: 'chat-1', project_id: 'project-1', agent: 'codex', title: 'Chat',
    created_at: '2026-09-13', updated_at: '2026-09-13', archived: false,
    permission_policy: 'ask', config_values: {}, workspace: null,
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    dialog = { open: vi.fn(() => ({ afterClosed: () => of(undefined) })) };
    await TestBed.configureTestingModule({
      imports: [ChatConfigComponent],
      providers: [
        { provide: AppStateService, useValue: state },
        { provide: ApiService, useValue: api },
        { provide: MatDialog, useValue: dialog },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ChatConfigComponent);
  });

  // Waits for the chat effect to finish loading connection config so later
  // signal writes are not overwritten by the initial fetch.
  async function renderChat(): Promise<void> {
    fixture.componentRef.setInput('chat', baseChat);
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();
  }

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

  it('presents other-project access without root terminology and reconnects on change', async () => {
    await renderChat();
    const component = fixture.componentInstance;
    component.projects.set([
      { id: 'project-1', name: 'Primary', path: '/p1', created_at: '2026-09-13', updated_at: '2026-09-13' },
      { id: 'project-2', name: 'Shared', path: '/p2', created_at: '2026-09-13', updated_at: '2026-09-13' },
    ]);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Other project access');
    expect(text).toContain('Allow this agent to work with files from other Pueblo projects.');
    expect(text).not.toContain('Additional workspace roots');
    expect(text).not.toContain('root');

    api.setAdditionalRoots.mockResolvedValueOnce([{ project_id: 'project-2', position: 0 }]);
    component.projectSelected('project-2');
    await component.addProjectAccess();
    expect(api.setAdditionalRoots).toHaveBeenCalledWith('chat-1', ['project-2']);
    expect(state.retryConnection).toHaveBeenCalledWith('chat-1');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Shared');

    api.setAdditionalRoots.mockResolvedValueOnce([]);
    await component.removeProjectAccess('project-2');
    expect(api.setAdditionalRoots).toHaveBeenCalledWith('chat-1', []);
    expect(state.retryConnection).toHaveBeenCalledTimes(2);
  });

  it('renders MCP servers as a compact list and opens the edit dialog', async () => {
    await renderChat();
    const component = fixture.componentInstance;
    component.mcpServers.set([{
      id: 'mcp-1', position: 0, name: 'stdio tools', transport: 'stdio', url: null,
      command: '/bin/tool', args: ['package'], secrets: [{ name: 'TOKEN', present: true }],
    }]);
    fixture.detectChanges();

    const section = fixture.nativeElement.querySelector('[aria-labelledby="mcp-heading"]') as HTMLElement;
    expect(section.textContent).toContain('MCP servers');
    expect(section.textContent).toContain('stdio tools');
    expect(section.textContent).toContain('Stdio');
    expect(section.textContent).toContain('Secrets configured');
    expect(section.querySelector('.mcp-row')).not.toBeNull();
    expect(section.querySelector('mat-form-field')).toBeNull();
    expect(section.textContent).toContain('Add server');

    component.openMcpDialog(component.mcpServers()[0]);
    expect(dialog.open).toHaveBeenCalledWith(McpServerDialogComponent, {
      width: 'min(600px, calc(100vw - 32px))',
      data: { chatId: 'chat-1', server: component.mcpServers()[0] },
    });
  });

  it('opens the add dialog without a server and applies the saved list', async () => {
    await renderChat();
    const component = fixture.componentInstance;
    const saved = [{
      id: 'mcp-2', position: 0, name: 'new', transport: 'http' as const, url: 'https://example.test', command: null,
      args: [], secrets: [],
    }];
    dialog.open.mockReturnValueOnce({ afterClosed: () => of(saved) });

    component.openMcpDialog(null);
    expect(dialog.open).toHaveBeenCalledWith(McpServerDialogComponent, {
      width: 'min(600px, calc(100vw - 32px))',
      data: { chatId: 'chat-1', server: null },
    });
    expect(component.mcpServers()).toEqual(saved);
    expect(state.retryConnection).toHaveBeenCalledWith('chat-1');
  });

  it('reorders and removes MCP servers and reconnects', async () => {
    await renderChat();
    const component = fixture.componentInstance;
    const first = { id: 'a', position: 0, name: 'A', transport: 'stdio' as const, url: null, command: '/a', args: [], secrets: [] };
    const second = { id: 'b', position: 1, name: 'B', transport: 'stdio' as const, url: null, command: '/b', args: [], secrets: [] };
    component.mcpServers.set([first, second]);

    api.orderMcpServers.mockResolvedValueOnce([{ ...second, position: 0 }, { ...first, position: 1 }]);
    await component.moveMcp('b', -1);
    expect(api.orderMcpServers).toHaveBeenCalledWith('chat-1', ['b', 'a']);

    api.deleteMcpServer.mockResolvedValueOnce(undefined);
    await component.removeMcp('a');
    expect(api.deleteMcpServer).toHaveBeenCalledWith('chat-1', 'a');
    expect(component.mcpServers().map((server) => server.id)).toEqual(['b']);
    expect(state.retryConnection).toHaveBeenCalledTimes(2);
  });
});