import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PlanEntry } from '../api/types';

@customElement('plan-view')
export class PlanView extends LitElement {
  @property({ type: Array })
  entries: PlanEntry[] = [];

  static styles = css`
    :host {
      display: block;
      margin: 8px 0;
    }

    .plan-card {
      background-color: var(--md-sys-color-surface-container);
      border: 1px solid var(--md-sys-color-outline-variant);
      border-radius: var(--md-sys-shape-corner-medium, 12px);
      padding: 12px 16px;
    }

    .plan-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
      font-size: 0.8125rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--md-sys-color-primary);
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
      gap: 10px;
      font-size: 0.875rem;
      line-height: 1.4;
      color: var(--md-sys-color-on-surface);
    }

    .icon {
      font-family: 'Material Symbols Outlined';
      font-size: 18px;
      font-style: normal;
      font-weight: normal;
      line-height: 1;
      display: inline-block;
      margin-top: 1px;
      flex-shrink: 0;
    }

    .icon.completed {
      color: var(--hub-status-running, #34a853);
    }

    .icon.in_progress {
      color: var(--md-sys-color-primary);
      animation: spin 1.5s linear infinite;
    }

    .icon.pending {
      color: var(--md-sys-color-outline);
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
  `;

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
