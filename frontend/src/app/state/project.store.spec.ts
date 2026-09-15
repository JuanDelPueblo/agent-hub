import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiService } from '../core/api/api.service';
import { ProjectStore } from './project.store';

describe('ProjectStore agent catalog', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('loads backend-provided summaries without a client-side name fallback', async () => {
    const api = { fetchAgents: vi.fn(async () => [{
      id: 'custom', display_name: 'Custom ACP', source: 'declarative',
      availability: 'available', metadata: { version: 1 },
    }]) };
    TestBed.configureTestingModule({ providers: [
      { provide: ApiService, useValue: api },
    ] });
    const store = TestBed.inject(ProjectStore);

    await store.loadAgents();

    expect(store.agents()).toEqual([expect.objectContaining({ id: 'custom', display_name: 'Custom ACP' })]);
  });

  it('clears the catalog when the backend is unavailable', async () => {
    const api = { fetchAgents: vi.fn(async () => { throw new Error('offline'); }) };
    TestBed.configureTestingModule({ providers: [
      { provide: ApiService, useValue: api },
    ] });
    const store = TestBed.inject(ProjectStore);

    await store.loadAgents();

    expect(store.agents()).toEqual([]);
  });
});

describe('ProjectStore envrc grant state', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('patches envrc state locally without waiting on a refetch', async () => {
    const api = { fetchProjects: vi.fn(async () => [
      { id: 'project-1', name: 'p', path: '/p', created_at: 'now', updated_at: 'now' },
    ]) };
    TestBed.configureTestingModule({ providers: [
      { provide: ApiService, useValue: api },
    ] });
    const store = TestBed.inject(ProjectStore);
    await store.loadProjects();

    store.patchEnvrcState('project-1', true, '.envrc');
    expect(store.projects()[0]).toMatchObject({ envrc_remembered: true, envrc_relative_path: '.envrc' });

    store.patchEnvrcState('project-1', false, null);
    expect(store.projects()[0]).toMatchObject({ envrc_remembered: false, envrc_relative_path: null });
  });

  it('forgetProjectEnvrcGrant calls the API then patches state', async () => {
    const forgetProjectEnvrcGrant = vi.fn(async () => undefined);
    const api = {
      fetchProjects: vi.fn(async () => [
        { id: 'project-1', name: 'p', path: '/p', created_at: 'now', updated_at: 'now', envrc_remembered: true, envrc_relative_path: '.envrc' },
      ]),
      forgetProjectEnvrcGrant,
    };
    TestBed.configureTestingModule({ providers: [
      { provide: ApiService, useValue: api },
    ] });
    const store = TestBed.inject(ProjectStore);
    await store.loadProjects();

    await store.forgetProjectEnvrcGrant('project-1');

    expect(forgetProjectEnvrcGrant).toHaveBeenCalledWith('project-1');
    expect(store.projects()[0]).toMatchObject({ envrc_remembered: false, envrc_relative_path: null });
  });
});
