import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let api: ApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    api = TestBed.inject(ApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('preserves the project REST contract', async () => {
    const promise = api.fetchProjects();
    const request = http.expectOne('/api/projects');
    expect(request.request.method).toBe('GET');
    request.flush([{ id: 'p1', name: 'Hub', path: '/work', created_at: 'a', updated_at: 'b' }]);
    await expect(promise).resolves.toHaveLength(1);
  });

  it('serializes prompt payloads and URL-encodes chat ids', async () => {
    const promise = api.promptChat('chat/a', 'hello');
    const request = http.expectOne('/api/chats/chat%2Fa/prompt');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ text: 'hello' });
    request.flush(null);
    await expect(promise).resolves.toBeUndefined();
  });
});
