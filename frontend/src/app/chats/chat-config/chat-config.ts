import { Component, computed, inject, input, signal } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import type { Chat, ConfigOption, ConfigOptionSelectGroup, PermissionPolicy, SessionModes } from '../../core/api/types';
import { AppStateService } from '../../state/app-state.service';

@Component({
  selector: 'hub-chat-config',
  imports: [MatDividerModule, MatFormFieldModule, MatIconModule, MatSelectModule, MatSlideToggleModule],
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
  private readonly state = inject(AppStateService);

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
