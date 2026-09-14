import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import type {
  Chat,
  CloneProjectInput,
  ConfigOption,
  DirectoryListing,
  PermissionPolicy,
  Project,
  ChatWorkspaceSelection,
  WorkspaceOptions,
  ChatHistoryPage,
} from './types';

export interface AgentStatus {
  name: string;
  process_state: string;
  turn_state: string;
}

export interface StatusResponse {
  agents: AgentStatus[];
  project_root: string;
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly code?: string,
    readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

@Service()
export class ApiService {
  private readonly http = inject(HttpClient);

  private async request<T>(path: string, options: { method?: string; body?: unknown } = {}) {
    try {
      return await firstValueFrom(
        this.http.request<T>(options.method ?? 'GET', path, {
          body: options.body,
        }),
      );
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        let message = `Request failed: ${error.status} ${error.statusText}`;
        if (error.error && typeof error.error.error === 'string') {
          message = error.error.error;
        }
        const code = typeof error.error?.code === 'string' ? error.error.code : undefined;
        const details = error.error?.details && typeof error.error.details === 'object'
          ? error.error.details as Record<string, unknown>
          : undefined;
        throw new ApiError(error.status, message, code, details);
      }
      throw error;
    }
  }

  fetchProjects(): Promise<Project[]> {
    return this.request<Project[]>('/api/projects');
  }

  createProject(name: string, path: string): Promise<Project> {
    return this.request<Project>('/api/projects', {
      method: 'POST',
      body: { name, path },
    });
  }

  editProject(id: string, name: string, path: string): Promise<Project> {
    return this.request<Project>(`/api/projects/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: { name, path },
    });
  }

  async deleteProject(id: string): Promise<void> {
    await this.request(`/api/projects/${encodeURIComponent(id)}`, { method: 'DELETE' });
  }

  cloneProject(input: CloneProjectInput): Promise<Project> {
    return this.request<Project>('/api/projects/clone', { method: 'POST', body: input });
  }

  fetchDirectories(path?: string): Promise<DirectoryListing> {
    const url = path
      ? `/api/filesystem/directories?path=${encodeURIComponent(path)}`
      : '/api/filesystem/directories';
    return this.request<DirectoryListing>(url);
  }

  fetchChats(projectId: string): Promise<Chat[]> {
    return this.request<Chat[]>(`/api/projects/${encodeURIComponent(projectId)}/chats`);
  }

  fetchWorkspaceOptions(projectId: string): Promise<WorkspaceOptions> {
    return this.request<WorkspaceOptions>(`/api/projects/${encodeURIComponent(projectId)}/workspace-options`);
  }

  createChat(projectId: string, agent: string, title?: string, workspace?: ChatWorkspaceSelection): Promise<Chat> {
    return this.request<Chat>(`/api/projects/${encodeURIComponent(projectId)}/chats`, {
      method: 'POST',
      body: { agent, title: title || undefined, ...(workspace ? { workspace } : {}) },
    });
  }

  fetchChat(chatId: string): Promise<Chat> {
    return this.request<Chat>(`/api/chats/${encodeURIComponent(chatId)}`);
  }

  fetchChatHistory(chatId: string, beforeSeq?: number, throughSeq?: number): Promise<ChatHistoryPage> {
    const params = new URLSearchParams();
    if (beforeSeq !== undefined) params.set('before_seq', String(beforeSeq));
    if (throughSeq !== undefined) params.set('through_seq', String(throughSeq));
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<ChatHistoryPage>(
      `/api/chats/${encodeURIComponent(chatId)}/history${query}`,
    );
  }

  editChat(
    chatId: string,
    edit: { title?: string; archived?: boolean; permission_policy?: PermissionPolicy },
  ): Promise<Chat> {
    return this.request<Chat>(`/api/chats/${encodeURIComponent(chatId)}`, {
      method: 'PATCH',
      body: edit,
    });
  }

  async deleteChat(chatId: string): Promise<void> {
    await this.request(`/api/chats/${encodeURIComponent(chatId)}`, { method: 'DELETE' });
  }

  async promptChat(chatId: string, text: string): Promise<void> {
    await this.request(`/api/chats/${encodeURIComponent(chatId)}/prompt`, {
      method: 'POST',
      body: { text },
    });
  }

  resumeChat(chatId: string): Promise<Chat> {
    return this.request<Chat>(`/api/chats/${encodeURIComponent(chatId)}/resume`, {
      method: 'POST',
    });
  }

  async stopChat(chatId: string): Promise<void> {
    await this.request(`/api/chats/${encodeURIComponent(chatId)}/stop`, { method: 'POST' });
  }

  async cancelChat(chatId: string): Promise<void> {
    await this.request(`/api/chats/${encodeURIComponent(chatId)}/cancel`, { method: 'POST' });
  }

  async respondPermission(chatId: string, id: string, granted: boolean): Promise<void> {
    await this.request(`/api/chats/${encodeURIComponent(chatId)}/permission`, {
      method: 'POST',
      body: { id, granted },
    });
  }

  fetchChatConfig(chatId: string): Promise<ConfigOption[]> {
    return this.request<ConfigOption[]>(`/api/chats/${encodeURIComponent(chatId)}/config`);
  }

  setChatConfig(chatId: string, optionId: string, value: unknown): Promise<ConfigOption[]> {
    return this.request<ConfigOption[]>(`/api/chats/${encodeURIComponent(chatId)}/config`, {
      method: 'PATCH',
      body: { id: optionId, value },
    });
  }

  async clearSavedConfig(chatId: string, optionId: string): Promise<void> {
    await this.request(`/api/chats/${encodeURIComponent(chatId)}/config/${encodeURIComponent(optionId)}`, {
      method: 'DELETE',
    });
  }

  fetchAgents(): Promise<string[]> {
    return this.request<string[]>('/api/agents');
  }

  fetchStatus(): Promise<StatusResponse> {
    return this.request<StatusResponse>('/api/status');
  }
}
