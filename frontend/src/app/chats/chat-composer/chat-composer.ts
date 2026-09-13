import { Component, computed, effect, inject, input, signal } from '@angular/core';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import type { ConfigOption, ConfigOptionSelectGroup, ConfigOptionSelectValue, ProcessState, TurnState } from '../../core/api/types';
import { AppStateService } from '../../state/app-state.service';

@Component({
  selector: 'hub-chat-composer',
  imports: [ReactiveFormsModule, TextFieldModule, MatButtonModule, MatIconModule, MatMenuModule, MatProgressSpinnerModule, MatTooltipModule],
  templateUrl: './chat-composer.html',
  styleUrl: './chat-composer.scss',
})
export class ChatComposerComponent {
  readonly chatId = input('');
  readonly processState = input<ProcessState>('STOPPED');
  readonly turnState = input<TurnState>('IDLE');
  readonly disabled = input(false);
  readonly options = input<ConfigOption[]>([]);

  readonly message = new FormControl('', { nonNullable: true });
  private readonly state = inject(AppStateService);
  private readonly text = toSignal(this.message.valueChanges, { initialValue: this.message.value });

  readonly prompting = computed(() => this.turnState() === 'PROMPTING');
  readonly cancelling = computed(() => this.turnState() === 'CANCELLING');
  readonly resuming = signal(false);
  readonly isStopped = computed(() => this.processState() === 'STOPPED' || this.processState() === 'DEAD');
  readonly canConfigure = computed(() => !this.disabled() && this.processState() === 'RUNNING' && this.turnState() === 'IDLE');
  readonly modelOption = computed(() => this.findOption('model', 'model'));
  readonly reasoningOption = computed(() => this.findOption('reasoning_effort', 'reasoning effort'));
  private readonly unavailable = computed(
    () => this.disabled() || this.processState() === 'STARTING' || this.prompting() || this.cancelling() || this.resuming(),
  );
  readonly canSend = computed(() => !this.unavailable() && this.text().trim().length > 0);
  readonly placeholder = computed(() => {
    if (this.disabled()) return 'Waiting for the agent connection…';
    if (this.prompting()) return 'Agent is thinking…';
    if (this.cancelling()) return 'Cancelling active turn…';
    if (this.processState() === 'STARTING' || this.resuming()) return 'Agent is starting…';
    if (this.isStopped()) return 'Agent stopped — type a message to resume…';
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
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      void this.send();
    }
  }

  async resume(): Promise<void> {
    if (!this.chatId() || this.resuming()) return;
    this.resuming.set(true);
    try {
      await this.state.connectChat(this.chatId());
    } catch (error) {
      console.error('Failed to resume chat', error);
    } finally {
      this.resuming.set(false);
    }
  }

  async send(): Promise<void> {
    const value = this.message.value.trim();
    if (!value || !this.canSend()) return;
    this.message.setValue('');
    try {
      if (this.processState() !== 'RUNNING') {
        await this.state.connectChat(this.chatId());
      }
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

  private findOption(id: string, name: string): ConfigOption | null {
    return this.options().find((option) => option.type === 'select' && (option.id === id || option.name.toLowerCase() === name)) ?? null;
  }
}
