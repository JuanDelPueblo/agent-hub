import { inject, Service, signal } from '@angular/core';
import { ApiService } from '../core/api/api.service';
import type { AgentSummary, CloneProjectInput, Project } from '../core/api/types';

/** Owns the project collection and installed-agent catalog. */
@Service()
export class ProjectStore {
  private readonly api = inject(ApiService);

  readonly projects = signal<Project[]>([]);
  readonly agents = signal<AgentSummary[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  async loadProjects(): Promise<void> {
    this.loading.set(true);
    try {
      this.projects.set(await this.api.fetchProjects());
      this.error.set(null);
    } catch (error) {
      this.error.set(error instanceof Error && error.message ? error.message : 'Failed to load projects');
      console.error('Failed to load projects', error);
    } finally {
      this.loading.set(false);
    }
  }

  async loadAgents(): Promise<void> {
    try {
      this.agents.set(await this.api.fetchAgents());
    } catch {
      // An unavailable catalog must not be replaced with an authoritative
      // client-side list. The next load can retry the backend source.
      this.agents.set([]);
    }
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
  }

  incrementChatCount(projectId: string): void {
    this.projects.update((projects) =>
      projects.map((project) =>
        project.id === projectId
          ? { ...project, chat_count: (project.chat_count ?? 0) + 1 }
          : project,
      ),
    );
  }

  /** Reflects a remember/forget result immediately, without waiting on the
   * next `loadProjects()`. */
  patchEnvrcState(projectId: string, remembered: boolean, relativePath: string | null): void {
    this.projects.update((projects) =>
      projects.map((project) =>
        project.id === projectId
          ? { ...project, envrc_remembered: remembered, envrc_relative_path: relativePath }
          : project,
      ),
    );
  }

  async forgetProjectEnvrcGrant(projectId: string): Promise<void> {
    await this.api.forgetProjectEnvrcGrant(projectId);
    this.patchEnvrcState(projectId, false, null);
  }
}
