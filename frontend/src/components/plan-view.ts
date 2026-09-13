import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PlanEntry } from '../api/types';
import { sharedStyles } from '../styles/shared';

@customElement('plan-view')
export class PlanView extends LitElement {
  @property({ type: Array })
  entries: PlanEntry[] = [];

  static styles = [sharedStyles, css`
    :host {
      display: block;
      margin: var(--hub-space-3) 0;
    }

    .plan-card {
      background-color: var(--md-sys-color-tertiary-container);
      color: var(--md-sys-color-on-tertiary-container);
      border-radius: var(--md-sys-shape-corner-large);
      padding: var(--hub-space-4) var(--hub-space-5);
    }

    .plan-header {
      display: flex;
      align-items: center;
      gap: var(--hub-space-2);
      margin-bottom: var(--hub-space-4);
      font-size: var(--md-sys-typescale-label-large-font-size);
      line-height: var(--md-sys-typescale-label-large-line-height);
      font-weight: var(--md-sys-typescale-label-large-font-weight);
      color: var(--md-sys-color-on-tertiary-container);
    }

    .plan-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .plan-item {
      display: flex;
      align-items: flex-start;
      gap: var(--hub-space-3);
      font-size: var(--md-sys-typescale-body-medium-font-size);
      line-height: var(--md-sys-typescale-body-medium-line-height);
      line-height: 1.4;
      color: var(--md-sys-color-on-surface);
    }

    .icon {
      --hub-icon-size: 20px;
      display: inline-block;
      margin-top: 1px;
      flex-shrink: 0;
    }

    .icon.completed {
      color: var(--status-running);
    }

    .icon.in_progress {
      color: var(--md-sys-color-on-tertiary-container);
      animation: spin 1.5s linear infinite;
    }

    .icon.pending {
      color: color-mix(in srgb, var(--md-sys-color-on-tertiary-container) 58%, transparent);
    }

    .content.completed {
      text-decoration: line-through;
      color: var(--md-sys-color-on-surface-variant);
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `];

  private renderStatusIcon(status: string) {
    if (status === 'completed') {
      return html`<span class="icon completed">check_circle</span>`;
    } else if (status === 'in_progress') {
      return html`<span class="icon in_progress">progress_activity</span>`;
    }
    return html`<span class="icon pending">radio_button_unchecked</span>`;
  }

  render() {
    if (!this.entries || this.entries.length === 0) {
      return html``;
    }

    return html`
      <div class="plan-card">
        <div class="plan-header">
          <span class="icon">format_list_bulleted</span>
          <span>Execution Plan</span>
        </div>
        <ul class="plan-list">
          ${this.entries.map(
            (entry) => html`
              <li class="plan-item">
                ${this.renderStatusIcon(entry.status)}
                <span class="content ${entry.status}">${entry.content}</span>
              </li>
            `
          )}
        </ul>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'plan-view': PlanView;
  }
}
