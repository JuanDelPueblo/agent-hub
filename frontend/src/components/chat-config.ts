import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '@material/web/select/outlined-select.js';
import '@material/web/select/select-option.js';
import '@material/web/switch/switch.js';
import '@material/web/divider/divider.js';
import '@material/web/icon/icon.js';
import { Chat, ConfigOption, PermissionPolicy } from '../api/types';
import { store } from '../state/app-state';
import { sharedStyles } from '../styles/shared';

@customElement('chat-config')
export class ChatConfig extends LitElement {
  static styles = [sharedStyles, css`
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--hub-space-5);
    }

    .config-title {
      font-family: var(--md-sys-typescale-title-medium-font-family);
      font-size: var(--md-sys-typescale-title-medium-font-size);
      line-height: var(--md-sys-typescale-title-medium-line-height);
      font-weight: var(--md-sys-typescale-title-medium-font-weight);
      color: var(--md-sys-color-on-surface);
      display: flex;
      align-items: center;
      gap: var(--hub-space-2);
    }

    .config-item {
      display: flex;
      flex-direction: column;
      gap: var(--hub-space-2);
    }

    .config-boolean-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--hub-space-3);
      padding: var(--hub-space-2) 0;
    }

    .item-label {
      font-size: var(--md-sys-typescale-body-medium-font-size);
      line-height: var(--md-sys-typescale-body-medium-line-height);
      font-weight: var(--md-sys-typescale-label-large-font-weight);
      color: var(--md-sys-color-on-surface);
    }

    .item-desc {
      font-size: var(--md-sys-typescale-body-small-font-size);
      line-height: var(--md-sys-typescale-body-small-line-height);
      color: var(--md-sys-color-on-surface-variant);
      line-height: 1.3;
    }

    .unsupported-type {
      padding: var(--hub-space-3) var(--hub-space-4);
      background-color: var(--md-sys-color-surface-container);
      border-radius: var(--md-sys-shape-corner-medium);
      font-size: var(--md-sys-typescale-body-small-font-size);
      color: var(--md-sys-color-outline);
    }

    select.native-select {
      appearance: none;
      -webkit-appearance: none;
      background-color: var(--md-sys-color-surface-container-high);
      border: 1px solid var(--md-sys-color-outline-variant);
      border-radius: var(--md-sys-shape-corner-medium);
      color: var(--md-sys-color-on-surface);
      padding: var(--hub-space-3) var(--hub-space-4);
      font-size: var(--md-sys-typescale-body-medium-font-size);
      cursor: pointer;
      width: 100%;
      outline: none;
    }

    select.native-select:focus {
      border-color: var(--md-sys-color-primary);
      box-shadow: var(--hub-focus-ring);
    }

    .config-column {
      flex: 1;
    }

    .no-options {
      font-style: italic;
    }
  `];

  @property({ type: Object }) chat: Chat | null = null;
  @property({ type: Array }) options: ConfigOption[] = [];

  private async handlePolicyChange(e: Event) {
    const val = (e.target as HTMLSelectElement).value as PermissionPolicy;
    if (this.chat) {
      await store.setChatPolicy(this.chat.id, val);
    }
  }

  private async handleConfigSelect(optionId: string, e: Event) {
    const val = (e.target as HTMLSelectElement).value;
    if (this.chat) {
      await store.setChatConfig(this.chat.id, optionId, val);
    }
  }

  private async handleConfigBool(optionId: string, e: Event) {
    const checked = (e.target as any).selected || (e.target as any).checked;
    if (this.chat) {
      await store.setChatConfig(this.chat.id, optionId, checked);
    }
  }

  render() {
    if (!this.chat) return html``;

    return html`
      <div class="config-title">
        <md-icon class="material-symbols-outlined">tune</md-icon>
        <span>Configuration & Permissions</span>
      </div>

      <!-- Permission Policy -->
      <div class="config-item">
        <span class="item-label">Permission Policy</span>
        <span class="item-desc">
          Controls whether the agent must ask before running commands or editing files.
        </span>
        <select
          class="native-select"
          .value=${this.chat.permission_policy}
          @change=${this.handlePolicyChange}
        >
          <option value="ask">Ask every time</option>
          <option value="read-only">Read-only (Deny all writes)</option>
          <option value="auto-approve">Auto-approve (Grant all permissions)</option>
          <option value="deny-all">Deny-all (Block all actions)</option>
        </select>
      </div>

      <md-divider></md-divider>

      <!-- ACP Dynamically Advertised Config Options -->
      ${this.options.length === 0
        ? html`
            <div class="item-desc no-options">
              No additional agent configuration options advertised.
            </div>
          `
        : this.options.map((opt) => {
            if (opt.type === 'select') {
              return html`
                <div class="config-item">
                  <span class="item-label">${opt.name}</span>
                  ${opt.description
                    ? html`<span class="item-desc">${opt.description}</span>`
                    : ''}
                  <select
                    class="native-select"
                    .value=${String(opt.currentValue ?? '')}
                    @change=${(e: Event) => this.handleConfigSelect(opt.id, e)}
                  >
                    ${opt.options?.map((item: any) => {
                      if (item.options && Array.isArray(item.options)) {
                        return html`
                          <optgroup label=${item.group || item.name || ''}>
                            ${item.options.map(
                              (sub: any) => html`
                                <option
                                  value=${String(sub.value)}
                                  ?selected=${sub.value === opt.currentValue}
                                >
                                  ${sub.name || sub.value}
                                </option>
                              `
                            )}
                          </optgroup>
                        `;
                      }
                      return html`
                        <option
                          value=${String(item.value)}
                          ?selected=${item.value === opt.currentValue}
                        >
                          ${item.name || item.value}
                        </option>
                      `;
                    })}
                  </select>
                </div>
              `;
            }

            if (opt.type === 'boolean') {
              return html`
                <div class="config-boolean-item">
                  <div class="config-column">
                    <div class="item-label">${opt.name}</div>
                    ${opt.description
                      ? html`<div class="item-desc">${opt.description}</div>`
                      : ''}
                  </div>
                  <md-switch
                    ?selected=${Boolean(opt.currentValue)}
                    @change=${(e: Event) => this.handleConfigBool(opt.id, e)}
                  ></md-switch>
                </div>
              `;
            }

            return html`
              <div class="config-item">
                <span class="item-label">${opt.name}</span>
                <div class="unsupported-type">
                  ${String(opt.currentValue ?? '')} (type: ${opt.type})
                </div>
              </div>
            `;
          })}
    `;
  }
}
