import { computed, inject, Service, signal, WritableSignal } from '@angular/core';
import { ApiService } from '../core/api/api.service';
import type {
  AgentAuthFlow,
  AgentAuthState,
  AgentManagementDetail,
  AgentSummary,
  CustomAgentInput,
  InstallRegistryAgentInput,
  RegistryCatalog,
  RemoveOutcome,
  UpdateOutcome,
  ValidationReport,
} from '../core/api/types';
import { ProjectStore } from './project.store';

type ErrorMap = Record<string, string>;

/**
 * Owns the agent management surface: the installed catalog, the ACP Registry
 * browse cache, editable custom definitions, and authentication state.
 *
 * The installed list is the same signal the new-chat picker reads, so every
 * mutation keeps one authoritative catalog.
 */
@Service()
export class AgentStore {
  private readonly api = inject(ApiService);
  private readonly projectStore = inject(ProjectStore);

  readonly installed = this.projectStore.agents;
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly registry = signal<RegistryCatalog | null>(null);
  readonly registryLoading = signal(false);
  readonly registryError = signal<string | null>(null);

  readonly customDetails = signal<Record<string, AgentManagementDetail>>({});
  readonly authByAgent = signal<Record<string, AgentAuthState>>({});
  readonly authLoading = signal<ReadonlySet<string>>(new Set());
  readonly authErrors = signal<ErrorMap>({});

  readonly available = computed(() =>
    this.installed().filter((agent) => agent.availability === 'available'),
  );

  async loadInstalled(): Promise<void> {
    this.loading.set(true);
    try {
      this.installed.set(await this.api.fetchAgents());
      this.error.set(null);
    } catch (error) {
      this.error.set(this.message(error, 'Failed to load the agent catalog'));
    } finally {
      this.loading.set(false);
    }
  }

  async loadRegistry(refresh = false): Promise<void> {
    this.registryLoading.set(true);
    try {
      this.registry.set(refresh ? await this.api.refreshRegistry() : await this.api.fetchRegistry());
      this.registryError.set(this.registry()?.error ?? null);
    } catch (error) {
      this.registryError.set(this.message(error, 'Failed to load the ACP Registry'));
    } finally {
      this.registryLoading.set(false);
    }
  }

  async refreshRegistry(): Promise<void> {
    await this.loadRegistry(true);
  }

  async installRegistryAgent(input: InstallRegistryAgentInput): Promise<AgentSummary> {
    const installed = await this.api.installRegistryAgent(input);
    await this.loadInstalled();
    await this.loadRegistry(true);
    return installed;
  }

  async updateAgent(id: string): Promise<UpdateOutcome> {
    const outcome = await this.api.updateRegistryAgent(id);
    await this.loadInstalled();
    await this.loadRegistry();
    return outcome;
  }

  async removeAgent(id: string): Promise<RemoveOutcome> {
    const outcome = await this.api.removeAgent(id);
    await this.loadInstalled();
    return outcome;
  }

  async fetchDetail(id: string): Promise<AgentManagementDetail> {
    const detail = await this.api.fetchAgentDetail(id);
    this.customDetails.update((current) => ({ ...current, [id]: detail }));
    return detail;
  }

  validateCustomAgent(input: CustomAgentInput): Promise<ValidationReport> {
    return this.api.validateCustomAgent(input);
  }

  async createCustomAgent(input: CustomAgentInput): Promise<AgentSummary> {
    const created = await this.api.createCustomAgent(input);
    await this.loadInstalled();
    return created;
  }

  async editCustomAgent(id: string, input: CustomAgentInput): Promise<AgentSummary> {
    const updated = await this.api.editCustomAgent(id, input);
    await this.loadInstalled();
    this.customDetails.update((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
    return updated;
  }

  async loadAuth(id: string): Promise<AgentAuthState> {
    this.setLoading(id, true);
    try {
      const state = await this.api.fetchAgentAuth(id);
      this.authByAgent.update((current) => ({ ...current, [id]: state }));
      this.clearAuthError(id);
      return state;
    } catch (error) {
      this.setAuthError(id, this.message(error, 'Failed to load authentication state'));
      throw error;
    } finally {
      this.setLoading(id, false);
    }
  }

  async authenticate(id: string, methodId: string): Promise<AgentAuthState> {
    this.setLoading(id, true);
    try {
      await this.api.authenticateAgent(id, methodId);
      return await this.loadAuth(id);
    } catch (error) {
      this.setAuthError(id, this.message(error, 'Authentication failed'));
      throw error;
    } finally {
      this.setLoading(id, false);
    }
  }

  async logout(id: string): Promise<AgentAuthState> {
    this.setLoading(id, true);
    try {
      const state = await this.api.logoutAgent(id);
      this.authByAgent.update((current) => ({ ...current, [id]: state }));
      this.clearAuthError(id);
      return state;
    } catch (error) {
      this.setAuthError(id, this.message(error, 'Logout failed'));
      throw error;
    } finally {
      this.setLoading(id, false);
    }
  }

  /** Starts the opaque PTY flow. The browser never chooses command or args. */
  async startTerminalAuth(id: string, methodId: string): Promise<AgentAuthFlow> {
    const flow = await this.api.startTerminalAuth(id, methodId);
    await this.loadAuth(id);
    return flow;
  }

  private setLoading(id: string, loading: boolean): void {
    this.setSetValue(this.authLoading, id, loading);
  }

  private setAuthError(id: string, message: string): void {
    this.authErrors.update((current) => ({ ...current, [id]: message }));
  }

  private clearAuthError(id: string): void {
    this.authErrors.update((current) => {
      if (!(id in current)) return current;
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  private setSetValue(target: WritableSignal<ReadonlySet<string>>, value: string, present: boolean): void {
    target.update((current) => {
      const next = new Set(current);
      if (present) next.add(value);
      else next.delete(value);
      return next;
    });
  }

  private message(error: unknown, fallback: string): string {
    return error instanceof Error && error.message ? error.message : fallback;
  }
}
