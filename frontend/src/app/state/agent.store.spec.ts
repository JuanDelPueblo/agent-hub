import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiService } from '../core/api/api.service';
import type { AgentAuthState, AgentSummary } from '../core/api/types';
import { AgentStore } from './agent.store';
import { ProjectStore } from './project.store';

function makeApi() {
  return {
    fetchAgents: vi.fn(async () => [] as AgentSummary[]),
    fetchRegistry: vi.fn(async () => ({ status: 'cached', source_url: 's', host: 'h', rejected: [], agents: [] })),
    refreshRegistry: vi.fn(async () => ({ status: 'fresh', source_url: 's', host: 'h', rejected: [], agents: [] })),
    installRegistryAgent: vi.fn(async () => ({ id: 'native-agent' } as AgentSummary)),
    updateRegistryAgent: vi.fn(async () => ({ updated: true, from_version: '1', to_version: '2', agent: { id: 'a' } as AgentSummary })),
    removeAgent: vi.fn(async () => ({ id: 'a', deleted: true, retained_chats: 0 })),
    fetchAgentDetail: vi.fn(async () => ({ id: 'a', command: 'c', args: [], env: {} })),
    validateCustomAgent: vi.fn(async () => ({ valid: true, issues: [] })),
    createCustomAgent: vi.fn(async () => ({ id: 'a' } as AgentSummary)),
    editCustomAgent: vi.fn(async () => ({ id: 'a' } as AgentSummary)),
    fetchAgentAuth: vi.fn(async (id: string): Promise<AgentAuthState> => ({
      agent_id: id,
      methods: [],
      logout_supported: true,
      terminal_supported: true,
    })),
    authenticateAgent: vi.fn(async (id: string): Promise<AgentAuthState> => ({
      agent_id: id,
      methods: [],
      logout_supported: true,
      terminal_supported: true,
    })),
    logoutAgent: vi.fn(async (id: string): Promise<AgentAuthState> => ({
      agent_id: id,
      methods: [],
      logout_supported: true,
      terminal_supported: true,
    })),
    startTerminalAuth: vi.fn(async () => ({
      flow_id: 'f',
      agent_id: 'a',
      method_id: 'm',
      state: 'running' as const,
    })),
  };
}

describe('AgentStore', () => {
  let store: AgentStore;
  let api: ReturnType<typeof makeApi>;
  let agents: ReturnType<typeof signal<AgentSummary[]>>;

  beforeEach(() => {
    api = makeApi();
    agents = signal<AgentSummary[]>([]);
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useValue: api },
        { provide: ProjectStore, useValue: { agents } },
      ],
    });
    store = TestBed.inject(AgentStore);
  });

  it('owns the installed catalog through the shared agent signal', async () => {
    const summary = { id: 'codex', display_name: 'Codex', source: 'builtin', availability: 'available', metadata: {} } as AgentSummary;
    api.fetchAgents.mockResolvedValueOnce([summary]);
    await store.loadInstalled();
    expect(store.installed()).toEqual([summary]);
    expect(agents()).toEqual([summary]);
    expect(store.error()).toBeNull();
  });

  it('records a catalog load failure without inventing entries', async () => {
    api.fetchAgents.mockRejectedValueOnce(new Error('catalog down'));
    await store.loadInstalled();
    expect(store.installed()).toEqual([]);
    expect(store.error()).toBe('catalog down');
  });

  it('loads and refreshes the registry catalog', async () => {
    await store.loadRegistry('native');
    expect(api.fetchRegistry).toHaveBeenCalledWith('native');
    await store.refreshRegistry();
    expect(api.refreshRegistry).toHaveBeenCalled();
    expect(store.registry()?.status).toBe('fresh');
  });

  it('keeps the fresh catalog from the first registry load', async () => {
    api.fetchRegistry.mockResolvedValueOnce({
      status: 'fresh',
      source_url: 's',
      host: 'h',
      rejected: [],
      agents: [],
    });
    await store.loadRegistry();
    expect(store.registry()?.status).toBe('fresh');
    expect(store.registryError()).toBeNull();
  });

  it('installs, updates, and removes through the API and reloads the catalog', async () => {
    await store.installRegistryAgent({ registry_id: 'native-agent' });
    expect(api.installRegistryAgent).toHaveBeenCalledWith({ registry_id: 'native-agent' });
    expect(api.fetchAgents).toHaveBeenCalled();

    await store.updateAgent('native-agent');
    expect(api.updateRegistryAgent).toHaveBeenCalledWith('native-agent');

    await store.removeAgent('native-agent');
    expect(api.removeAgent).toHaveBeenCalledWith('native-agent');
  });

  it('validates and persists custom definitions', async () => {
    const input = { id: 'a', command: 'c', args: [], env: {} };
    await store.validateCustomAgent(input);
    expect(api.validateCustomAgent).toHaveBeenCalledWith(input);

    await store.createCustomAgent(input);
    expect(api.createCustomAgent).toHaveBeenCalledWith(input);

    await store.editCustomAgent('a', input);
    expect(api.editCustomAgent).toHaveBeenCalledWith('a', input);
  });

  it('tracks provider-neutral authentication state', async () => {
    await store.loadAuth('codex');
    expect(store.authByAgent()['codex'].logout_supported).toBe(true);

    api.fetchAgentAuth.mockResolvedValueOnce({
      agent_id: 'codex',
      methods: [{ id: 'm1', name: 'M1', type: 'agent', supported: true }],
      logout_supported: true,
      terminal_supported: true,
    });
    await store.authenticate('codex', 'openai');
    expect(api.authenticateAgent).toHaveBeenCalledWith('codex', 'openai');
    expect(store.authByAgent()['codex'].methods.length).toBe(1);

    await store.logout('codex');
    expect(api.logoutAgent).toHaveBeenCalledWith('codex');
    expect(store.authByAgent()['codex'].logout_supported).toBe(true);
  });

  it('starts a terminal flow and refreshes state after it', async () => {
    const flow = await store.startTerminalAuth('codex', 'api-key');
    expect(flow.flow_id).toBe('f');
    expect(api.startTerminalAuth).toHaveBeenCalledWith('codex', 'api-key');
    expect(api.fetchAgentAuth).toHaveBeenCalledWith('codex');
  });
});
