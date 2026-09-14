import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { ApiError, ApiService } from '../../core/api/api.service';
import type { ChatWorkspaceSelection, WorkspaceMode, WorkspaceOptions } from '../../core/api/types';
import { AppStateService } from '../../state/app-state.service';

@Component({
  selector: 'hub-new-chat-dialog',
  imports: [MatButtonModule, MatDialogModule, MatFormFieldModule, MatProgressBarModule, MatSelectModule],
  templateUrl: './new-chat-dialog.html',
  styleUrl: './new-chat-dialog.scss',
})
export class NewChatDialogComponent {
  readonly state = inject(AppStateService);
  private readonly api = inject(ApiService);
  readonly dialogRef = inject(MatDialogRef<NewChatDialogComponent>);
  readonly projectId = inject<{ projectId: string }>(MAT_DIALOG_DATA).projectId;

  readonly options = signal<WorkspaceOptions | null>(null);
  readonly selectedAgent = signal('');
  readonly selectedMode = signal<WorkspaceMode>('managed_worktree');
  readonly selectedBranch = signal('');
  readonly loading = signal(true);
  readonly creating = signal(false);
  readonly errorMessage = signal('');

  constructor() {
    this.selectedAgent.set(this.state.agents()[0] ?? '');
    void this.loadOptions();
  }

  async loadOptions(): Promise<void> {
    try {
      const options = await this.api.fetchWorkspaceOptions(this.projectId);
      this.options.set(options);
      const branch = options.branches.find((candidate) => candidate.current)?.name
        ?? options.branches[0]?.name ?? '';
      this.selectedBranch.set(branch);
    } catch (error: unknown) {
      this.errorMessage.set(this.message(error, 'Failed to load workspace options.'));
    } finally {
      this.loading.set(false);
    }
  }

  async create(): Promise<void> {
    const options = this.options();
    if (!options || !this.selectedAgent() || this.creating() || (options.is_git && !this.selectedBranch())) return;
    this.creating.set(true);
    this.errorMessage.set('');
    try {
      const workspace = options.is_git
        ? { mode: this.selectedMode(), branch: this.selectedBranch() }
        : undefined;
      const chat = await this.state.createChat(this.projectId, this.selectedAgent(), undefined, workspace);
      this.dialogRef.close(chat);
    } catch (error: unknown) {
      this.errorMessage.set(this.message(error, 'Failed to create the chat.'));
    } finally {
      this.creating.set(false);
    }
  }

  private message(error: unknown, fallback: string): string {
    return error instanceof ApiError || error instanceof Error ? error.message : fallback;
  }
}
