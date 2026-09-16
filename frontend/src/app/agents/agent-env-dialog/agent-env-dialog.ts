import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import type { AgentEnvEdit, AgentEnvPresence, AgentSummary } from '../../core/api/types';
import { AppStateService } from '../../state/app-state.service';

export interface AgentEnvDialogData {
  agent: AgentSummary;
  presence: AgentEnvPresence[];
}

export interface AgentEnvDraft {
  name: string;
  action: 'keep' | 'replace' | 'remove';
  value: string;
  existing: boolean;
}

const ENV_NAME_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/;

export function isValidEnvName(name: string): boolean {
  const trimmed = name.trim();
  if (!trimmed || trimmed.length > 256) return false;
  return ENV_NAME_PATTERN.test(trimmed);
}

@Component({
  selector: 'hub-agent-env-dialog',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
  templateUrl: './agent-env-dialog.html',
  styleUrl: './agent-env-dialog.scss',
})
export class AgentEnvDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AgentEnvDialogComponent>);
  private readonly state = inject(AppStateService);
  readonly data = inject<AgentEnvDialogData>(MAT_DIALOG_DATA);

  readonly rows = signal<AgentEnvDraft[]>(
    (this.data.presence ?? []).map((entry) => ({
      name: entry.name,
      action: 'keep',
      value: '',
      existing: true,
    })),
  );
  readonly errorMessage = signal('');
  readonly saving = signal(false);

  setRow(index: number, field: keyof AgentEnvDraft, value: string | boolean): void {
    this.rows.update((rows) =>
      rows.map((row, current) =>
        current === index ? { ...row, [field]: value } : row,
      ),
    );
  }

  addRow(): void {
    this.rows.update((rows) => [...rows, { name: '', action: 'replace', value: '', existing: false }]);
  }

  removeRow(index: number): void {
    this.rows.update((rows) => rows.filter((_, current) => current !== index));
  }

  private buildEdits(): AgentEnvEdit[] | null {
    const edits: AgentEnvEdit[] = [];
    const seen = new Set<string>();
    for (const row of this.rows()) {
      const name = row.name.trim();
      if (!name) continue;
      if (!isValidEnvName(name)) {
        this.errorMessage.set(
          `The environment variable "${name}" has an unusable name. A name starts with a letter or underscore and holds letters, digits, and underscores.`,
        );
        return null;
      }
      const normalized = name;
      if (seen.has(normalized)) {
        this.errorMessage.set(`The environment variable "${normalized}" appears more than once.`);
        return null;
      }
      seen.add(normalized);
      if (row.action === 'replace' && !row.value && row.existing) {
        this.errorMessage.set(`A value is required for the replacement variable "${normalized}".`);
        return null;
      }
      if (row.action === 'replace' && !row.value && !row.existing) {
        this.errorMessage.set(`A value is required for the new variable "${normalized}".`);
        return null;
      }
      if (!row.existing && row.action !== 'replace') {
        this.errorMessage.set(`The new variable "${normalized}" must use Replace.`);
        return null;
      }
      edits.push({
        name: normalized,
        action: row.action,
        ...(row.action === 'replace' ? { value: row.value } : {}),
      });
    }
    return edits;
  }

  async save(): Promise<void> {
    const edits = this.buildEdits();
    if (!edits) return;
    this.errorMessage.set('');
    this.saving.set(true);
    try {
      await this.state.updateAgentEnv(this.data.agent.id, edits);
      this.dialogRef.close(true);
    } catch (error: unknown) {
      this.errorMessage.set(
        error instanceof Error && error.message ? error.message : 'Failed to save agent environment.',
      );
    } finally {
      this.saving.set(false);
    }
  }
}
