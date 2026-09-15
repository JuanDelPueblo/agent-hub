import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import type { AgentAuthState, AgentSummary } from '../../core/api/types';
import { AgentCardComponent } from '../../agents/agent-card/agent-card';
import { AuthTerminalDialogComponent } from '../../agents/auth-terminal-dialog/auth-terminal-dialog';
import { ConfirmDialogComponent } from '../../agents/confirm-dialog/confirm-dialog';
import { CustomAgentDialogComponent } from '../../agents/custom-agent-dialog/custom-agent-dialog';
import { AppStateService } from '../../state/app-state.service';

@Component({
  selector: 'hub-agents-page',
  imports: [
    AgentCardComponent,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    RouterLink,
  ],
  templateUrl: './agents-page.html',
  styleUrl: './agents-page.scss',
})
export class AgentsPageComponent implements OnInit {
  readonly state = inject(AppStateService);
  private readonly dialog = inject(MatDialog);
  private readonly route = inject(ActivatedRoute);

  readonly actionError = signal('');
  readonly notice = signal('');
  readonly targetAgentId = signal<string | null>(null);

  ngOnInit(): void {
    const initialTarget = this.route.snapshot.queryParamMap.get('agent');
    if (initialTarget) {
      this.targetAgentId.set(initialTarget);
    }
    this.route.queryParamMap.subscribe((params) => {
      const agent = params.get('agent');
      if (agent) {
        this.targetAgentId.set(agent);
        this.targetAgentAuthSection(agent);
      }
    });
    void this.initialize();
  }

  async initialize(): Promise<void> {
    await this.state.loadAgents();
    await this.loadAuthForAll();
    const target = this.targetAgentId();
    if (target) {
      this.targetAgentAuthSection(target);
    }
  }

  authFor(id: string): AgentAuthState | null {
    return this.state.authByAgent()[id] ?? null;
  }

  authLoadingFor(id: string): boolean {
    return this.state.authLoading().has(id);
  }

  authErrorFor(id: string): string | null {
    return this.state.authErrors()[id] ?? null;
  }

  async reloadAuth(agent: AgentSummary): Promise<void> {
    try {
      await this.state.loadAgentAuth(agent.id);
    } catch {
      // The card shows the error from the store.
    }
  }

  async authenticate(agent: AgentSummary, methodId: string): Promise<void> {
    this.actionError.set('');
    this.notice.set('');
    try {
      await this.state.authenticateAgent(agent.id, methodId);
      this.notice.set(`Signed in to ${agent.display_name}.`);
    } catch {
      // The store records the method-level error.
    }
  }

  async logout(agent: AgentSummary): Promise<void> {
    this.actionError.set('');
    this.notice.set('');
    try {
      await this.state.logoutAgent(agent.id);
      this.notice.set(`Signed out of ${agent.display_name}.`);
    } catch {
      // The store records the error.
    }
  }

  async openTerminalAuth(agent: AgentSummary, methodId: string): Promise<void> {
    this.actionError.set('');
    this.notice.set('');
    try {
      const auth = this.authFor(agent.id);
      const method = auth?.methods.find((m) => m.id === methodId) ?? {
        id: methodId,
        name: methodId,
        type: 'terminal',
        supported: true,
      };
      const flow = await this.state.startTerminalAgentAuth(agent.id, methodId);
      this.dialog.open(AuthTerminalDialogComponent, {
        data: { flow, method },
        disableClose: true,
        width: 'min(900px, calc(100vw - 16px))',
        maxWidth: '96vw',
      });
    } catch (error: unknown) {
      this.actionError.set(this.message(error, `Failed to start terminal authentication for ${agent.display_name}`));
    }
  }

  private targetAgentAuthSection(agentId: string): void {
    queueMicrotask(() => {
      const authSection = document.getElementById(`agent-auth-${agentId}`);
      if (authSection) {
        authSection.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
        authSection.focus?.();
        return;
      }
      const card = document.getElementById(`agent-card-${agentId}`);
      if (card) {
        card.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
        card.focus?.();
      }
    });
  }

  async createCustom(): Promise<void> {
    this.openCustomDialog(null);
  }

  async editCustom(agent: AgentSummary): Promise<void> {
    this.actionError.set('');
    try {
      const detail = await this.state.fetchAgentDetail(agent.id);
      this.openCustomDialog(detail);
    } catch (error: unknown) {
      this.actionError.set(this.message(error, `Failed to load ${agent.display_name}`));
    }
  }

  async removeCustom(agent: AgentSummary): Promise<void> {
    const confirmed = await this.confirm(
      `Remove ${agent.display_name}`,
      'The custom definition is deleted. Chats that still use it keep their history but cannot start a new session.',
      'Remove',
    );
    if (!confirmed) return;
    await this.removeAgent(agent, `Removed ${agent.display_name}.`);
  }

  async update(agent: AgentSummary): Promise<void> {
    this.actionError.set('');
    this.notice.set('');
    try {
      const outcome = await this.state.updateAgent(agent.id);
      this.notice.set(
        outcome.updated
          ? `Updated ${agent.display_name} from ${outcome.from_version} to ${outcome.to_version}.`
          : `${agent.display_name} is already at the newest version.`,
      );
    } catch (error: unknown) {
      this.actionError.set(this.message(error, `Failed to update ${agent.display_name}`));
    }
  }

  async uninstall(agent: AgentSummary): Promise<void> {
    const confirmed = await this.confirm(
      `Uninstall ${agent.display_name}`,
      'The registry-managed install is removed. Chats that still use it keep their history but cannot start a new session.',
      'Uninstall',
    );
    if (!confirmed) return;
    await this.removeAgent(agent, `Uninstalled ${agent.display_name}.`);
  }

  private openCustomDialog(detail: import('../../core/api/types').AgentManagementDetail | null): void {
    const ref = this.dialog.open(CustomAgentDialogComponent, {
      data: { detail },
      width: 'min(720px, calc(100vw - 24px))',
      maxWidth: '96vw',
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) this.notice.set(detail ? 'Custom agent saved.' : 'Custom agent created.');
    });
  }

  private async removeAgent(agent: AgentSummary, successMessage: string): Promise<void> {
    this.actionError.set('');
    this.notice.set('');
    try {
      const outcome = await this.state.removeAgent(agent.id);
      this.notice.set(
        outcome.deleted
          ? successMessage
          : `${agent.display_name} was retired. ${outcome.retained_chats} chat(s) still refer to it, so their history stays readable.`,
      );
    } catch (error: unknown) {
      this.actionError.set(this.message(error, `Failed to remove ${agent.display_name}`));
    }
  }

  private async loadAuthForAll(): Promise<void> {
    await Promise.allSettled(this.state.agents().map((agent) => this.state.loadAgentAuth(agent.id)));
  }

  private confirm(title: string, message: string, confirmLabel: string): Promise<boolean> {
    return new Promise((resolve) => {
      const ref = this.dialog.open(ConfirmDialogComponent, {
        data: { title, message, confirmLabel, destructive: true },
        width: 'min(520px, calc(100vw - 32px))',
      });
      ref.afterClosed().subscribe((result) => resolve(Boolean(result)));
    });
  }

  private message(error: unknown, fallback: string): string {
    return error instanceof Error && error.message ? error.message : fallback;
  }
}
