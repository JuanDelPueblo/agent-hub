import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '@material/web/select/outlined-select.js';
import '@material/web/select/select-option.js';
import '@material/web/switch/switch.js';
import '@material/web/divider/divider.js';
import '@material/web/icon/icon.js';
import { Chat, ConfigOption, PermissionPolicy } from '../api/types';
import { store } from '../state/app-state';

@customElement('chat-config')
export class ChatConfig extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 16px;
      font-family: var(--md-sys-typescale-body-font);
    }

    .config-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--md-sys-color-on-surface);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .config-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .config-boolean-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 6px 0;
    }

    .item-label {
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--md-sys-color-on-surface);
    }

    .item-desc {
      font-size: 0.75rem;
      color: var(--md-sys-color-on-surface-variant);
      line-height: 1.3;
    }

    .unsupported-type {
      padding: 8px 12px;
      background-color: var(--md-sys-color-surface-container);
      border-radius: var(--md-sys-shape-corner-small);
      font-size: 0.8rem;
      color: var(--md-sys-color-outline);
    }

    select.native-select {
      appearance: none;
      -webkit-appearance: none;
      background-color: var(--md-sys-color-surface-container-high);
      border: 1px solid var(--md-sys-color-outline-variant);
      border-radius: var(--md-sys-shape-corner-small);
      color: var(--md-sys-color-on-surface);
      padding: 8px 12px;
      font-size: 0.85rem;
      cursor: pointer;
      width: 100%;
      outline: none;
    }

    select.native-select:focus {
      border-color: var(--md-sys-color-primary);
    }
  `;

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
            <div class="item-desc" style="font-style: italic;">
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
                  <div style="flex: 1;">
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
