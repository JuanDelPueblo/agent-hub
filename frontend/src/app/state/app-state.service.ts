import { computed, inject, Service } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { EventSocketService } from '../core/event-socket.service';
import type { ChatWorkspaceSelection, CloneProjectInput, PermissionPolicy, SessionEvent } from '../core/api/types';
import { EventReducer } from './event-reducer';
import type { ChatActivity } from './chat-activity';
import { ChatSessionStore } from './chat-session.store';
import { ProjectStore } from './project.store';
import { UiStateStore } from './ui-state.store';

/**
 * Coordinates startup, routing, and cross-feature operations. State ownership
 * lives in the project, chat/session, and UI stores; aliases preserve the
 * established view-facing API while components migrate independently.
 */
@Service()
export class AppStateService {
  readonly projectStore = inject(ProjectStore);
  readonly chatStore = inject(ChatSessionStore);
  readonly uiStore = inject(UiStateStore);

  readonly projects = this.projectStore.projects;
  readonly agents = this.projectStore.agents;
  readonly loadingProjects = this.projectStore.loading;
  readonly projectsError = this.projectStore.error;
  readonly chatsByProject = this.chatStore.chatsByProject;
  readonly configOptionsByChat = this.chatStore.configOptionsByChat;
  readonly configLoadedByChat = this.chatStore.configLoadedByChat;
  readonly reducersByChat = this.chatStore.reducersByChat;
  readonly loadingChats = this.chatStore.loadingChats;
  readonly connectingChats = this.chatStore.connectingChats;
  readonly connectErrors = this.chatStore.connectErrors;
  readonly rejectedConfigByChat = this.chatStore.rejectedConfigByChat;
  readonly historyLoadingByChat = this.chatStore.historyLoadingByChat;
  readonly historyHasOlderByChat = this.chatStore.historyHasOlderByChat;
  readonly historyErrors = this.chatStore.historyErrors;
  readonly activeProjectId = this.uiStore.activeProjectId;
  readonly activeChatId = this.uiStore.activeChatId;
  readonly isMobileDrawerOpen = this.uiStore.isMobileDrawerOpen;
  readonly showArchived = this.uiStore.showArchived;

  private readonly socket = inject(EventSocketService);
  private readonly router = inject(Router);
  private readonly emptyReducer = new EventReducer();

  readonly wsStatus = this.socket.status;
  readonly wsError = this.socket.errorMessage;
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
  readonly activeReducer = computed(() => {
    const chatId = this.activeChatId();
    return chatId ? this.reducersByChat()[chatId] ?? this.emptyReducer : this.emptyReducer;
  });

  constructor() {
    this.socket.events.subscribe((event) => this.handleIncomingEvent(event));
    this.socket.replayGaps.subscribe(() => this.chatStore.resetEventHistory());
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.syncRoute(event.urlAfterRedirects));
    this.syncRoute(this.router.url || (typeof window !== 'undefined' ? window.location.pathname : '/'));
    this.socket.connect();
    void this.initialize();
  }

  setMobileDrawerOpen(open: boolean): void { this.uiStore.setMobileDrawerOpen(open); }
  setShowArchived(show: boolean): void { this.uiStore.setShowArchived(show); }
  loadProjects(): Promise<void> { return this.projectStore.loadProjects(); }
  loadAgents(): Promise<void> { return this.projectStore.loadAgents(); }
  loadChats(projectId: string): Promise<void> { return this.chatStore.loadChats(projectId); }
  findChat(chatId: string) { return this.chatStore.findChat(chatId); }
  chatActivity(chatId: string): ChatActivity { return this.chatStore.chatActivity(chatId); }
  autoConnectChat(chatId: string): Promise<void> { return this.chatStore.autoConnectChat(chatId); }
  loadChatHistory(chatId: string): Promise<void> { return this.chatStore.loadChatHistory(chatId); }
  loadOlderHistory(chatId: string): Promise<void> { return this.chatStore.loadOlderHistory(chatId); }
  retryHistory(chatId: string): Promise<void> { return this.chatStore.retryHistory(chatId); }
  loadChatConfig(chatId: string) { return this.chatStore.loadChatConfig(chatId); }
  retryConnection(chatId: string): Promise<void> { return this.chatStore.retryConnection(chatId); }
  resetRejectedConfig(chatId: string): Promise<void> { return this.chatStore.resetRejectedConfig(chatId); }
  connectChat(chatId: string) { return this.chatStore.connectChat(chatId); }
  fetchConfig(chatId: string) { return this.chatStore.fetchConfig(chatId); }
  sendPrompt(chatId: string, text: string): Promise<void> { return this.chatStore.sendPrompt(chatId, text); }
  cancelActiveTurn(chatId: string): Promise<void> { return this.chatStore.cancelActiveTurn(chatId); }
  stopChatProcess(chatId: string): Promise<void> { return this.chatStore.stopChatProcess(chatId); }
  setChatPolicy(chatId: string, policy: PermissionPolicy): Promise<void> { return this.chatStore.setChatPolicy(chatId, policy); }
  renameChat(chatId: string, title: string): Promise<void> { return this.chatStore.renameChat(chatId, title); }
  archiveChat(chatId: string, archived: boolean): Promise<void> { return this.chatStore.archiveChat(chatId, archived); }

  async deleteChat(chatId: string): Promise<void> {
    const chat = await this.chatStore.deleteChat(chatId);
    if (this.activeChatId() === chatId) {
      void this.router.navigate(chat?.project_id ? ['/projects', chat.project_id] : ['/']);
    }
  }

  setChatConfig(chatId: string, optionId: string, value: unknown): Promise<void> {
    return this.chatStore.setChatConfig(chatId, optionId, value);
  }

  createProject(name: string, path: string) { return this.projectStore.createProject(name, path); }
  cloneProject(input: CloneProjectInput) { return this.projectStore.cloneProject(input); }

  async createChat(projectId: string, agent: string, title?: string, workspace?: ChatWorkspaceSelection) {
    const created = await this.chatStore.createChat(projectId, agent, title, workspace);
    this.projectStore.incrementChatCount(projectId);
    return created;
  }

  editProject(id: string, name: string, path: string) {
    return this.projectStore.editProject(id, name, path);
  }

  async deleteProject(id: string): Promise<void> {
    await this.projectStore.deleteProject(id);
    this.chatStore.removeProject(id);
    if (this.activeProjectId() === id) {
      this.uiStore.setRoute(null, null);
      void this.router.navigate(['/']);
    }
  }

  respondPermission(chatId: string, requestId: string, granted: boolean): Promise<void> {
    return this.chatStore.respondPermission(chatId, requestId, granted);
  }

  private async initialize(): Promise<void> {
    if (typeof window === 'undefined') return;
    await Promise.all([this.loadProjects(), this.loadAgents()]);
  }

  private syncRoute(url: string): void {
    const parts = url.split('?')[0].replace(/\/+$/, '').split('/').filter(Boolean);
    const projectId = parts[0] === 'projects' ? parts[1] ?? null : null;
    const chatId = projectId && parts[2] === 'chats' ? parts[3] ?? null : null;
    this.uiStore.setRoute(projectId, chatId);
    if (!projectId) {
      this.setMobileDrawerOpen(false);
      return;
    }
    void this.loadChats(projectId).then(() => {
      if (chatId) void this.autoConnectChat(chatId);
    });
  }

  private handleIncomingEvent(event: SessionEvent): void {
    if (event.payload.type === 'metadata_changed') {
      void this.loadProjects();
      for (const projectId of Object.keys(this.chatsByProject())) void this.loadChats(projectId);
      return;
    }
    this.chatStore.handleIncomingEvent(event);
  }
}
