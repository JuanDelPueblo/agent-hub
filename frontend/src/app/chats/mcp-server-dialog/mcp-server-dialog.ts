import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '../../core/api/api.service';
import type { McpServer, McpServerInput, McpTransport } from '../../core/api/types';

export interface McpServerDialogData {
  chatId: string;
  server: McpServer | null;
}

export interface McpSecretDraft {
  name: string;
  action: 'keep' | 'replace' | 'remove';
  value: string;
}

@Component({
  selector: 'hub-mcp-server-dialog',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
  templateUrl: './mcp-server-dialog.html',
  styleUrl: './mcp-server-dialog.scss',
})
export class McpServerDialogComponent {
  readonly dialogRef = inject(MatDialogRef<McpServerDialogComponent>);
  private readonly api = inject(ApiService);
  readonly data = inject<McpServerDialogData>(MAT_DIALOG_DATA);

  readonly editing = this.data.server !== null;
  readonly name = signal(this.data.server?.name ?? '');
  readonly transport = signal<McpTransport>(this.data.server?.transport ?? 'stdio');
  readonly url = signal(this.data.server?.url ?? '');
  readonly command = signal(this.data.server?.command ?? '');
  readonly argsText = signal((this.data.server?.args ?? []).join('\n'));
  readonly secrets = signal<McpSecretDraft[]>(
    (this.data.server?.secrets ?? []).map((secret) => ({
      name: secret.name,
      action: 'keep',
      value: '',
    })),
  );
  readonly errorMessage = signal('');
  readonly saving = signal(false);

  readonly showUrl = computed(() => this.transport() !== 'stdio');
  readonly showCommand = computed(() => this.transport() === 'stdio');

  setSecret(index: number, field: keyof McpSecretDraft, value: string): void {
    this.secrets.update((secrets) =>
      secrets.map((secret, current) =>
        current === index ? { ...secret, [field]: value } : secret,
      ),
    );
  }

  addSecret(): void {
    this.secrets.update((secrets) => [
      ...secrets,
      { name: '', action: 'replace', value: '' },
    ]);
  }

  removeSecret(index: number): void {
    this.secrets.update((secrets) => secrets.filter((_, current) => current !== index));
  }

  private parseArgs(value: string): string[] {
    return value
      .split('\n')
      .map((arg) => arg.trim())
      .filter(Boolean);
  }

  private buildInput(): McpServerInput | null {
    const name = this.name().trim();
    if (!name) {
      this.errorMessage.set('A server name is required.');
      return null;
    }
    const transport = this.transport();
    const input: McpServerInput = {
      name,
      transport,
      args: transport === 'stdio' ? this.parseArgs(this.argsText()) : [],
    };
    if (transport === 'stdio') {
      const command = this.command().trim();
      if (!command) {
        this.errorMessage.set('An absolute command is required for a stdio server.');
        return null;
      }
      input.command = command;
    } else {
      const url = this.url().trim();
      if (!url) {
        this.errorMessage.set('A URL is required for an HTTP or SSE server.');
        return null;
      }
      input.url = url;
    }
    const secrets: NonNullable<McpServerInput['secrets']> = [];
    for (const secret of this.secrets()) {
      const secretName = secret.name.trim();
      if (!secretName) continue;
      if (secret.action === 'replace' && !secret.value) {
        this.errorMessage.set(`A value is required for the replacement secret "${secretName}".`);
        return null;
      }
      secrets.push({
        name: secretName,
        action: secret.action,
        ...(secret.action === 'replace' ? { value: secret.value } : {}),
      });
    }
    input.secrets = secrets;
    return input;
  }

  async save(): Promise<void> {
    const input = this.buildInput();
    if (!input) return;
    this.errorMessage.set('');
    this.saving.set(true);
    try {
      const servers = this.data.server
        ? await this.api.editMcpServer(this.data.chatId, this.data.server.id, input)
        : await this.api.createMcpServer(this.data.chatId, input);
      this.dialogRef.close(servers);
    } catch (error: unknown) {
      this.errorMessage.set(
        error instanceof Error && error.message ? error.message : 'Failed to save MCP server.',
      );
    } finally {
      this.saving.set(false);
    }
  }
}