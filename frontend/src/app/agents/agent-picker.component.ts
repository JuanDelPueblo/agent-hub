import { Component, Inject, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { AppStateService } from '../state/app-state.service';

interface AgentPickerData { projectId: string; }

@Component({
  selector: 'hub-agent-picker',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <h2 mat-dialog-title>Select agent</h2>
    <mat-dialog-content>
      @if (errorMessage()) { <div class="error-box" role="alert">{{ errorMessage() }}</div> }
      <div class="agent-grid" role="listbox" aria-label="Available agents">
        @for (agent of state.agents(); track agent) {
          <button mat-stroked-button class="agent-option" role="option" [class.selected]="selectedAgent() === agent" [attr.aria-selected]="selectedAgent() === agent" type="button" (click)="selectedAgent.set(agent)">
            <mat-icon>{{ agentIcon(agent) }}</mat-icon><span>{{ agent }}</span>
          </button>
        } @empty { <p class="empty">No agents are configured.</p> }
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="dialogRef.close()" [disabled]="creating()">Cancel</button>
      <button mat-flat-button color="primary" type="button" (click)="create()" [disabled]="!selectedAgent() || creating()">
        @if (creating()) { <mat-spinner diameter="18" /> } @else { Start chat }
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    mat-dialog-content { min-width: min(480px, calc(100vw - 48px)); }
    .agent-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; padding: 12px 0; }
    .agent-option { min-height: 112px; display: flex; flex-direction: column; gap: 8px; justify-content: center; border-radius: 16px; text-transform: capitalize; }
    .agent-option mat-icon { color: var(--mat-sys-primary); font-size: 30px; width: 30px; height: 30px; }
    .agent-option.selected { background: var(--mat-sys-primary-container); border-color: var(--mat-sys-primary); }
    .empty { grid-column: 1 / -1; color: var(--mat-sys-outline); text-align: center; }
    .error-box { padding: 12px 16px; border-radius: 12px; background: var(--mat-sys-error-container); color: var(--mat-sys-on-error-container); white-space: pre-wrap; }
    @media (max-width: 599px) { mat-dialog-content { min-width: 0; } }
  `,
})
export class AgentPickerComponent {
  readonly state = inject(AppStateService);
  readonly dialogRef = inject(MatDialogRef<AgentPickerComponent>);
  private readonly router = inject(Router);
  readonly selectedAgent = signal('');
  readonly creating = signal(false);
  readonly errorMessage = signal('');
  readonly projectId: string;

  constructor(@Inject(MAT_DIALOG_DATA) data: AgentPickerData) {
    this.projectId = data.projectId;
    this.selectedAgent.set(this.state.agents()[0] ?? 'codex');
  }

  agentIcon(agent: string): string {
    const value = agent.toLowerCase();
    if (value.includes('codex')) return 'terminal';
    if (value.includes('claude')) return 'smart_toy';
    if (value.includes('opencode')) return 'code';
    if (value.includes('gemini') || value.includes('antigravity')) return 'psychology';
    return 'robot_2';
  }

  async create(): Promise<void> {
    if (!this.projectId || !this.selectedAgent()) return;
    this.creating.set(true);
    this.errorMessage.set('');
    try {
      const chat = await this.state.createChat(this.projectId, this.selectedAgent());
      this.dialogRef.close(chat);
      await this.router.navigate(['/projects', this.projectId, 'chats', chat.id]);
    } catch (error: unknown) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Failed to create chat');
    } finally {
      this.creating.set(false);
    }
  }
}
