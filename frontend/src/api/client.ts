import type {
  Project,
  Chat,
  ConfigOption,
  DirectoryListing,
  CloneProjectInput,
  PermissionPolicy,
} from './types.ts';

export class ApiError extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (options.body && typeof options.body === 'string' && !headers.has('content-type')) {
    headers.set('content-type', 'application/json');
  }

  const res = await fetch(path, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorMsg = `Request failed: ${res.status} ${res.statusText}`;
    try {
      const data = await res.json();
      if (data && data.error) {
        errorMsg = data.error;
      }
    } catch {
      // ignore
    }
    throw new ApiError(res.status, errorMsg);
  }

  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return null as T;
  }

  return res.json();
}

export const api = {
  // Projects
  async fetchProjects(): Promise<Project[]> {
    return request<Project[]>('/api/projects');
  },

  async createProject(name: string, path: string): Promise<Project> {
    return request<Project>('/api/projects', {
      method: 'POST',
      body: JSON.stringify({ name, path }),
    });
  },

  async editProject(id: string, name: string, path: string): Promise<Project> {
    return request<Project>(`/api/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ name, path }),
    });
  },

  async deleteProject(id: string): Promise<void> {
    await request(`/api/projects/${id}`, { method: 'DELETE' });
  },

  async cloneProject(input: CloneProjectInput): Promise<Project> {
    return request<Project>('/api/projects/clone', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  // Filesystem
  async fetchDirectories(path?: string): Promise<DirectoryListing> {
    const url = path
      ? `/api/filesystem/directories?path=${encodeURIComponent(path)}`
      : '/api/filesystem/directories';
    return request<DirectoryListing>(url);
  },

  // Chats
  async fetchChats(projectId: string): Promise<Chat[]> {
    return request<Chat[]>(`/api/projects/${projectId}/chats`);
  },

  async createChat(projectId: string, agent: string, title?: string): Promise<Chat> {
    return request<Chat>(`/api/projects/${projectId}/chats`, {
      method: 'POST',
      body: JSON.stringify({ agent, title: title || undefined }),
    });
  },

  async fetchChat(chatId: string): Promise<Chat> {
    return request<Chat>(`/api/chats/${chatId}`);
  },

  async editChat(
    chatId: string,
    edit: { title?: string; archived?: boolean; permission_policy?: PermissionPolicy }
  ): Promise<Chat> {
    return request<Chat>(`/api/chats/${chatId}`, {
      method: 'PATCH',
      body: JSON.stringify(edit),
    });
  },

  async deleteChat(chatId: string): Promise<void> {
    await request(`/api/chats/${chatId}`, { method: 'DELETE' });
  },

  async promptChat(chatId: string, text: string): Promise<void> {
    await request(`/api/chats/${chatId}/prompt`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },

  async resumeChat(chatId: string): Promise<Chat> {
    return request<Chat>(`/api/chats/${chatId}/resume`, { method: 'POST' });
  },

  async stopChat(chatId: string): Promise<void> {
    await request(`/api/chats/${chatId}/stop`, { method: 'POST' });
  },

  async cancelChat(chatId: string): Promise<void> {
    await request(`/api/chats/${chatId}/cancel`, { method: 'POST' });
  },

  async respondPermission(
    chatId: string,
    id: string,
    granted: boolean
  ): Promise<void> {
    await request(`/api/chats/${chatId}/permission`, {
      method: 'POST',
      body: JSON.stringify({
        id,
        granted,
      }),
    });
  },

  async fetchChatConfig(chatId: string): Promise<ConfigOption[]> {
    return request<ConfigOption[]>(`/api/chats/${chatId}/config`);
  },

  async setChatConfig(
    chatId: string,
    optionId: string,
    value: any
  ): Promise<ConfigOption[]> {
    return request<ConfigOption[]>(`/api/chats/${chatId}/config`, {
      method: 'PATCH',
      body: JSON.stringify({ id: optionId, value }),
    });
  },

  async fetchAgents(): Promise<string[]> {
    return request<string[]>('/api/agents');
  },
};
