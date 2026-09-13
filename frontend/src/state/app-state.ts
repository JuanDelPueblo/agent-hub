import { api } from '../api/client.ts';
import type {
  Project,
  Chat,
  ConfigOption,
  PermissionPolicy,
  SessionEvent,
} from '../api/types.ts';
import { EventReducer } from './event-reducer.ts';
import { WebSocketClient } from '../api/websocket.ts';
import { router } from '../router.ts';

export type StateListener = () => void;

export class AppStore {
  public projects: Project[] = [];
  public chatsByProject: Record<string, Chat[]> = {};
  public activeProjectId: string | null = null;
  public activeChatId: string | null = null;
  public configOptionsByChat: Record<string, ConfigOption[]> = {};
  public reducersByChat: Record<string, EventReducer> = {};
  public wsStatus: 'connected' | 'connecting' | 'disconnected' = 'connecting';
  public agents: string[] = ['codex', 'claude', 'opencode', 'antigravity'];
  public isMobileDrawerOpen = false;
  public isConfigOpen = false;
  public showArchived = false;

  public connectingChats: Set<string> = new Set();
  public connectErrors: Record<string, string> = {};
  private inFlightConnections: Map<string, Promise<Chat | void>> = new Map();

  private listeners: Set<StateListener> = new Set();
  private ws: WebSocketClient;

  constructor() {
    this.ws = new WebSocketClient();
    this.ws.onStatus((status) => {
      this.wsStatus = status;
      this.notify();
    });

    this.ws.onEvent((ev) => {
      this.handleIncomingEvent(ev);
    });

    router.subscribe((route) => {
      if (route.name === 'home') {
        this.activeProjectId = null;
        this.activeChatId = null;
        this.notify();
      } else if (route.name === 'project') {
        this.activeProjectId = route.projectId;
        this.activeChatId = null;
        this.loadChats(route.projectId);
        this.notify();
      } else if (route.name === 'chat') {
        this.activeProjectId = route.projectId;
        this.activeChatId = route.chatId;
        this.loadChats(route.projectId).then(() => {
          this.autoConnectActiveChat();
        });
        this.notify();
      }
    });

    this.init();
  }

  private async init() {
    if (typeof window === 'undefined') return;
    await Promise.all([this.loadProjects(), this.loadAgents()]);
    // The router subscription handles the initial route and its chat loading / auto-connection.
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    for (const l of this.listeners) {
      l();
    }
  }

  public get activeChat(): Chat | null {
    if (!this.activeProjectId || !this.activeChatId) return null;
    const chats = this.chatsByProject[this.activeProjectId] || [];
    return chats.find((c) => c.id === this.activeChatId) || null;
  }

  public get activeProject(): Project | null {
    if (!this.activeProjectId) return null;
    return this.projects.find((p) => p.id === this.activeProjectId) || null;
  }

  public get activeReducer(): EventReducer {
    if (!this.activeChatId) {
      return new EventReducer();
    }
    if (!this.reducersByChat[this.activeChatId]) {
      this.reducersByChat[this.activeChatId] = new EventReducer();
    }
    return this.reducersByChat[this.activeChatId];
  }

  public async loadProjects() {
    try {
      this.projects = await api.fetchProjects();
      this.notify();
    } catch (e) {
      console.error('Failed to load projects', e);
    }
  }

  public async loadAgents() {
    try {
      this.agents = await api.fetchAgents();
      this.notify();
    } catch {
      // fallback
    }
  }

  public async loadChats(projectId: string) {
    try {
      const chats = await api.fetchChats(projectId);
      this.chatsByProject[projectId] = chats;
      this.notify();
    } catch (e) {
      console.error('Failed to load chats for project', projectId, e);
    }
  }

  public async autoConnectActiveChat() {
    const chat = this.activeChat;
    if (!chat) return;

    if (this.inFlightConnections.has(chat.id)) {
      return this.inFlightConnections.get(chat.id);
    }

    // Check if stopped or dead or starting
    if (chat.process_state !== 'RUNNING') {
      try {
        await this.connectChat(chat.id);
      } catch {
        // Handled in connectChat
      }
    } else {
      // Fetch current config options if already running
      this.fetchConfig(chat.id);
    }
  }

  public connectChat(chatId: string): Promise<Chat | void> {
    const existing = this.inFlightConnections.get(chatId);
    if (existing) {
      return existing;
    }

    const promise = (async () => {
      this.connectingChats.add(chatId);
      delete this.connectErrors[chatId];
      this.notify();

      try {
        const updated = await api.resumeChat(chatId);
        if (this.activeProjectId && this.chatsByProject[this.activeProjectId]) {
          this.chatsByProject[this.activeProjectId] = this.chatsByProject[
            this.activeProjectId
          ].map((c) => (c.id === chatId ? { ...c, ...updated } : c));
        }
        delete this.connectErrors[chatId];
        await this.fetchConfig(chatId);
        return updated;
      } catch (err: any) {
        const currentChat = this.chatsByProject[this.activeProjectId || '']?.find(
          (c) => c.id === chatId
        );
        if (!currentChat || currentChat.process_state !== 'RUNNING') {
          this.connectErrors[chatId] = err?.message || 'Failed to connect to agent';
        }
        throw err;
      } finally {
        this.connectingChats.delete(chatId);
        this.inFlightConnections.delete(chatId);
        this.notify();
      }
    })();

    this.inFlightConnections.set(chatId, promise);
    return promise;
  }

  public async fetchConfig(chatId: string) {
    try {
      const options = await api.fetchChatConfig(chatId);
      this.configOptionsByChat[chatId] = options;
      this.notify();
    } catch {
      // ignore
    }
  }

  public async sendPrompt(chatId: string, text: string) {
    await api.promptChat(chatId, text);
    // Optimistically update turn state to PROMPTING
    if (this.activeProjectId && this.chatsByProject[this.activeProjectId]) {
      this.chatsByProject[this.activeProjectId] = this.chatsByProject[
        this.activeProjectId
      ].map((c) => (c.id === chatId ? { ...c, turn_state: 'PROMPTING' } : c));
      this.notify();
    }
  }

  public async cancelActiveTurn(chatId: string) {
    await api.cancelChat(chatId);
    if (this.activeProjectId && this.chatsByProject[this.activeProjectId]) {
      this.chatsByProject[this.activeProjectId] = this.chatsByProject[
        this.activeProjectId
      ].map((c) => (c.id === chatId ? { ...c, turn_state: 'CANCELLING' } : c));
      this.notify();
    }
  }

  public async stopChatProcess(chatId: string) {
    await api.stopChat(chatId);
    if (this.activeProjectId && this.chatsByProject[this.activeProjectId]) {
      this.chatsByProject[this.activeProjectId] = this.chatsByProject[
        this.activeProjectId
      ].map((c) =>
        c.id === chatId
          ? { ...c, process_state: 'STOPPED', turn_state: 'IDLE' }
          : c
      );
      this.notify();
    }
  }

  public async setChatPolicy(chatId: string, policy: PermissionPolicy) {
    const updated = await api.editChat(chatId, { permission_policy: policy });
    if (this.activeProjectId && this.chatsByProject[this.activeProjectId]) {
      this.chatsByProject[this.activeProjectId] = this.chatsByProject[
        this.activeProjectId
      ].map((c) => (c.id === chatId ? { ...c, ...updated } : c));
      this.notify();
    }
  }

  public async renameChat(chatId: string, title: string) {
    const updated = await api.editChat(chatId, { title });
    if (this.activeProjectId && this.chatsByProject[this.activeProjectId]) {
      this.chatsByProject[this.activeProjectId] = this.chatsByProject[
        this.activeProjectId
      ].map((c) => (c.id === chatId ? { ...c, ...updated } : c));
      this.notify();
    }
  }

  public async archiveChat(chatId: string, archived: boolean) {
    const updated = await api.editChat(chatId, { archived });
    if (this.activeProjectId && this.chatsByProject[this.activeProjectId]) {
      this.chatsByProject[this.activeProjectId] = this.chatsByProject[
        this.activeProjectId
      ].map((c) => (c.id === chatId ? { ...c, ...updated } : c));
      this.notify();
    }
  }

  public async deleteChat(chatId: string) {
    await api.deleteChat(chatId);
    if (this.activeProjectId && this.chatsByProject[this.activeProjectId]) {
      this.chatsByProject[this.activeProjectId] = this.chatsByProject[
        this.activeProjectId
      ].filter((c) => c.id !== chatId);
    }
    delete this.reducersByChat[chatId];
    delete this.configOptionsByChat[chatId];
    if (this.activeChatId === chatId) {
      if (this.activeProjectId) {
        router.navigate(`/projects/${this.activeProjectId}`);
      } else {
        router.navigate('/');
      }
    }
    this.notify();
  }

  public async setChatConfig(chatId: string, optionId: string, value: any) {
    const options = await api.setChatConfig(chatId, optionId, value);
    this.configOptionsByChat[chatId] = options;
    this.notify();
  }

  public async createProject(name: string, path: string): Promise<Project> {
    const created = await api.createProject(name, path);
    this.projects = [created, ...this.projects];
    this.notify();
    return created;
  }

  public async createChat(projectId: string, agent: string): Promise<Chat> {
    const created = await api.createChat(projectId, agent);
    if (!this.chatsByProject[projectId]) {
      this.chatsByProject[projectId] = [];
    }
    this.chatsByProject[projectId] = [...this.chatsByProject[projectId], created];
    this.projects = this.projects.map((p) =>
      p.id === projectId ? { ...p, chat_count: (p.chat_count || 0) + 1 } : p
    );
    this.notify();
    return created;
  }

  public async editProject(
    id: string,
    name: string,
    path: string
  ): Promise<Project> {
    const updated = await api.editProject(id, name, path);
    this.projects = this.projects.map((p) =>
      p.id === id ? { ...p, ...updated } : p
    );
    this.notify();
    return updated;
  }

  public async deleteProject(id: string): Promise<void> {
    await api.deleteProject(id);
    this.projects = this.projects.filter((p) => p.id !== id);
    delete this.chatsByProject[id];
    if (this.activeProjectId === id) {
      this.activeProjectId = null;
      this.activeChatId = null;
      router.navigate('/');
    }
    this.notify();
  }

  public async respondPermission(
    chatId: string,
    requestId: string,
    granted: boolean
  ) {
    await api.respondPermission(chatId, requestId, granted);
  }

  private handleIncomingEvent(ev: SessionEvent) {
    const { session_id, payload } = ev;

    if (payload.type === 'metadata_changed') {
      this.loadProjects();
      for (const pid of Object.keys(this.chatsByProject)) {
        this.loadChats(pid);
      }
      if (this.activeProjectId && !this.chatsByProject[this.activeProjectId]) {
        this.loadChats(this.activeProjectId);
      }
      return;
    }

    if (payload.type === 'config_options') {
      if (session_id) {
        this.configOptionsByChat[session_id] = payload.options || [];
        this.notify();
      }
      return;
    }

    if (session_id) {
      if (!this.reducersByChat[session_id]) {
        this.reducersByChat[session_id] = new EventReducer();
      }
      this.reducersByChat[session_id].ingest(ev);

      if (payload.type === 'state_change') {
        for (const pid of Object.keys(this.chatsByProject)) {
          this.chatsByProject[pid] = this.chatsByProject[pid].map((c) => {
            if (c.id === session_id) {
              return {
                ...c,
                process_state: payload.process || c.process_state,
                turn_state: payload.turn || c.turn_state,
              };
            }
            return c;
          });
        }
      }
      this.notify();
    }
  }
}

export const store = new AppStore();
