import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import type { AdditionalRoot, Chat, ConfigOption, ConfigOptionSelectGroup, McpServer, PermissionPolicy, Project, SessionModes } from '../../core/api/types';
import { AppStateService } from '../../state/app-state.service';
import { ApiService } from '../../core/api/api.service';

@Component({
  selector: 'hub-chat-config',
  imports: [MatButtonModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatSlideToggleModule],
  templateUrl: './chat-config.html',
  styleUrl: './chat-config.scss',
})
export class ChatConfigComponent {
  readonly chat = input<Chat | null>(null);
  readonly options = input<ConfigOption[]>([]);
  readonly modes = input<SessionModes | null>(null);
  readonly additionalOptions = computed(() =>
    this.options().filter((option) => !this.isComposerOption(option)),
  );
  // Legacy modes appear only as fallback when no config option already
  // covers the `mode` category. Never derive this from the agent id.
  readonly showModes = computed(() => {
    const modes = this.modes();
    if (!modes || !Array.isArray(modes.available_modes) || modes.available_modes.length === 0) return false;
    return !this.options().some((o) => o.category === 'mode');
  });
  readonly errorMessage = signal('');
  readonly mcpServers = signal<McpServer[]>([]);
  readonly additionalRoots = signal<AdditionalRoot[]>([]);
  readonly projects = signal<Project[]>([]);
  readonly selectedRoot = signal<string>('');
  private readonly state = inject(AppStateService);
  private readonly api = inject(ApiService);

  constructor() { effect(() => { const chat = this.chat(); if (!chat) return; void this.loadConnectionConfig(chat.id); }); }

  private async loadConnectionConfig(chatId: string): Promise<void> { try { const [mcp, roots, projects] = await Promise.all([this.api.fetchMcpServers(chatId), this.api.fetchAdditionalRoots(chatId), this.api.fetchProjects()]); this.mcpServers.set(mcp); this.additionalRoots.set(roots); this.projects.set(projects); } catch { /* ordinary config remains usable offline */ } }
  projectName(id: string): string { return this.projects().find((project) => project.id === id)?.name ?? id; }
  rootSelected(id: string): void { this.selectedRoot.set(id); }
  async addRoot(): Promise<void> { const chat=this.chat(); const id=this.selectedRoot(); if (!chat || !id) return; try { const ids=[...this.additionalRoots().map((root)=>root.project_id),id]; this.additionalRoots.set(await this.api.setAdditionalRoots(chat.id, ids)); await this.state.retryConnection(chat.id); } catch(error: unknown) { this.errorMessage.set(error instanceof Error ? error.message : 'Failed to save additional workspace roots'); } }
  async removeRoot(id: string): Promise<void> { const chat=this.chat(); if (!chat) return; try { this.additionalRoots.set(await this.api.setAdditionalRoots(chat.id, this.additionalRoots().filter((root)=>root.project_id!==id).map((root)=>root.project_id))); } catch(error: unknown) { this.errorMessage.set(error instanceof Error ? error.message : 'Failed to update additional workspace roots'); } }
  async addMcp(name: string, transport: string, url: string, command: string, secretName: string, secretValue: string): Promise<void> { const chat=this.chat(); if (!chat || !name.trim()) return; try { this.mcpServers.set(await this.api.createMcpServer(chat.id, { name, transport: transport as McpServer['transport'], ...(url.trim() ? { url } : {}), ...(command.trim() ? { command } : {}), ...(secretName.trim() ? { secrets: [{ name: secretName, value: secretValue }] } : {}) })); } catch(error: unknown) { this.errorMessage.set(error instanceof Error ? error.message : 'Failed to save MCP server'); } }
  async removeMcp(id: string): Promise<void> { const chat=this.chat(); if (!chat) return; try { await this.api.deleteMcpServer(chat.id, id); this.mcpServers.set(this.mcpServers().filter((server) => server.id !== id)); } catch(error: unknown) { this.errorMessage.set(error instanceof Error ? error.message : 'Failed to remove MCP server'); } }
  async moveMcp(id: string, delta: number): Promise<void> { const chat=this.chat(); const values=[...this.mcpServers()]; const index=values.findIndex((server)=>server.id===id); if(!chat || index < 0 || index + delta < 0 || index + delta >= values.length) return; [values[index], values[index + delta]] = [values[index + delta], values[index]]; try { this.mcpServers.set(await this.api.orderMcpServers(chat.id, values.map((server) => server.id))); } catch(error: unknown) { this.errorMessage.set(error instanceof Error ? error.message : 'Failed to reorder MCP servers'); } }

  isGroup(value: NonNullable<ConfigOption['options']>[number]): value is ConfigOptionSelectGroup {
    return 'options' in value;
  }

  isComposerOption(option: ConfigOption): boolean {
    if (option.category === 'model' || option.category === 'thought_level') return true;
    return option.id === 'model' || option.id === 'reasoning_effort'
      || option.name.toLowerCase() === 'model' || option.name.toLowerCase() === 'reasoning effort';
  }

  async changeMode(modeId: string): Promise<void> {
    const chat = this.chat();
    if (!chat) return;
    this.errorMessage.set('');
    try {
      await this.state.setChatMode(chat.id, modeId);
    } catch (error: unknown) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Failed to update session mode');
    }
  }

  async changePolicy(policy: PermissionPolicy): Promise<void> {
    const chat = this.chat();
    if (!chat) return;
    this.errorMessage.set('');
    try { await this.state.setChatPolicy(chat.id, policy); } catch (error: unknown) { this.errorMessage.set(error instanceof Error ? error.message : 'Failed to update permission policy'); }
  }

  async changeOption(option: ConfigOption, value: unknown): Promise<void> {
    const chat = this.chat();
    if (!chat) return;
    this.errorMessage.set('');
    try { await this.state.setChatConfig(chat.id, option.id, value); } catch (error: unknown) { this.errorMessage.set(error instanceof Error ? error.message : 'Failed to update agent configuration'); }
  }
}
