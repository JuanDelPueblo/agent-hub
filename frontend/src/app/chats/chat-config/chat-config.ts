import { Component, computed, inject, input, signal } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import type { Chat, ConfigOption, ConfigOptionSelectGroup, PermissionPolicy } from '../../core/api/types';
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
  readonly additionalOptions = computed(() =>
    this.options().filter((option) => !this.isComposerOption(option)),
  );
  readonly errorMessage = signal('');
  private readonly state = inject(AppStateService);

  isGroup(value: NonNullable<ConfigOption['options']>[number]): value is ConfigOptionSelectGroup {
    return 'options' in value;
  }

  isComposerOption(option: ConfigOption): boolean {
    return option.id === 'model' || option.id === 'reasoning_effort'
      || option.name.toLowerCase() === 'model' || option.name.toLowerCase() === 'reasoning effort';
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
