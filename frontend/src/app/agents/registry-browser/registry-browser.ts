import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import type { DistributionKind, RegistryEntry } from '../../core/api/types';
import { AppStateService } from '../../state/app-state.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog';

@Component({
  selector: 'hub-registry-browser',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  templateUrl: './registry-browser.html',
  styleUrl: './registry-browser.scss',
})
export class RegistryBrowserComponent {
  private readonly state = inject(AppStateService);
  private readonly dialog = inject(MatDialog);

  readonly query = signal('');
  readonly busy = signal<string | null>(null);
  readonly actionError = signal('');
  readonly distributionByEntry = signal<Record<string, DistributionKind>>({});

  readonly catalog = this.state.registry;
  readonly loading = this.state.registryLoading;
  readonly error = computed(() => this.actionError() || this.state.registryError());

  async search(): Promise<void> {
    await this.state.loadRegistry(this.query());
  }

  async refresh(): Promise<void> {
    this.actionError.set('');
    await this.state.refreshRegistry();
  }

  distributionFor(entry: RegistryEntry): DistributionKind | null {
    return this.distributionByEntry()[entry.id] ?? entry.selected_distribution ?? entry.distributions[0] ?? null;
  }

  setDistribution(entry: RegistryEntry, distribution: DistributionKind): void {
    this.distributionByEntry.update((current) => ({ ...current, [entry.id]: distribution }));
  }

  async install(entry: RegistryEntry): Promise<void> {
    const distribution = this.distributionFor(entry);
    if (!distribution) return;
    this.busy.set(entry.id);
    this.actionError.set('');
    try {
      await this.state.installRegistryAgent({
        registry_id: entry.id,
        distribution,
        display_name: entry.name,
      });
    } catch (error: unknown) {
      this.actionError.set(this.message(error, `Failed to install ${entry.name}`));
    } finally {
      this.busy.set(null);
    }
  }

  async update(entry: RegistryEntry): Promise<void> {
    const id = entry.installed_as ?? entry.id;
    this.busy.set(entry.id);
    this.actionError.set('');
    try {
      const outcome = await this.state.updateAgent(id);
      if (!outcome.updated) this.actionError.set(`${entry.name} is already at the newest version.`);
    } catch (error: unknown) {
      this.actionError.set(this.message(error, `Failed to update ${entry.name}`));
    } finally {
      this.busy.set(null);
    }
  }

  async uninstall(entry: RegistryEntry): Promise<void> {
    const id = entry.installed_as ?? entry.id;
    const confirmed = await this.confirm(
      `Uninstall ${entry.name}`,
      'The registry-managed install is removed. Chats that still use it keep their history but cannot start a new session. Any chat with this agent keeps its history.',
      'Uninstall',
    );
    if (!confirmed) return;
    this.busy.set(entry.id);
    this.actionError.set('');
    try {
      await this.state.removeAgent(id);
    } catch (error: unknown) {
      this.actionError.set(this.message(error, `Failed to uninstall ${entry.name}`));
    } finally {
      this.busy.set(null);
    }
  }

  statusLabel(status: string | undefined): string {
    switch (status) {
      case 'fresh':
        return 'Freshly fetched';
      case 'cached':
        return 'Cached catalog';
      case 'unavailable':
        return 'Registry unavailable';
      default:
        return '';
    }
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
