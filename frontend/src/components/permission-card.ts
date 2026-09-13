import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { TurnEntryPermission } from '../api/types';
import { store } from '../state/app-state';
import { sharedStyles } from '../styles/shared';
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/button/text-button.js';

@customElement('permission-card')
export class PermissionCard extends LitElement {
  @property({ type: Object })
  permission!: TurnEntryPermission;

  @property({ type: String })
  chatId: string = '';

  static styles = [sharedStyles, css`
    :host {
      display: block;
      margin: var(--hub-space-4) 0;
    }

    .card {
      background-color: var(--md-sys-color-error-container);
      border: 1px solid color-mix(in srgb, var(--md-sys-color-error) 52%, transparent);
      border-radius: var(--md-sys-shape-corner-large);
      padding: var(--hub-space-5);
      display: flex;
      flex-direction: column;
      gap: var(--hub-space-4);
      box-shadow: var(--md-sys-elevation-level1);
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
      font-weight: var(--md-sys-typescale-title-medium-font-weight);
      color: var(--md-sys-color-error);
      font-size: var(--md-sys-typescale-title-medium-font-size);
      line-height: var(--md-sys-typescale-title-medium-line-height);
    }

    .card.responded .header {
      color: var(--md-sys-color-on-surface-variant);
    }

    .icon { --hub-icon-size: 22px; --hub-icon-fill: 1; }

    .tool-details {
      font-size: var(--md-sys-typescale-body-medium-font-size);
      line-height: var(--md-sys-typescale-body-medium-line-height);
      background-color: color-mix(in srgb, var(--md-sys-color-surface-container-lowest) 78%, transparent);
      border-radius: var(--md-sys-shape-corner-medium);
      padding: var(--hub-space-4);
      font-family: var(--md-sys-typescale-code-font);
      color: var(--md-sys-color-on-surface);
      white-space: pre-wrap;
      word-break: break-word;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--hub-space-2);
      justify-content: flex-end;
      margin-top: var(--hub-space-1);
    }

    .decision-badge {
      display: inline-flex;
      align-items: center;
      gap: var(--hub-space-2);
      font-size: var(--md-sys-typescale-body-small-font-size);
      padding: 5px 10px;
      border-radius: var(--md-sys-shape-corner-small);
      background-color: var(--md-sys-color-surface-container-highest);
      color: var(--md-sys-color-on-surface-variant);
      font-weight: var(--md-sys-typescale-label-large-font-weight);
    }

    .decision-icon {
      --hub-icon-size: 18px;
    }
  `];

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
                <span class="icon decision-icon">check</span>
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
