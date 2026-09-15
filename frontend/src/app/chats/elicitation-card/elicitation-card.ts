import { Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import type { TurnEntryElicitation } from '../../core/api/types';
import { AppStateService } from '../../state/app-state.service';
import {
  applyElicitationDefaults,
  elicitationFields,
  validateElicitationForm,
} from './validate-form';

/** Renders stable form and URL elicitation associated with its chat/tool context. */
@Component({
  selector: 'hub-elicitation-card',
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './elicitation-card.html',
  styleUrl: './elicitation-card.scss',
})
export class ElicitationCardComponent {
  readonly elicitation = input.required<TurnEntryElicitation>();
  readonly chatId = input('');
  readonly responding = signal(false);
  readonly formValues = signal<Record<string, unknown>>({});
  private readonly state = inject(AppStateService);

  readonly isUrl = computed(() => this.elicitation().mode === 'url');
  readonly host = computed(() => {
    const url = this.elicitation().url;
    if (!url) return '';
    try {
      return new URL(url).host;
    } catch {
      return '';
    }
  });

  readonly fields = computed(() => elicitationFields(this.elicitation().schema));

  /** Explicit edits merged over schema defaults. */
  readonly mergedValues = computed(() =>
    applyElicitationDefaults(this.fields(), this.formValues()),
  );

  readonly formErrors = computed(
    () => validateElicitationForm(this.elicitation().schema, this.formValues()).errors,
  );

  /** Accept stays disabled until the form satisfies the advertised schema. */
  readonly canAccept = computed(
    () => validateElicitationForm(this.elicitation().schema, this.formValues()).valid,
  );

  fieldError(key: string): string | undefined {
    return this.formErrors()[key];
  }

  fieldValue(key: string): unknown {
    const edited = this.formValues()[key];
    return edited !== undefined ? edited : this.mergedValues()[key];
  }

  setFieldValue(key: string, value: unknown): void {
    this.formValues.update((c) => ({ ...c, [key]: value }));
  }

  arrayText(key: string): string {
    const value = this.fieldValue(key);
    return Array.isArray(value) ? (value as unknown[]).join(', ') : '';
  }

  setArrayText(key: string, text: string): void {
    this.setFieldValue(
      key,
      text
        .split(',')
        .map((part) => part.trim())
        .filter((part) => part.length > 0),
    );
  }

  async accept(): Promise<void> {
    if (!this.chatId() || !this.elicitation().requestId || !this.canAccept()) return;
    this.responding.set(true);
    try {
      const content = this.isUrl() ? undefined : this.mergedValues();
      await this.state.respondElicitation(this.chatId(), this.elicitation().requestId, 'accept', content);
    } catch (error) {
      console.error('Failed to accept elicitation', error);
    } finally {
      this.responding.set(false);
    }
  }

  async decline(): Promise<void> {
    if (!this.chatId() || !this.elicitation().requestId) return;
    this.responding.set(true);
    try {
      await this.state.respondElicitation(this.chatId(), this.elicitation().requestId, 'decline');
    } catch (error) {
      console.error('Failed to decline elicitation', error);
    } finally {
      this.responding.set(false);
    }
  }

  async cancel(): Promise<void> {
    if (!this.chatId() || !this.elicitation().requestId) return;
    this.responding.set(true);
    try {
      await this.state.respondElicitation(this.chatId(), this.elicitation().requestId, 'cancel');
    } catch (error) {
      console.error('Failed to cancel elicitation', error);
    } finally {
      this.responding.set(false);
    }
  }
}
