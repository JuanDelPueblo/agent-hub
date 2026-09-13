import { Component, Input, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import type { Chat, ConfigOption, ConfigOptionSelectGroup, PermissionPolicy } from '../../core/api/types';
import { AppStateService } from '../../state/app-state.service';

@Component({
  selector: 'hub-chat-config',
  standalone: true,
  imports: [FormsModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatSelectModule, MatSlideToggleModule],
  templateUrl: './chat-config.html',
  styleUrl: './chat-config.scss',
})
export class ChatConfigComponent {
  @Input() chat: Chat | null = null;
  @Input() options: ConfigOption[] = [];
  readonly errorMessage = signal('');
  private readonly state = inject(AppStateService);

  isGroup(value: NonNullable<ConfigOption['options']>[number]): value is ConfigOptionSelectGroup {
    return 'options' in value;
  }

  isComposerOption(option: ConfigOption): boolean {
    return option.id === 'model' || option.id === 'reasoning_effort'
      || option.name.toLowerCase() === 'model' || option.name.toLowerCase() === 'reasoning effort';
  }

  hasAdditionalOptions(): boolean {
    return this.options.some((option) => !this.isComposerOption(option));
  }

  async changePolicy(policy: PermissionPolicy): Promise<void> {
    if (!this.chat) return;
    this.errorMessage.set('');
    try { await this.state.setChatPolicy(this.chat.id, policy); } catch (error: unknown) { this.errorMessage.set(error instanceof Error ? error.message : 'Failed to update permission policy'); }
  }

  async changeOption(option: ConfigOption, value: unknown): Promise<void> {
    if (!this.chat) return;
    this.errorMessage.set('');
    try { await this.state.setChatConfig(this.chat.id, option.id, value); } catch (error: unknown) { this.errorMessage.set(error instanceof Error ? error.message : 'Failed to update agent configuration'); }
  }
}
