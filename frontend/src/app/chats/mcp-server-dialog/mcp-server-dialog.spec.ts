import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiService } from '../../core/api/api.service';
import type { McpServer } from '../../core/api/types';
import { McpServerDialogComponent } from './mcp-server-dialog';

describe('McpServerDialogComponent', () => {
  let fixture: ComponentFixture<McpServerDialogComponent>;
  let dialogRef: { close: ReturnType<typeof vi.fn> };
  let api: {
    createMcpServer: ReturnType<typeof vi.fn>;
    editMcpServer: ReturnType<typeof vi.fn>;
  };

  const existing: McpServer = {
    id: 'mcp-1',
    position: 0,
    name: 'stdio tools',
    transport: 'stdio',
    url: null,
    command: '/bin/tool',
    args: ['package', 'subcommand'],
    secrets: [{ name: 'TOKEN', present: true }, { name: 'X-API-Key', present: true }],
  };

  async function setup(server: McpServer | null): Promise<void> {
    dialogRef = { close: vi.fn() };
    api = {
      createMcpServer: vi.fn(async () => [server ?? existing]),
      editMcpServer: vi.fn(async () => [server ?? existing]),
    };
    await TestBed.configureTestingModule({
      imports: [McpServerDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { chatId: 'chat-1', server } },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: ApiService, useValue: api },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(McpServerDialogComponent);
    fixture.detectChanges();
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('prefills args and every redacted secret for an edit', async () => {
    await setup(existing);
    const component = fixture.componentInstance;
    expect(component.argsText()).toBe('package\nsubcommand');
    expect(component.secrets()).toEqual([
      { name: 'TOKEN', action: 'keep', value: '' },
      { name: 'X-API-Key', action: 'keep', value: '' },
    ]);
  });

  it('parses multiple ordered arguments and multiple secrets on create', async () => {
    await setup(null);
    const component = fixture.componentInstance;
    component.name.set('env tools');
    component.command.set('/usr/bin/env-tool');
    component.argsText.set('--flag\nvalue with spaces\n\n--last');
    component.addSecret();
    component.addSecret();
    component.setSecret(0, 'name', 'TOKEN');
    component.setSecret(0, 'value', 'first');
    component.setSecret(1, 'name', 'SECOND');
    component.setSecret(1, 'value', 'second');

    await component.save();

    expect(api.createMcpServer).toHaveBeenCalledWith('chat-1', expect.objectContaining({
      name: 'env tools',
      transport: 'stdio',
      command: '/usr/bin/env-tool',
      args: ['--flag', 'value with spaces', '--last'],
      secrets: [
        { name: 'TOKEN', action: 'replace', value: 'first' },
        { name: 'SECOND', action: 'replace', value: 'second' },
      ],
    }));
    expect(dialogRef.close).toHaveBeenCalledWith([existing]);
  });

  it('sends keep, replace, and remove for existing secrets and never exposes values', async () => {
    await setup(existing);
    const component = fixture.componentInstance;
    component.argsText.set('new-package\nnew-subcommand');
    component.setSecret(0, 'action', 'replace');
    component.setSecret(0, 'value', 'new-token');
    component.setSecret(1, 'action', 'remove');

    await component.save();

    expect(api.editMcpServer).toHaveBeenCalledWith('chat-1', 'mcp-1', expect.objectContaining({
      args: ['new-package', 'new-subcommand'],
      secrets: [
        { name: 'TOKEN', action: 'replace', value: 'new-token' },
        { name: 'X-API-Key', action: 'remove' },
      ],
    }));
    expect(fixture.nativeElement.textContent).not.toContain('new-token');
  });

  it('shows transport-relevant fields only', async () => {
    await setup(existing);
    const component = fixture.componentInstance;
    expect(component.showCommand()).toBe(true);
    expect(component.showUrl()).toBe(false);

    component.transport.set('http');
    fixture.detectChanges();
    expect(component.showCommand()).toBe(false);
    expect(component.showUrl()).toBe(true);
  });

  it('requires a replacement value for a named secret', async () => {
    await setup(existing);
    const component = fixture.componentInstance;
    component.setSecret(0, 'action', 'replace');
    await component.save();

    expect(api.editMcpServer).not.toHaveBeenCalled();
    expect(component.errorMessage()).toContain('TOKEN');
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('surfaces a backend error without closing or losing input', async () => {
    await setup(null);
    api.createMcpServer.mockRejectedValueOnce(new Error('MCP URL must be an http(s) URL without userinfo'));
    const component = fixture.componentInstance;
    component.name.set('remote');
    component.transport.set('http');
    component.url.set('ftp://bad');
    await component.save();

    expect(component.errorMessage()).toContain('http(s)');
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('keeps the dialog open on cancel and persists nothing', async () => {
    await setup(existing);
    const component = fixture.componentInstance;
    component.dialogRef.close();
    expect(api.editMcpServer).not.toHaveBeenCalled();
    expect(api.createMcpServer).not.toHaveBeenCalled();
  });
});