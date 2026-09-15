import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AgentAuthState, AgentSummary } from '../../core/api/types';
import { AppStateService } from '../../state/app-state.service';
import { AuthTerminalDialogComponent } from '../../agents/auth-terminal-dialog/auth-terminal-dialog';
import { AgentsPageComponent } from './agents-page';

const builtin: AgentSummary = {
  id: 'codex',
  display_name: 'Codex',
  source: 'builtin',
  availability: 'available',
  metadata: {},
  mutability: 'read_only',
  display: { description: 'A builtin agent.' },
};

const custom: AgentSummary = {
  id: 'my-custom',
  display_name: 'My Custom',
  source: 'pueblo_managed',
  availability: 'available',
  metadata: {},
  mutability: 'editable',
};

const registry: AgentSummary = {
  id: 'example-acp',
  display_name: 'Example ACP',
  source: 'registry',
  availability: 'available',
  metadata: {},
  mutability: 'registry_managed',
};

function makeState() {
  return {
    agents: signal<AgentSummary[]>([builtin, custom, registry]),
    agentError: signal<string | null>(null),
    agentsLoading: signal(false),
    registry: signal(null),
    registryLoading: signal(false),
    registryError: signal<string | null>(null),
    authByAgent: signal<Record<string, AgentAuthState>>({
      codex: {
        agent_id: 'codex',
        methods: [{ id: 'oauth', name: 'OAuth', type: 'agent', supported: true }],
        logout_supported: true,
        terminal_supported: true,
      },
    }),
    authLoading: signal<ReadonlySet<string>>(new Set()),
    authErrors: signal<Record<string, string>>({}),
    loadAgents: vi.fn(async () => undefined),
    loadRegistry: vi.fn(async () => undefined),
    refreshRegistry: vi.fn(async () => undefined),
    loadAgentAuth: vi.fn(async () => ({ agent_id: 'codex', methods: [], logout_supported: true, terminal_supported: true })),
    authenticateAgent: vi.fn(async () => ({ agent_id: 'codex', methods: [], logout_supported: true, terminal_supported: true })),
    logoutAgent: vi.fn(async () => ({ agent_id: 'codex', methods: [], logout_supported: true, terminal_supported: true })),
    startTerminalAgentAuth: vi.fn(async () => ({ flow_id: 'f', agent_id: 'codex', method_id: 'api-key', state: 'running' as const })),
    fetchAgentDetail: vi.fn(async () => ({ id: 'my-custom', display_name: 'My Custom', command: 'my-agent', args: [], env: {}, idle_timeout: 900, usage_provider: null, metadata: null, default_permission_policy: 'ask', description: null })),
    createCustomAgent: vi.fn(async () => custom),
    editCustomAgent: vi.fn(async () => custom),
    removeAgent: vi.fn(async (id: string) => ({ id, deleted: true, retained_chats: 0 })),
    updateAgent: vi.fn(async () => ({ updated: true, from_version: '1.0.0', to_version: '2.0.0', agent: registry })),
  };
}

describe('AgentsPageComponent', () => {
  let fixture: ComponentFixture<AgentsPageComponent>;
  let state: ReturnType<typeof makeState>;
  let dialog: { open: ReturnType<typeof vi.fn> };
  let queryParamsSubject: BehaviorSubject<ReturnType<typeof convertToParamMap>>;

  beforeEach(async () => {
    state = makeState();
    dialog = { open: vi.fn(() => ({ afterClosed: () => of(true) })) };
    queryParamsSubject = new BehaviorSubject(convertToParamMap({ agent: 'codex' }));

    const activatedRoute = {
      snapshot: { queryParamMap: convertToParamMap({ agent: 'codex' }) },
      queryParamMap: queryParamsSubject.asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [AgentsPageComponent],
      providers: [
        { provide: AppStateService, useValue: state },
        { provide: MatDialog, useValue: dialog },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentsPageComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('lists installed agents with source, mutability, and read-only presentation', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Codex');
    expect(text).toContain('Built-in');
    expect(text).toContain('Read-only');
    expect(text).toContain('Custom');
    expect(text).toContain('Editable');
    expect(text).toContain('Registry-managed');
    expect(state.loadAgents).toHaveBeenCalled();
  });

  it('consumes agent query param and targets the agent auth section', () => {
    expect(fixture.componentInstance.targetAgentId()).toBe('codex');
    const targeted = fixture.nativeElement.querySelector('.auth.targeted');
    expect(targeted).not.toBeNull();
  });

  it('opens the create dialog for a new custom agent', () => {
    fixture.componentInstance.createCustom();
    expect(dialog.open).toHaveBeenCalled();
  });

  it('loads management detail before editing a custom agent', async () => {
    await fixture.componentInstance.editCustom(custom);
    expect(state.fetchAgentDetail).toHaveBeenCalledWith('my-custom');
    expect(dialog.open).toHaveBeenCalled();
  });

  it('authenticates through the store and refreshes state', async () => {
    await fixture.componentInstance.authenticate(builtin, 'oauth');
    expect(state.authenticateAgent).toHaveBeenCalledWith('codex', 'oauth');
    expect(fixture.componentInstance.notice()).toContain('authentication completed');
  });

  it('logs out through the store', async () => {
    await fixture.componentInstance.logout(builtin);
    expect(state.logoutAgent).toHaveBeenCalledWith('codex');
  });

  it('starts a terminal flow and opens the terminal dialog with flow and method', async () => {
    await fixture.componentInstance.openTerminalAuth(builtin, 'api-key');
    expect(state.startTerminalAgentAuth).toHaveBeenCalledWith('codex', 'api-key');
    expect(dialog.open).toHaveBeenCalledWith(
      AuthTerminalDialogComponent,
      expect.objectContaining({
        data: expect.objectContaining({
          flow: expect.objectContaining({ flow_id: 'f' }),
          method: expect.objectContaining({ id: 'api-key' }),
        }),
      }),
    );
  });

  it('confirms before removing and reports a retained chat', async () => {
    state.removeAgent.mockResolvedValueOnce({ id: 'my-custom', deleted: false, retained_chats: 3 });
    await fixture.componentInstance.removeCustom(custom);
    expect(state.removeAgent).toHaveBeenCalledWith('my-custom');
    expect(fixture.componentInstance.notice()).toContain('3 chat(s)');
  });

  it('confirms before uninstalling a registry agent', async () => {
    await fixture.componentInstance.uninstall(registry);
    expect(state.removeAgent).toHaveBeenCalledWith('example-acp');
  });

  it('surfaces a failed update', async () => {
    state.updateAgent.mockRejectedValueOnce(new Error('registry unavailable'));
    await fixture.componentInstance.update(registry);
    expect(fixture.componentInstance.actionError()).toContain('registry unavailable');
  });
});
