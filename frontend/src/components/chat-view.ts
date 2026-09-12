import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { store } from '../state/app-state';
import { Chat, ConfigOption, DisplayItem } from '../api/types';
import './chat-header';
import './event-stream';
import './chat-composer';
import './chat-config';
import '@material/web/progress/circular-progress.js';
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/iconbutton/icon-button.js';

@customElement('chat-view')
export class ChatView extends LitElement {
  @property({ type: String })
  chatId: string = '';

  @state()
  private isConfigOpen = false;

  private unsubscribeStore?: () => void;

  static styles = css`
    :host {
      display: flex;
      flex-direction: row;
      height: 100%;
      width: 100%;
      overflow: hidden;
      position: relative;
      background-color: var(--md-sys-color-background);
    }

    .main-chat-area {
      display: flex;
      flex-direction: column;
      flex: 1;
      height: 100%;
      min-width: 0;
      position: relative;
    }

    .content-area {
      flex: 1;
      overflow: hidden;
      position: relative;
      display: flex;
      flex-direction: column;
    }

    .connecting-state, .error-state, .empty-state {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px 16px;
      text-align: center;
      gap: 16px;
      overflow-y: auto;
    }

    .connecting-title {
      font-size: 1.125rem;
      font-weight: 500;
      color: var(--md-sys-color-on-surface);
    }

    .connecting-sub {
      font-size: 0.875rem;
      color: var(--md-sys-color-on-surface-variant);
    }

    .empty-card {
      max-width: 540px;
      width: 100%;
      background-color: var(--md-sys-color-surface-container);
      border: 1px solid var(--md-sys-color-outline-variant);
      border-radius: 16px;
      padding: 24px;
      text-align: left;
      box-sizing: border-box;
    }

    .empty-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .empty-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: var(--md-sys-color-primary-container);
      color: var(--md-sys-color-on-primary-container);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 1.125rem;
      text-transform: uppercase;
    }

    .empty-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--md-sys-color-on-surface);
    }

    .empty-desc {
      font-size: 0.875rem;
      color: var(--md-sys-color-on-surface-variant);
      margin-top: 2px;
    }

    .side-sheet {
      width: 340px;
      height: 100%;
      background-color: var(--md-sys-color-surface-container-low);
      border-left: 1px solid var(--md-sys-color-outline-variant);
      display: flex;
      flex-direction: column;
      position: relative;
      transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 20;
    }

    .side-sheet.hidden {
      display: none;
    }

    .side-sheet-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 1px solid var(--md-sys-color-outline-variant);
      font-weight: 600;
      font-size: 0.9375rem;
      color: var(--md-sys-color-on-surface);
    }

    .side-sheet-body {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
    }

    .icon {
      font-family: 'Material Symbols Outlined';
      font-size: 20px;
      font-style: normal;
      font-weight: normal;
      line-height: 1;
    }

    @media (max-width: 839px) {
      .side-sheet {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        max-width: 360px;
        box-shadow: var(--md-sys-elevation-level3);
      }
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.unsubscribeStore = store.subscribe(() => {
      this.requestUpdate();
    });
  }

  disconnectedCallback() {
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
    }
    super.disconnectedCallback();
  }

  private handleToggleConfig = () => {
    this.isConfigOpen = !this.isConfigOpen;
  };

  private handleRetryConnect = () => {
    if (this.chatId) {
      store.connectChat(this.chatId);
    }
  };

  render() {
    const chat = store.activeChat;
    if (!chat) {
      return html`
        <div class="empty-state">
          <span class="icon" style="font-size: 48px; color: var(--md-sys-color-outline);">chat</span>
          <p>No chat selected</p>
        </div>
      `;
    }

    const isConnecting = store.connectingChats.has(this.chatId);
    const connectError = store.connectErrors[this.chatId];
    const items = store.activeReducer.items;
    const configOptions = store.configOptionsByChat[this.chatId] || [];

    return html`
      <div class="main-chat-area">
        <chat-header
          .chat=${chat}
          .isConfigOpen=${this.isConfigOpen}
          @toggle-config=${this.handleToggleConfig}
        ></chat-header>

        <div class="content-area">
          ${isConnecting
            ? html`
                <div class="connecting-state">
                  <md-circular-progress indeterminate></md-circular-progress>
                  <div class="connecting-title">Connecting to ${chat.agent}...</div>
                  <div class="connecting-sub">Initializing ACP session and loading tools</div>
                </div>
              `
            : connectError
            ? html`
                <div class="error-state">
                  <span class="icon" style="font-size: 48px; color: var(--md-sys-color-error);">error_outline</span>
                  <div class="connecting-title" style="color: var(--md-sys-color-error);">Connection Failed</div>
                  <div class="connecting-sub">${connectError}</div>
                  <md-filled-button @click=${this.handleRetryConnect}>
                    Retry Connection
                  </md-filled-button>
                </div>
              `
            : items.length === 0
            ? html`
                <div class="empty-state">
                  <div class="empty-card">
                    <div class="empty-header">
                      <div class="empty-avatar">${chat.agent[0]}</div>
                      <div>
                        <div class="empty-title">${chat.agent} connected</div>
                        <div class="empty-desc">Configure agent options below or send your first message to begin.</div>
                      </div>
                    </div>
                    <chat-config
                      .chatId=${chat.id}
                      .options=${configOptions}
                      .policy=${chat.permission_policy}
                    ></chat-config>
                  </div>
                </div>
              `
            : html`
                <event-stream
                  .items=${items}
                  .chatId=${chat.id}
                ></event-stream>
              `}
        </div>

        <chat-composer
          .chatId=${chat.id}
          .processState=${chat.process_state || 'STOPPED'}
          .turnState=${chat.turn_state || 'IDLE'}
          .disabled=${isConnecting}
        ></chat-composer>
      </div>

      <!-- Config Side Sheet -->
      <div class="side-sheet ${this.isConfigOpen ? '' : 'hidden'}">
        <div class="side-sheet-header">
          <span>Chat Configuration</span>
          <md-icon-button @click=${() => (this.isConfigOpen = false)}>
            <span class="icon">close</span>
          </md-icon-button>
        </div>
        <div class="side-sheet-body">
          <chat-config
            .chatId=${chat.id}
            .options=${configOptions}
            .policy=${chat.permission_policy}
          ></chat-config>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chat-view': ChatView;
  }
}
