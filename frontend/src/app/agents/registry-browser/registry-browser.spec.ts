import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { RegistryCatalog } from '../../core/api/types';
import { AppStateService } from '../../state/app-state.service';
import { RegistryBrowserComponent } from './registry-browser';

const catalog: RegistryCatalog = {
  status: 'cached',
  source_url: 'https://registry.example.invalid',
  host: 'linux-x86_64',
  rejected: [],
  agents: [
    {
      id: 'example-acp',
      name: 'Example ACP',
      version: '1.2.0',
      description: 'An example.',
      distributions: ['npx'],
      platforms: [],
      installed_as: 'example-acp',
      installed_version: '1.0.0',
      update_available: true,
    },
    {
      id: 'native-agent',
      name: 'Native Agent',
      version: '2.0.0',
      description: 'A native agent.',
      distributions: ['binary'],
      platforms: ['linux-x86_64'],
      selected_distribution: 'binary',
      update_available: false,
    },
    {
      id: 'windows-only',
      name: 'Windows Only',
      version: '1.0.0',
      description: 'Not for this host.',
      distributions: ['binary'],
      platforms: ['windows-x86_64'],
      unsupported_reason: 'No binary distribution covers this platform.',
      update_available: false,
    },
  ],
};

describe('RegistryBrowserComponent', () => {
  let fixture: ComponentFixture<RegistryBrowserComponent>;
  let state: {
    registry: ReturnType<typeof signal<RegistryCatalog | null>>;
    registryLoading: ReturnType<typeof signal<boolean>>;
    registryError: ReturnType<typeof signal<string | null>>;
    loadRegistry: ReturnType<typeof vi.fn>;
    refreshRegistry: ReturnType<typeof vi.fn>;
    installRegistryAgent: ReturnType<typeof vi.fn>;
    updateAgent: ReturnType<typeof vi.fn>;
    removeAgent: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    state = {
      registry: signal<RegistryCatalog | null>(catalog),
      registryLoading: signal(false),
      registryError: signal<string | null>(null),
      loadRegistry: vi.fn(async () => undefined),
      refreshRegistry: vi.fn(async () => undefined),
      installRegistryAgent: vi.fn(async () => ({ id: 'native-agent' })),
      updateAgent: vi.fn(async () => ({ updated: true, from_version: '1.0.0', to_version: '1.2.0', agent: { id: 'example-acp' } })),
      removeAgent: vi.fn(async () => ({ id: 'example-acp', deleted: true, retained_chats: 0 })),
    };

    await TestBed.configureTestingModule({
      imports: [RegistryBrowserComponent],
      providers: [
        { provide: AppStateService, useValue: state },
        { provide: MatDialog, useValue: { open: vi.fn(() => ({ afterClosed: () => of(true) })) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryBrowserComponent);
    fixture.detectChanges();
  });

  function buttonByText(text: string): HTMLButtonElement {
    const button = (Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[])
      .find((candidate) => candidate.textContent?.trim().includes(text));
    if (!button) throw new Error(`button not found: ${text}`);
    return button;
  }

  it('lists entries with installed, update, and unsupported state', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Example ACP');
    expect(text).toContain('Installed as example-acp');
    expect(text).toContain('No binary distribution covers this platform.');
  });

  it('searches and refreshes the registry', async () => {
    fixture.componentInstance.query.set('native');
    await fixture.componentInstance.search();
    expect(state.loadRegistry).toHaveBeenCalledWith('native');
    await fixture.componentInstance.refresh();
    expect(state.refreshRegistry).toHaveBeenCalled();
  });

  it('installs an uninstalled entry through the store and reports success', async () => {
    await fixture.componentInstance.install(catalog.agents[1]);
    expect(state.installRegistryAgent).toHaveBeenCalledWith(expect.objectContaining({
      registry_id: 'native-agent',
      distribution: 'binary',
    }));
    expect(fixture.componentInstance.notice()).toContain('Installed Native Agent');
  });

  it('updates an installed entry and reports when it is already current', async () => {
    await fixture.componentInstance.update(catalog.agents[0]);
    expect(state.updateAgent).toHaveBeenCalledWith('example-acp');

    state.updateAgent.mockResolvedValueOnce({ updated: false, from_version: '1.2.0', to_version: '1.2.0', agent: { id: 'example-acp' } });
    await fixture.componentInstance.update(catalog.agents[0]);
    expect(fixture.componentInstance.notice()).toContain('already at the newest version');
  });

  it('confirms before uninstalling an installed entry', async () => {
    await fixture.componentInstance.uninstall(catalog.agents[0]);
    expect(state.removeAgent).toHaveBeenCalledWith('example-acp');
  });

  it('surfaces install errors', async () => {
    state.installRegistryAgent.mockRejectedValueOnce(new Error('integrity check failed'));
    await fixture.componentInstance.install(catalog.agents[1]);
    expect(fixture.componentInstance.actionError()).toContain('integrity check failed');
  });

  it('never offers an install control for an unsupported entry', () => {
    const installButtons = (Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[])
      .filter((button) => button.textContent?.trim() === 'Install');
    expect(installButtons).toHaveLength(1);
  });
});
