import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ApiService } from '../core/api/api.service';
import { EventSocketService } from '../core/event-socket.service';
import type {
  Chat,
  CloneProjectInput,
  ConfigOption,
  PermissionPolicy,
  ProcessState,
  Project,
  SessionEvent,
  TurnState,
} from '../core/api/types';
import { EventReducer } from './event-reducer';

type ChatMap = Record<string, Chat[]>;
type ConfigMap = Record<string, ConfigOption[]>;
type BooleanMap = Record<string, boolean>;
type ErrorMap = Record<string, string>;

/** Small application state boundary: server transport in, signals out. */
@Injectable({ providedIn: 'root' })
export class AppStateService {
  private readonly socket = inject(EventSocketService);

  readonly projects = signal<Project[]>([]);
  readonly chatsByProject = signal<ChatMap>({});
  readonly activeProjectId = signal<string | null>(null);
  readonly activeChatId = signal<string | null>(null);
  readonly configOptionsByChat = signal<ConfigMap>({});
  readonly configLoadedByChat = signal<BooleanMap>({});
  readonly reducersByChat = signal<Record<string, EventReducer>>({});
  readonly agents = signal<string[]>(['codex', 'claude', 'opencode', 'antigravity']);
  readonly loadingProjects = signal(false);
  readonly projectsError = signal<string | null>(null);
  readonly loadingChats = signal<ReadonlySet<string>>(new Set());
  readonly connectingChats = signal<ReadonlySet<string>>(new Set());
  readonly connectErrors = signal<ErrorMap>({});
  readonly isMobileDrawerOpen = signal(false);
  readonly showArchived = signal(false);

  readonly wsStatus = this.socket.status;
  readonly activeProject = computed(() => {
    const id = this.activeProjectId();
    return id ? this.projects().find((project) => project.id === id) ?? null : null;
  });
  readonly activeChat = computed(() => {
    const projectId = this.activeProjectId();
    const chatId = this.activeChatId();
    if (!projectId || !chatId) return null;
    return this.chatsByProject()[projectId]?.find((chat) => chat.id === chatId) ?? null;
  });

  private readonly router = inject(Router);
  private readonly api = inject(ApiService);
  private readonly emptyReducer = new EventReducer();
  private readonly inFlightConnections = new Map<string, Promise<Chat>>();
  private readonly inFlightConfigs = new Map<string, Promise<ConfigOption[]>>();
  private readonly inFlightChats = new Map<string, Promise<void>>();

  constructor() {
    this.socket.events.subscribe((event) => this.handleIncomingEvent(event));
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.syncRoute(event.urlAfterRedirects));
    this.syncRoute(this.router.url || (typeof window !== 'undefined' ? window.location.pathname : '/'));
    this.socket.connect();
    void this.initialize();
  }

  readonly activeReducer = computed(() => {
    const chatId = this.activeChatId();
    return chatId ? this.reducersByChat()[chatId] ?? this.emptyReducer : this.emptyReducer;
  });

  setMobileDrawerOpen(open: boolean): void {
    this.isMobileDrawerOpen.set(open);
  }

  setShowArchived(show: boolean): void {
    this.showArchived.set(show);
  }

  async loadProjects(): Promise<void> {
    this.loadingProjects.set(true);
    try {
      this.projects.set(await this.api.fetchProjects());
      this.projectsError.set(null);
    } catch (error) {
      this.projectsError.set(this.errorMessage(error, 'Failed to load projects'));
      console.error('Failed to load projects', error);
    } finally {
      this.loadingProjects.set(false);
    }
  }

  async loadAgents(): Promise<void> {
    try {
      this.agents.set(await this.api.fetchAgents());
    } catch {
      // Keep the built-in names when the optional agent listing is unavailable.
    }
  }

  loadChats(projectId: string): Promise<void> {
    const existing = this.inFlightChats.get(projectId);
    if (existing) return existing;

    const promise = (async () => {
      this.setSetValue(this.loadingChats, projectId, true);
      try {
        const chats = await this.api.fetchChats(projectId);
        this.chatsByProject.update((current) => ({ ...current, [projectId]: chats }));
      } catch (error) {
        console.error('Failed to load chats for project', projectId, error);
      } finally {
        this.setSetValue(this.loadingChats, projectId, false);
        this.inFlightChats.delete(projectId);
      }
    })();
    this.inFlightChats.set(projectId, promise);
    return promise;
  }

  findChat(chatId: string): Chat | null {
    for (const chats of Object.values(this.chatsByProject())) {
      const chat = chats.find((candidate) => candidate.id === chatId);
      if (chat) return chat;
    }
    return null;
  }

  async autoConnectChat(chatId: string): Promise<void> {
    const chat = this.findChat(chatId);
    if (!chat) return;
    if (chat.process_state !== 'RUNNING') {
      await this.connectChat(chatId).catch(() => undefined);
    } else if (!this.configLoadedByChat()[chatId]) {
      await this.loadChatConfig(chatId).catch(() => undefined);
    }
  }

  loadChatConfig(chatId: string): Promise<ConfigOption[]> {
    const existing = this.inFlightConfigs.get(chatId);
    if (existing) return existing;

    const promise = (async () => {
      this.setSetValue(this.connectingChats, chatId, true);
      this.clearError(chatId);
      try {
        const options = this.normalizeConfigOptions(await this.api.fetchChatConfig(chatId));
        this.configOptionsByChat.update((current) => ({ ...current, [chatId]: options }));
        this.configLoadedByChat.update((current) => ({ ...current, [chatId]: true }));
        return options;
      } catch (error) {
        this.setError(chatId, this.errorMessage(error, 'Failed to load agent configuration'));
        throw error;
      } finally {
        this.setSetValue(this.connectingChats, chatId, false);
        this.inFlightConfigs.delete(chatId);
      }
    })();
    this.inFlightConfigs.set(chatId, promise);
    return promise;
  }

  retryConnection(chatId: string): Promise<void> {
    const chat = this.findChat(chatId);
    if (chat?.process_state === 'RUNNING') {
      return this.loadChatConfig(chatId).then(() => undefined).catch(() => undefined);
    }
    return this.connectChat(chatId).then(() => undefined).catch(() => undefined);
  }

  connectChat(chatId: string): Promise<Chat> {
    const existing = this.inFlightConnections.get(chatId);
    if (existing) return existing;

    const promise = (async () => {
      this.setSetValue(this.connectingChats, chatId, true);
      this.clearError(chatId);
      try {
        let updated: Chat;
        try {
          updated = await this.api.resumeChat(chatId);
        } catch (error) {
          const currentChat = this.findChat(chatId);
          if (!currentChat || currentChat.process_state !== 'RUNNING') {
            this.setError(chatId, this.errorMessage(error, 'Failed to connect to agent'));
          }
          throw error;
        }

        this.applyChatPatch(chatId, updated);
        this.clearError(chatId);
        try {
          await this.fetchConfig(chatId);
        } catch (error) {
          this.setError(chatId, this.errorMessage(error, 'Failed to load agent configuration'));
          throw error;
        }
        return updated;
      } finally {
        this.setSetValue(this.connectingChats, chatId, false);
        this.inFlightConnections.delete(chatId);
      }
    })();
    this.inFlightConnections.set(chatId, promise);
    return promise;
  }

  async fetchConfig(chatId: string): Promise<ConfigOption[]> {
    const options = this.normalizeConfigOptions(await this.api.fetchChatConfig(chatId));
    this.configOptionsByChat.update((current) => ({ ...current, [chatId]: options }));
    this.configLoadedByChat.update((current) => ({ ...current, [chatId]: true }));
    return options;
  }

  async sendPrompt(chatId: string, text: string): Promise<void> {
    await this.api.promptChat(chatId, text);
    this.applyChatPatch(chatId, { turn_state: 'PROMPTING' });
  }

  async cancelActiveTurn(chatId: string): Promise<void> {
    await this.api.cancelChat(chatId);
    this.applyChatPatch(chatId, { turn_state: 'CANCELLING' });
  }

  async stopChatProcess(chatId: string): Promise<void> {
    await this.api.stopChat(chatId);
    this.applyChatPatch(chatId, { process_state: 'STOPPED', turn_state: 'IDLE' });
  }

  async setChatPolicy(chatId: string, policy: PermissionPolicy): Promise<void> {
    this.applyChatPatch(chatId, await this.api.editChat(chatId, { permission_policy: policy }));
  }

  async renameChat(chatId: string, title: string): Promise<void> {
    this.applyChatPatch(chatId, await this.api.editChat(chatId, { title }));
  }

  async archiveChat(chatId: string, archived: boolean): Promise<void> {
    this.applyChatPatch(chatId, await this.api.editChat(chatId, { archived }));
  }

  async deleteChat(chatId: string): Promise<void> {
    const chat = this.findChat(chatId);
    await this.api.deleteChat(chatId);
    this.chatsByProject.update((current) => {
      const next = { ...current };
      for (const [projectId, chats] of Object.entries(next)) {
        next[projectId] = chats.filter((candidate) => candidate.id !== chatId);
      }
      return next;
    });
    this.removeChatState(chatId);
    if (this.activeChatId() === chatId) {
      void this.router.navigate(chat?.project_id ? ['/projects', chat.project_id] : ['/']);
    }
  }

  async setChatConfig(chatId: string, optionId: string, value: unknown): Promise<void> {
    const options = this.normalizeConfigOptions(await this.api.setChatConfig(chatId, optionId, value));
    this.configOptionsByChat.update((current) => ({ ...current, [chatId]: options }));
    this.configLoadedByChat.update((current) => ({ ...current, [chatId]: true }));
  }

  async createProject(name: string, path: string): Promise<Project> {
    const created = await this.api.createProject(name, path);
    this.projects.update((projects) => [created, ...projects]);
    return created;
  }

  async cloneProject(input: CloneProjectInput): Promise<Project> {
    const created = await this.api.cloneProject(input);
    this.projects.update((projects) => [created, ...projects.filter((project) => project.id !== created.id)]);
    return created;
  }

  async createChat(projectId: string, agent: string, title?: string): Promise<Chat> {
    const created = await this.api.createChat(projectId, agent, title);
    this.chatsByProject.update((current) => ({
      ...current,
      [projectId]: [...(current[projectId] ?? []), created],
    }));
    this.projects.update((projects) =>
      projects.map((project) =>
        project.id === projectId
          ? { ...project, chat_count: (project.chat_count ?? 0) + 1 }
          : project,
      ),
    );
    return created;
  }

  async editProject(id: string, name: string, path: string): Promise<Project> {
    const updated = await this.api.editProject(id, name, path);
    this.projects.update((projects) =>
      projects.map((project) => (project.id === id ? { ...project, ...updated } : project)),
    );
    return updated;
  }

  async deleteProject(id: string): Promise<void> {
    await this.api.deleteProject(id);
    this.projects.update((projects) => projects.filter((project) => project.id !== id));
    this.chatsByProject.update((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
    if (this.activeProjectId() === id) {
      this.activeProjectId.set(null);
      this.activeChatId.set(null);
      void this.router.navigate(['/']);
    }
  }

  respondPermission(chatId: string, requestId: string, granted: boolean): Promise<void> {
    return this.api.respondPermission(chatId, requestId, granted);
  }

  private async initialize(): Promise<void> {
    if (typeof window === 'undefined') return;
    await Promise.all([this.loadProjects(), this.loadAgents()]);
  }

  private syncRoute(url: string): void {
    const parts = url.split('?')[0].replace(/\/+$/, '').split('/').filter(Boolean);
    const projectId = parts[0] === 'projects' ? parts[1] ?? null : null;
    const chatId = projectId && parts[2] === 'chats' ? parts[3] ?? null : null;
    this.activeProjectId.set(projectId);
    this.activeChatId.set(chatId);
    if (!projectId) {
      this.setMobileDrawerOpen(false);
      return;
    }
    void this.loadChats(projectId).then(() => {
      if (chatId) void this.autoConnectChat(chatId);
    });
  }

  private handleIncomingEvent(event: SessionEvent): void {
    const { session_id: sessionId, payload } = event;
    if (payload.type === 'metadata_changed') {
      void this.loadProjects();
      for (const projectId of Object.keys(this.chatsByProject())) void this.loadChats(projectId);
      return;
    }

    if (payload.type === 'config_options' && sessionId) {
      const options = this.normalizeConfigOptions(payload.options);
      this.configOptionsByChat.update((current) => ({ ...current, [sessionId]: options }));
      this.configLoadedByChat.update((current) => ({ ...current, [sessionId]: true }));
      return;
    }

    if (!sessionId) return;
    const reducers = { ...this.reducersByChat() };
    const reducer = reducers[sessionId] ?? new EventReducer();
    reducer.ingest(event);
    reducers[sessionId] = reducer;
    this.reducersByChat.set(reducers);

    if (payload.type === 'state_change') {
      const process = this.processState(payload.process);
      const turn = this.turnState(payload.turn);
      this.applyChatPatch(sessionId, {
        ...(process ? { process_state: process } : {}),
        ...(turn ? { turn_state: turn } : {}),
      });
    }
  }

  private applyChatPatch(chatId: string, patch: Partial<Chat>): void {
    this.chatsByProject.update((current) => {
      const next = { ...current };
      for (const [projectId, chats] of Object.entries(next)) {
        next[projectId] = chats.map((chat) => (chat.id === chatId ? { ...chat, ...patch } : chat));
      }
      return next;
    });
  }

  private removeChatState(chatId: string): void {
    this.reducersByChat.update((current) => {
      const next = { ...current };
      delete next[chatId];
      return next;
    });
    this.configOptionsByChat.update((current) => {
      const next = { ...current };
      delete next[chatId];
      return next;
    });
    this.configLoadedByChat.update((current) => {
      const next = { ...current };
      delete next[chatId];
      return next;
    });
    this.connectErrors.update((current) => {
      const next = { ...current };
      delete next[chatId];
      return next;
    });
  }

  private setError(chatId: string, message: string): void {
    this.connectErrors.update((current) => ({ ...current, [chatId]: message }));
  }

  private clearError(chatId: string): void {
    this.connectErrors.update((current) => {
      if (!(chatId in current)) return current;
      const next = { ...current };
      delete next[chatId];
      return next;
    });
  }

  private setSetValue(
    target: WritableSignal<ReadonlySet<string>>,
    value: string,
    present: boolean,
  ): void {
    target.update((current) => {
      const next = new Set(current);
      if (present) next.add(value);
      else next.delete(value);
      return next;
    });
  }

  private normalizeConfigOptions(value: unknown): ConfigOption[] {
    if (!Array.isArray(value)) return [];
    return value.map((raw) => {
      const option = (raw ?? {}) as Record<string, unknown>;
      const rawOptions = Array.isArray(option['options']) ? option['options'] : undefined;
      const options = rawOptions?.map((item) => {
        const entry = (item ?? {}) as Record<string, unknown>;
        if (Array.isArray(entry['options'])) {
          return {
            group: String(entry['group'] ?? entry['name'] ?? ''),
            options: (entry['options'] as unknown[]).map((child) => {
              const valueEntry = (child ?? {}) as Record<string, unknown>;
              return { value: valueEntry['value'], name: String(valueEntry['name'] ?? valueEntry['label'] ?? valueEntry['value'] ?? '') };
            }),
          };
        }
        return { value: entry['value'], name: String(entry['name'] ?? entry['label'] ?? entry['value'] ?? '') };
      });
      return {
        id: String(option['id'] ?? ''),
        name: String(option['name'] ?? option['label'] ?? option['id'] ?? ''),
        type: String(option['type'] ?? ''),
        currentValue: option['currentValue'] ?? option['current_value'],
        description: typeof option['description'] === 'string' ? option['description'] : undefined,
        options,
      };
    });
  }

  private processState(value: unknown): ProcessState | undefined {
    return ['STARTING', 'RUNNING', 'STOPPED', 'DEAD'].includes(String(value))
      ? (String(value) as ProcessState)
      : undefined;
  }

  private turnState(value: unknown): TurnState | undefined {
    return ['IDLE', 'PROMPTING', 'CANCELLING'].includes(String(value))
      ? (String(value) as TurnState)
      : undefined;
  }

  private errorMessage(error: unknown, fallback: string): string {
    return error instanceof Error && error.message ? error.message : fallback;
  }
}
