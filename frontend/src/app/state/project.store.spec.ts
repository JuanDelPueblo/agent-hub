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
