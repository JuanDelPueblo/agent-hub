import { Component, Input, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import type { Chat, ConfigOption, ConfigOptionSelectGroup, PermissionPolicy } from '../core/api/types';
import { AppStateService } from '../state/app-state.service';

@Component({
  selector: 'hub-chat-config',
  standalone: true,
  imports: [FormsModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatSelectModule, MatSlideToggleModule],
  template: `
    @if (chat) {
      <section class="config" aria-labelledby="config-heading">
        <h2 id="config-heading"><mat-icon>tune</mat-icon> Configuration & permissions</h2>
        @if (errorMessage()) { <div class="error-box" role="alert">{{ errorMessage() }}</div> }
        <div class="config-item">
          <mat-form-field appearance="outline">
            <mat-label>Permission policy</mat-label>
            <mat-select [value]="chat.permission_policy" (selectionChange)="changePolicy($event.value)">
              <mat-option value="ask">Ask every time</mat-option>
              <mat-option value="read-only">Read-only (deny writes)</mat-option>
              <mat-option value="auto-approve">Auto-approve all permissions</mat-option>
              <mat-option value="deny-all">Deny all actions</mat-option>
            </mat-select>
          </mat-form-field>
          <p>Controls whether the agent must ask before running commands or editing files.</p>
        </div>
        <mat-divider />
        @if (!options.length) {
          <p class="no-options">No additional agent configuration options advertised.</p>
        } @else {
          @for (option of options; track option.id) {
            @if (option.type === 'select') {
              <div class="config-item">
                <mat-form-field appearance="outline">
                  <mat-label>{{ option.name }}</mat-label>
                  <mat-select [value]="option.currentValue" (selectionChange)="changeOption(option, $event.value)">
                    @for (item of option.options ?? []; track $index) {
                      @if (isGroup(item)) {
                        <mat-optgroup [label]="item.group">
                          @for (child of item.options; track $index) { <mat-option [value]="child.value">{{ child.name }}</mat-option> }
                        </mat-optgroup>
                      } @else { <mat-option [value]="item.value">{{ item.name }}</mat-option> }
                    }
                  </mat-select>
                </mat-form-field>
                @if (option.description) { <p>{{ option.description }}</p> }
              </div>
            } @else if (option.type === 'boolean') {
              <div class="boolean-item">
                <div><strong>{{ option.name }}</strong>@if (option.description) { <p>{{ option.description }}</p> }</div>
                <mat-slide-toggle [checked]="!!option.currentValue" (change)="changeOption(option, $event.checked)" [attr.aria-label]="option.name" />
              </div>
            } @else {
              <div class="config-item"><strong>{{ option.name }}</strong><div class="unsupported">{{ option.currentValue }} (type: {{ option.type }})</div></div>
            }
          }
        }
      </section>
    }
  `,
  styles: `
    :host { display: block; } .config { display: flex; flex-direction: column; gap: 18px; } h2 { display: flex; align-items: center; gap: 8px; margin: 0; font-size: 1.05rem; } h2 mat-icon { color: var(--mat-sys-primary); }
    .config-item { display: flex; flex-direction: column; gap: 6px; } mat-form-field { width: 100%; } p { margin: 0; color: var(--mat-sys-on-surface-variant); font-size: .83rem; line-height: 1.45; } .no-options { font-style: italic; } .boolean-item { display: flex; align-items: center; justify-content: space-between; gap: 16px; } .boolean-item strong { display: block; } .unsupported { padding: 12px; border-radius: 10px; background: var(--mat-sys-surface-container); color: var(--mat-sys-on-surface-variant); font-size: .82rem; } .error-box { padding: 12px 16px; border-radius: 12px; background: var(--mat-sys-error-container); color: var(--mat-sys-on-error-container); }
  `,
})
export class ChatConfigComponent {
  @Input() chat: Chat | null = null;
  @Input() options: ConfigOption[] = [];
  readonly errorMessage = signal('');
  private readonly state = inject(AppStateService);

  isGroup(value: NonNullable<ConfigOption['options']>[number]): value is ConfigOptionSelectGroup {
    return 'options' in value;
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
