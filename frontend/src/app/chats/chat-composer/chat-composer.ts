import { Component, computed, effect, inject, input } from '@angular/core';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import type { AvailableCommand, ConfigOption, ConfigOptionSelectGroup, ConfigOptionSelectValue, TurnState } from '../../core/api/types';
import { AppStateService } from '../../state/app-state.service';

@Component({
  selector: 'hub-chat-composer',
  imports: [ReactiveFormsModule, TextFieldModule, MatButtonModule, MatIconModule, MatMenuModule, MatProgressSpinnerModule, MatTooltipModule],
  templateUrl: './chat-composer.html',
  styleUrl: './chat-composer.scss',
})
export class ChatComposerComponent {
  readonly chatId = input('');
  readonly turnState = input<TurnState>('IDLE');
  readonly disabled = input(false);
  readonly options = input<ConfigOption[]>([]);
  readonly commands = input<AvailableCommand[]>([]);

  readonly message = new FormControl('', { nonNullable: true });
  private readonly state = inject(AppStateService);
  private readonly text = toSignal(this.message.valueChanges, { initialValue: this.message.value });

  readonly prompting = computed(() => this.turnState() === 'PROMPTING');
  readonly cancelling = computed(() => this.turnState() === 'CANCELLING');
  readonly canConfigure = computed(() => !this.disabled() && this.turnState() === 'IDLE');
  readonly modelOption = computed(() => this.findOption('model', 'model', 'model'));
  readonly reasoningOption = computed(() => this.findOption('reasoning_effort', 'reasoning effort', 'thought_level'));
  readonly filteredCommands = computed(() => {
    const text = this.text();
    if (!text.startsWith('/')) return [];
    const query = text.slice(1).split(/\s/)[0].toLowerCase();
    return this.commands()
      .filter((c) => !query || c.name.toLowerCase().startsWith(query))
      .slice(0, 6);
  });
  readonly showCommands = computed(() => this.filteredCommands().length > 0 && !this.unavailable());
  private readonly unavailable = computed(
    () => this.disabled() || this.prompting() || this.cancelling(),
  );
  readonly canSend = computed(() => !this.unavailable() && this.text().trim().length > 0);
  readonly placeholder = computed(() => {
    if (this.disabled()) return 'Waiting for the agent connection…';
    if (this.prompting()) return 'Agent is thinking…';
    if (this.cancelling()) return 'Cancelling active turn…';
    return 'Type a message…';
  });


  constructor() {
    effect(() => {
      const locked = this.unavailable();
      if (locked && this.message.enabled) this.message.disable({ emitEvent: false });
      else if (!locked && this.message.disabled) this.message.enable({ emitEvent: false });
    });
  }

  keyDown(event: KeyboardEvent): void {
    if (event.isComposing) return;
    if (event.ctrlKey && !event.metaKey && event.key.toLowerCase() === 'j') {
      event.preventDefault();
      this.insertNewline(event);
      return;
    }
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void this.send();
    }
  }

  private insertNewline(event: KeyboardEvent): void {
    const textarea = event.target as HTMLTextAreaElement | null;
    const current = this.message.value;
    const start = textarea?.selectionStart ?? current.length;
    const end = textarea?.selectionEnd ?? current.length;
    this.message.setValue(`${current.slice(0, start)}\n${current.slice(end)}`);
    const cursor = start + 1;
    queueMicrotask(() => {
      if (textarea) textarea.setSelectionRange(cursor, cursor);
    });
  }

  async send(): Promise<void> {
    const value = this.message.value.trim();
    if (!value || !this.canSend()) return;
    this.message.setValue('');
    try {
      await this.state.sendPrompt(this.chatId(), value);
    } catch (error) {
      console.error('Failed to send prompt', error);
      this.message.setValue(value);
    }
  }


  async cancel(): Promise<void> {
    if (!this.chatId()) return;
    try {
      await this.state.cancelActiveTurn(this.chatId());
    } catch (error) {
      console.error('Failed to cancel turn', error);
    }
  }

  isGroup(value: ConfigOptionSelectValue | ConfigOptionSelectGroup): value is ConfigOptionSelectGroup {
    return 'options' in value;
  }

  optionLabel(option: ConfigOption): string {
    const currentValue = option.currentValue;
    for (const choice of option.options ?? []) {
      const values = this.isGroup(choice) ? choice.options : [choice];
      const selected = values.find((value) => Object.is(value.value, currentValue));
      if (selected) return selected.name;
    }
    return currentValue === undefined || currentValue === null ? option.name : String(currentValue);
  }

  async changeOption(option: ConfigOption, value: unknown): Promise<void> {
    if (!this.canConfigure()) return;
    try {
      await this.state.setChatConfig(this.chatId(), option.id, value);
    } catch (error) {
      console.error(`Failed to update ${option.name}`, error);
    }
  }

  selectCommand(command: AvailableCommand): void {
    // Invoke a slash command as ordinary prompt text, never via a command RPC.
    const hint = command.input?.hint ? ` ${command.input.hint}` : ' ';
    this.message.setValue(`/${command.name}${hint}`);
  }

  private findOption(id: string, name: string, category?: string): ConfigOption | null {
    return (
      this.options().find(
        (option) =>
          option.type === 'select' &&
          (option.id === id ||
            option.name.toLowerCase() === name ||
            (category != null && option.category === category)),
      ) ?? null
    );
  }
}
