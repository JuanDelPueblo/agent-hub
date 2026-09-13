import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { TurnEntryPermission } from '../api/types';
import { store } from '../state/app-state';
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/button/text-button.js';

@customElement('permission-card')
export class PermissionCard extends LitElement {
  @property({ type: Object })
  permission!: TurnEntryPermission;

  @property({ type: String })
  chatId: string = '';

  static styles = css`
    :host {
      display: block;
      margin: 12px 0;
    }

    .card {
      background-color: var(--md-sys-color-surface-container-high);
      border: 1.5px solid var(--md-sys-color-error);
      border-radius: var(--md-sys-shape-corner-medium, 12px);
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .card.responded {
      border-color: var(--md-sys-color-outline-variant);
      background-color: var(--md-sys-color-surface-container-low);
      opacity: 0.85;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: var(--md-sys-color-error);
      font-size: 0.9375rem;
    }

    .card.responded .header {
      color: var(--md-sys-color-on-surface-variant);
    }

    .icon {
      font-family: 'Material Symbols Outlined';
      font-size: 20px;
      font-style: normal;
      font-weight: normal;
      line-height: 1;
    }

    .tool-details {
      font-size: 0.875rem;
      background-color: var(--md-sys-color-surface-container-lowest);
      border-radius: 8px;
      padding: 10px 12px;
      font-family: monospace;
      color: var(--md-sys-color-on-surface);
      white-space: pre-wrap;
      word-break: break-word;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: flex-end;
      margin-top: 4px;
    }

    .decision-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.8125rem;
      padding: 4px 10px;
      border-radius: 6px;
      background-color: var(--md-sys-color-surface-container-highest);
      color: var(--md-sys-color-on-surface-variant);
      font-weight: 500;
    }
  `;

  private handleRespond(granted: boolean) {
    if (!this.chatId || !this.permission.requestId) return;
    store.respondPermission(this.chatId, this.permission.requestId, granted);
  }

  render() {
    if (!this.permission) return html``;

    const { method, description, responded, decision } = this.permission;
    const title = description || method || 'Action requested';
    const methodDisplay = method ? ` (${method})` : '';

    return html`
      <div class="card ${responded ? 'responded' : ''}">
        <div class="header">
          <span class="icon">shield_person</span>
          <span>Permission Request${methodDisplay}</span>
        </div>

        <div class="tool-details">${title}</div>

        ${responded
          ? html`
              <div class="decision-badge">
                <span class="icon" style="font-size: 16px;">check</span>
                <span>Responded: ${decision || 'Handled'}</span>
              </div>
            `
          : html`
              <div class="actions">
                <md-outlined-button
                  @click=${() => this.handleRespond(false)}
                >
                  Deny
                </md-outlined-button>
                <md-filled-button
                  @click=${() => this.handleRespond(true)}
                >
                  Allow
                </md-filled-button>
              </div>
            `}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'permission-card': PermissionCard;
  }
}
