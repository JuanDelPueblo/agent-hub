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

interface FormField {
  key: string;
  title: string;
  description?: string;
  type: string;
  required: boolean;
  enumOptions?: string[];
}

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

  readonly fields = computed<FormField[]>(() => {
    const schema = this.elicitation().schema as Record<string, unknown> | undefined;
    const props = (schema?.['properties'] ?? {}) as Record<string, Record<string, unknown>>;
    const required = Array.isArray(schema?.['required']) ? (schema?.['required'] as string[]) : [];
    return Object.entries(props).map(([key, prop]) => {
      const enumValues = Array.isArray(prop['enum'])
        ? (prop['enum'] as string[])
        : Array.isArray(prop['enum_values'])
          ? (prop['enum_values'] as string[])
          : undefined;
      return {
        key,
        title: typeof prop['title'] === 'string' ? (prop['title'] as string) : key,
        description: typeof prop['description'] === 'string' ? (prop['description'] as string) : undefined,
        type: typeof prop['type'] === 'string' ? (prop['type'] as string) : 'string',
        required: required.includes(key),
        enumOptions: enumValues,
      };
    });
  });

  fieldValue(key: string): unknown {
    return this.formValues()[key];
  }

  setFieldValue(key: string, value: unknown): void {
    this.formValues.update((c) => ({ ...c, [key]: value }));
  }

  async accept(): Promise<void> {
    if (!this.chatId() || !this.elicitation().requestId) return;
    this.responding.set(true);
    try {
      const content = this.isUrl() ? undefined : this.formValues();
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
