import { Component, computed, effect, inject, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import type { ConfigOption, ConfigOptionSelectGroup, ConfigOptionSelectValue, ProcessState, TurnState } from '../core/api/types';
import { AppStateService } from '../state/app-state.service';

@Component({
  selector: 'hub-chat-composer',
  standalone: true,
  imports: [ReactiveFormsModule, TextFieldModule, MatButtonModule, MatIconModule, MatMenuModule, MatProgressSpinnerModule, MatTooltipModule],
  template: `
    <div class="composer-column">
      <form class="composer" (submit)="$event.preventDefault(); send()">
        <textarea
          class="message-input"
          [formControl]="message"
          cdkTextareaAutosize
          [cdkAutosizeMinRows]="1"
          [cdkAutosizeMaxRows]="8"
          [placeholder]="placeholder()"
          (keydown)="keyDown($event)"
          [attr.aria-label]="placeholder()"
        ></textarea>
        <div class="composer-footer">
          <div class="selectors">
            @if (modelOption(); as model) {
              <button mat-button class="selector" type="button" [matMenuTriggerFor]="modelMenu" [disabled]="!canConfigure()" [attr.aria-label]="'Model: ' + optionLabel(model)">
                <span>{{ optionLabel(model) }}</span><mat-icon>expand_more</mat-icon>
              </button>
              <mat-menu #modelMenu="matMenu">
                @for (choice of model.options ?? []; track $index) {
                  @if (isGroup(choice)) {
                    <div class="menu-heading">{{ choice.group }}</div>
                    @for (child of choice.options; track $index) {
                      <button mat-menu-item type="button" (click)="changeOption(model, child.value)">{{ child.name }}</button>
                    }
                  } @else {
                    <button mat-menu-item type="button" (click)="changeOption(model, choice.value)">{{ choice.name }}</button>
                  }
                }
              </mat-menu>
            }
            @if (reasoningOption(); as reasoning) {
              <button mat-button class="selector" type="button" [matMenuTriggerFor]="reasoningMenu" [disabled]="!canConfigure()" [attr.aria-label]="'Reasoning effort: ' + optionLabel(reasoning)">
                <span>{{ reasoning.name }}: {{ optionLabel(reasoning) }}</span><mat-icon>expand_more</mat-icon>
              </button>
              <mat-menu #reasoningMenu="matMenu">
                @for (choice of reasoning.options ?? []; track $index) {
                  @if (!isGroup(choice)) { <button mat-menu-item type="button" (click)="changeOption(reasoning, choice.value)">{{ choice.name }}</button> }
                }
              </mat-menu>
            }
          </div>
          @if (prompting() || cancelling()) {
            <button matFab class="action cancel" type="button" matTooltip="Cancel active turn" aria-label="Cancel active turn" (click)="cancel()" [disabled]="cancelling()">
              @if (cancelling()) { <mat-spinner diameter="22" /> } @else { <mat-icon>stop</mat-icon> }
            </button>
          } @else {
            <button matFab class="action" type="submit" matTooltip="Send message (Ctrl+Enter)" aria-label="Send message" [disabled]="!canSend()">
              <mat-icon>arrow_upward</mat-icon>
            </button>
          }
        </div>
      </form>
      <p class="hint">Press Ctrl+Enter or Cmd+Enter to send</p>
    </div>
  `,
  styles: `
    :host { display: block; flex: 0 0 auto; padding: 12px max(var(--hub-gutter), calc((100% - var(--hub-measure)) / 2)); padding-bottom: calc(12px + env(safe-area-inset-bottom)); border-top: 1px solid var(--mat-sys-outline-variant); background: var(--mat-sys-surface); }
    .composer-column { max-width: var(--hub-measure); margin: 0 auto; }
    .composer { display: flex; flex-direction: column; gap: 4px; padding: 14px 10px 8px 20px; border: 1px solid var(--mat-sys-outline-variant); border-radius: 28px; background: var(--mat-sys-surface-container-low); transition: border-color 160ms ease, box-shadow 160ms ease; }
    .composer:focus-within { border-color: var(--mat-sys-primary); box-shadow: 0 0 0 1px var(--mat-sys-primary); }
    .message-input { display: block; width: 100%; min-height: 40px; max-height: 190px; resize: none; border: 0; outline: 0; background: transparent; color: var(--mat-sys-on-surface); font: var(--mat-sys-body-large); line-height: 1.5; }
    .message-input::placeholder { color: var(--mat-sys-on-surface-variant); opacity: 1; }
    .composer-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .selectors { display: flex; align-items: center; flex-wrap: wrap; gap: 2px; min-width: 0; }
    .selector { min-height: 40px; padding-inline: 10px; border-radius: 20px; color: var(--mat-sys-on-surface-variant); }
    .selector mat-icon { width: 20px; height: 20px; margin-left: 2px; font-size: 20px; }
    .menu-heading { padding: 8px 16px 4px; color: var(--mat-sys-on-surface-variant); font: var(--mat-sys-label-medium); }
    .action { width: 48px; height: 48px; min-width: 48px; flex: 0 0 48px; padding: 0; }
    .cancel { --mat-fab-container-color: var(--mat-sys-error-container); --mat-fab-icon-color: var(--mat-sys-on-error-container); --mat-fab-state-layer-color: var(--mat-sys-on-error-container); }
    .hint { padding: 6px 4px 0; color: var(--mat-sys-on-surface-variant); font: var(--mat-sys-body-small); }
    @media (max-width: 599px) { :host { padding-inline: 16px; } .composer { padding-left: 14px; } .selector { padding-inline: 6px; } .hint { display: none; } }
  `,
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
  readonly canConfigure = computed(() => !this.disabled() && this.processState() === 'RUNNING' && this.turnState() === 'IDLE');
  readonly modelOption = computed(() => this.findOption('model', 'model'));
  readonly reasoningOption = computed(() => this.findOption('reasoning_effort', 'reasoning effort'));
  private readonly unavailable = computed(
    () => this.disabled() || this.processState() !== 'RUNNING' || this.prompting(),
  );
  readonly canSend = computed(() => !this.unavailable() && this.text().trim().length > 0);
  readonly placeholder = computed(() => {
    if (this.disabled()) return 'Waiting for the agent connection…';
    if (this.processState() !== 'RUNNING') return 'Agent process stopped';
    if (this.prompting()) return 'Agent is thinking…';
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

  private findOption(id: string, name: string): ConfigOption | null {
    return this.options().find((option) => option.type === 'select' && (option.id === id || option.name.toLowerCase() === name)) ?? null;
  }
}
