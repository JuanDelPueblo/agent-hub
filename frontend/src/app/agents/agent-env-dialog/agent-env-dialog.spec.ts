import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppStateService } from '../../state/app-state.service';
import type { AgentSummary } from '../../core/api/types';
import { AgentEnvDialogComponent } from './agent-env-dialog';

describe('AgentEnvDialogComponent', () => {
  let fixture: ComponentFixture<AgentEnvDialogComponent>;
  let dialogRef: { close: ReturnType<typeof vi.fn> };
  let state: { updateAgentEnv: ReturnType<typeof vi.fn> };

  const agent: AgentSummary = {
    id: 'codex',
    display_name: 'Codex',
    source: 'registry',
    availability: 'available',
    usage_provider: null,
    metadata: {},
    mutability: 'registry_managed',
  };

  async function setup(presence: Array<{ name: string; present: boolean }>): Promise<void> {
    dialogRef = { close: vi.fn() };
    state = { updateAgentEnv: vi.fn(async () => presence) };
    await TestBed.configureTestingModule({
      imports: [AgentEnvDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { agent, presence } },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: AppStateService, useValue: state },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AgentEnvDialogComponent);
    fixture.detectChanges();
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('prefills existing variables as Keep with empty values', async () => {
    await setup([{ name: 'CODEX_API_KEY', present: true }]);
    const component = fixture.componentInstance;
    expect(component.rows()).toEqual([
      { name: 'CODEX_API_KEY', action: 'keep', value: '', existing: true },
    ]);
  });

  it('sends Replace for a new variable and never stores values after save', async () => {
    await setup([]);
    const component = fixture.componentInstance;
    component.addRow();
    component.setRow(0, 'name', 'GEMINI_API_KEY');
    component.setRow(0, 'value', 'secret-value');
    await component.save();
    expect(state.updateAgentEnv).toHaveBeenCalledWith('codex', [
      { name: 'GEMINI_API_KEY', action: 'replace', value: 'secret-value' },
    ]);
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('sends Keep, Replace, and Remove in one save', async () => {
    await setup([
      { name: 'KEEP_ME', present: true },
      { name: 'REPLACE_ME', present: true },
      { name: 'REMOVE_ME', present: true },
    ]);
    const component = fixture.componentInstance;
    component.setRow(1, 'action', 'replace');
    component.setRow(1, 'value', 'new-value');
    component.setRow(2, 'action', 'remove');
    await component.save();
    expect(state.updateAgentEnv).toHaveBeenCalledWith('codex', [
      { name: 'KEEP_ME', action: 'keep' },
      { name: 'REPLACE_ME', action: 'replace', value: 'new-value' },
      { name: 'REMOVE_ME', action: 'remove' },
    ]);
  });

  it('refuses invalid names without calling the API', async () => {
    await setup([]);
    const component = fixture.componentInstance;
    component.addRow();
    component.setRow(0, 'name', 'HAS-DASH');
    component.setRow(0, 'value', 'x');
    await component.save();
    expect(state.updateAgentEnv).not.toHaveBeenCalled();
    expect(component.errorMessage()).toContain('unusable name');
  });

  it('requires a value for Replace', async () => {
    await setup([{ name: 'CODEX_API_KEY', present: true }]);
    const component = fixture.componentInstance;
    component.setRow(0, 'action', 'replace');
    component.setRow(0, 'value', '');
    await component.save();
    expect(state.updateAgentEnv).not.toHaveBeenCalled();
    expect(component.errorMessage()).toContain('value is required');
  });
});
