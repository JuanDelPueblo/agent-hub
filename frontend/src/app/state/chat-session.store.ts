import { inject, Service, signal, WritableSignal } from '@angular/core';
import { ApiError, ApiService } from '../core/api/api.service';
import type {
  Chat,
  ConfigOption,
  PermissionPolicy,
  ProcessState,
  SessionEvent,
  TurnState,
} from '../core/api/types';
import { deriveChatActivity, type ChatActivity } from './chat-activity';
import { EventReducer } from './event-reducer';

type ChatMap = Record<string, Chat[]>;
type ConfigMap = Record<string, ConfigOption[]>;
type BooleanMap = Record<string, boolean>;
type ErrorMap = Record<string, string>;

/** Owns chat collections, ACP session state, configuration, and event reduction. */
@Service()
export class ChatSessionStore {
  private readonly api = inject(ApiService);

  readonly chatsByProject = signal<ChatMap>({});
  readonly configOptionsByChat = signal<ConfigMap>({});
  readonly configLoadedByChat = signal<BooleanMap>({});
  readonly reducersByChat = signal<Record<string, EventReducer>>({});
  readonly loadingChats = signal<ReadonlySet<string>>(new Set());
  readonly connectingChats = signal<ReadonlySet<string>>(new Set());
  readonly connectErrors = signal<ErrorMap>({});
  readonly rejectedConfigByChat = signal<Record<string, string>>({});

  private readonly inFlightConnections = new Map<string, Promise<Chat>>();
  private readonly inFlightConfigs = new Map<string, Promise<ConfigOption[]>>();
  private readonly inFlightChats = new Map<string, Promise<void>>();

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
    if (!this.configLoadedByChat()[chatId]) {
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
        this.setConfig(chatId, options);
        return options;
      } catch (error) {
        this.setError(chatId, this.errorMessage(error, 'Failed to load agent configuration'));
        if (error instanceof ApiError && error.code?.toLowerCase() === 'saved_config_rejected') {
          const optionId = error.details?.['option_id'] ?? error.details?.['optionId'];
          if (typeof optionId === 'string') {
            this.rejectedConfigByChat.update((current) => ({ ...current, [chatId]: optionId }));
          }
        }
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
    return this.loadChatConfig(chatId).then(() => undefined).catch(() => undefined);
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
            if (error instanceof ApiError && error.code === 'saved_config_rejected') {
              const optionId = error.details?.['option_id'];
              if (typeof optionId === 'string') {
                this.rejectedConfigByChat.update((current) => ({ ...current, [chatId]: optionId }));
              }
            }
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
    this.setConfig(chatId, options);
    return options;
  }

  async sendPrompt(chatId: string, text: string): Promise<void> {
    try {
      await this.api.promptChat(chatId, text);
      this.clearError(chatId);
      this.applyChatPatch(chatId, { turn_state: 'PROMPTING' });
    } catch (error) {
      if (error instanceof ApiError && error.code?.toLowerCase() === 'saved_config_rejected') {
        const optionId = error.details?.['option_id'] ?? error.details?.['optionId'];
        if (typeof optionId === 'string') {
          this.rejectedConfigByChat.update((current) => ({ ...current, [chatId]: optionId }));
        }
      }
      this.setError(chatId, this.errorMessage(error, 'Failed to send prompt'));
      throw error;
    }
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

  async deleteChat(chatId: string): Promise<Chat | null> {
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
    return chat;
  }

  async setChatConfig(chatId: string, optionId: string, value: unknown): Promise<void> {
    const options = this.normalizeConfigOptions(await this.api.setChatConfig(chatId, optionId, value));
    this.setConfig(chatId, options);
  }

  async resetRejectedConfig(chatId: string): Promise<void> {
    const optionId = this.rejectedConfigByChat()[chatId];
    if (!optionId) return;
    await this.api.clearSavedConfig(chatId, optionId);
    this.rejectedConfigByChat.update((current) => {
      const next = { ...current };
      delete next[chatId];
      return next;
    });
    await this.retryConnection(chatId);
  }

  async createChat(projectId: string, agent: string, title?: string): Promise<Chat> {
    const created = await this.api.createChat(projectId, agent, title);
    this.chatsByProject.update((current) => ({
      ...current,
      [projectId]: [...(current[projectId] ?? []), created],
    }));
    return created;
  }

  respondPermission(chatId: string, requestId: string, granted: boolean): Promise<void> {
    return this.api.respondPermission(chatId, requestId, granted);
  }

  removeProject(projectId: string): void {
    this.chatsByProject.update((current) => {
      const next = { ...current };
      delete next[projectId];
      return next;
    });
  }

  handleIncomingEvent(event: SessionEvent): void {
    const { session_id: sessionId, payload } = event;
    if (payload.type === 'config_options' && sessionId) {
      this.setConfig(sessionId, this.normalizeConfigOptions(payload.options));
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

  resetEventHistory(): void {
    this.reducersByChat.set({});
  }

  /** Central user-facing activity for one chat. Never reads process_state. */
  chatActivity(chatId: string): ChatActivity {
    const chat = this.findChat(chatId);
    const items = this.reducersByChat()[chatId]?.items() ?? [];
    return deriveChatActivity({
      turnState: chat?.turn_state,
      connectError: this.connectErrors()[chatId],
      rejectedConfig: this.rejectedConfigByChat()[chatId],
      items,
    });
  }

  private setConfig(chatId: string, options: ConfigOption[]): void {
    this.configOptionsByChat.update((current) => ({ ...current, [chatId]: options }));
    this.configLoadedByChat.update((current) => ({ ...current, [chatId]: true }));
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
    for (const target of [
      this.reducersByChat,
      this.configOptionsByChat,
      this.configLoadedByChat,
      this.connectErrors,
      this.rejectedConfigByChat,
    ] as WritableSignal<Record<string, unknown>>[]) {
      target.update((current) => {
        const next = { ...current };
        delete next[chatId];
        return next;
      });
    }
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

  private setSetValue(target: WritableSignal<ReadonlySet<string>>, value: string, present: boolean): void {
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
              return {
                value: valueEntry['value'],
                name: String(valueEntry['name'] ?? valueEntry['label'] ?? valueEntry['value'] ?? ''),
              };
            }),
          };
        }
        return {
          value: entry['value'],
          name: String(entry['name'] ?? entry['label'] ?? entry['value'] ?? ''),
        };
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
