import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { store } from '../state/app-state';
import { Chat, ConfigOption, DisplayItem } from '../api/types';
import { sharedStyles } from '../styles/shared';
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

  static styles = [sharedStyles, css`
    :host {
      display: flex;
      flex-direction: row;
      height: 100%;
      width: 100%;
      overflow: hidden;
      position: relative;
      background-color: var(--md-sys-color-background);
      color: var(--md-sys-color-on-surface);
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
      padding: var(--hub-space-8) var(--hub-page-gutter);
      text-align: center;
      gap: var(--hub-space-4);
      overflow-y: auto;
    }

    .connecting-title {
      font-family: var(--md-sys-typescale-title-large-font-family);
      font-size: var(--md-sys-typescale-title-large-font-size);
      line-height: var(--md-sys-typescale-title-large-line-height);
      font-weight: var(--md-sys-typescale-title-large-font-weight);
      color: var(--md-sys-color-on-surface);
    }

    .connecting-sub {
      font-size: var(--md-sys-typescale-body-medium-font-size);
      line-height: var(--md-sys-typescale-body-medium-line-height);
      color: var(--md-sys-color-on-surface-variant);
    }

    .empty-card {
      max-width: 540px;
      width: 100%;
      background-color: var(--md-sys-color-surface-container-low);
      border-radius: var(--md-sys-shape-corner-extra-large);
      padding: var(--hub-space-7);
      text-align: left;
      box-sizing: border-box;
    }

    .empty-header {
      display: flex;
      align-items: center;
      gap: var(--hub-space-3);
      margin-bottom: var(--hub-space-5);
    }

    .empty-avatar {
      width: 40px;
      height: 40px;
      border-radius: var(--md-sys-shape-corner-large) var(--md-sys-shape-corner-large) var(--md-sys-shape-corner-large) var(--md-sys-shape-corner-extra-small);
      background-color: var(--md-sys-color-primary-container);
      color: var(--md-sys-color-on-primary-container);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: var(--md-sys-typescale-title-large-font-weight);
      font-size: var(--md-sys-typescale-title-large-font-size);
      line-height: var(--md-sys-typescale-title-large-line-height);
      text-transform: uppercase;
    }

    .empty-title {
      font-family: var(--md-sys-typescale-title-large-font-family);
      font-size: var(--md-sys-typescale-title-large-font-size);
      line-height: var(--md-sys-typescale-title-large-line-height);
      font-weight: var(--md-sys-typescale-title-large-font-weight);
      color: var(--md-sys-color-on-surface);
    }

    .empty-desc {
      font-size: var(--md-sys-typescale-body-medium-font-size);
      line-height: var(--md-sys-typescale-body-medium-line-height);
      color: var(--md-sys-color-on-surface-variant);
      margin-top: 2px;
    }

    .side-sheet {
      width: 360px;
      height: 100%;
      background-color: var(--md-sys-color-surface-container-lowest);
      border-left: 1px solid color-mix(in srgb, var(--md-sys-color-outline-variant) 42%, transparent);
      box-shadow: var(--md-sys-elevation-level3);
      display: flex;
      flex-direction: column;
      position: relative;
      transition: width var(--hub-duration-medium2) var(--hub-easing-emphasized),
        transform var(--hub-duration-medium2) var(--hub-easing-emphasized),
        opacity var(--hub-duration-short4) var(--hub-easing-standard);
      z-index: 20;
    }

    .side-sheet.hidden {
      width: 0;
      transform: translateX(32px);
      opacity: 0;
      pointer-events: none;
      border-left-color: transparent;
      box-shadow: none;
      overflow: hidden;
    }

    .side-sheet-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--hub-space-4) var(--hub-space-5);
      border-bottom: 1px solid color-mix(in srgb, var(--md-sys-color-outline-variant) 42%, transparent);
      font-family: var(--md-sys-typescale-title-medium-font-family);
      font-weight: var(--md-sys-typescale-title-medium-font-weight);
      font-size: var(--md-sys-typescale-title-medium-font-size);
      line-height: var(--md-sys-typescale-title-medium-line-height);
      color: var(--md-sys-color-on-surface);
    }

    .side-sheet-body {
      flex: 1;
      overflow-y: auto;
      padding: var(--hub-space-6);
    }

    .icon { --hub-icon-size: 24px; }

    .state-icon {
      --hub-icon-size: 48px;
      color: var(--md-sys-color-outline);
    }

    .error-icon {
      --hub-icon-size: 48px;
      color: var(--md-sys-color-error);
    }

    .error-title {
      color: var(--md-sys-color-error);
    }

    @media (max-width: 839px) {
      .side-sheet {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        max-width: 360px;
        box-shadow: var(--md-sys-elevation-level4);
      }

      .side-sheet.hidden {
        width: min(100%, 360px);
        transform: translateX(100%);
      }

      .connecting-state, .error-state, .empty-state {
        padding: var(--hub-space-7) var(--hub-page-gutter-compact);
      }
    }
  `];

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
      store.retryConnection(this.chatId);
    }
  };

  render() {
    const chat = store.activeChat;
    if (!chat) {
      return html`
        <div class="empty-state">
          <span class="icon state-icon">chat</span>
          <p>No chat selected</p>
        </div>
      `;
    }

    const isConnecting = store.connectingChats.has(this.chatId);
    const connectError = store.connectErrors[this.chatId];
    const items = store.activeReducer.items;
    const configOptions = store.configOptionsByChat[this.chatId] || [];
    // An empty list means the agent advertises no options. It does not mean
    // that the config request is still open or that it failed.
    const configLoaded = store.configLoadedByChat[this.chatId] === true;
    const composerDisabled = isConnecting || !!connectError || !configLoaded;

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
                  <span class="icon error-icon">error_outline</span>
                  <div class="connecting-title error-title">Connection Failed</div>
                  <div class="connecting-sub">${connectError}</div>
                  <md-filled-button @click=${this.handleRetryConnect}>
                    Retry Connection
                  </md-filled-button>
                </div>
              `
            : !configLoaded && items.length === 0
            ? html`
                <div class="error-state">
                  <span class="icon state-icon">tune</span>
                  <div class="connecting-title">Agent options not loaded</div>
                  <div class="connecting-sub">
                    Agent Hub cannot read the configuration of ${chat.agent} yet.
                  </div>
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
                      .chat=${chat}
                      .options=${configOptions}
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
          .disabled=${composerDisabled}
        ></chat-composer>
      </div>

      <!-- Config Side Sheet -->
      <div class="side-sheet ${this.isConfigOpen ? '' : 'hidden'}">
        <div class="side-sheet-header">
          <span>Chat Configuration</span>
          <md-icon-button
            aria-label="Close chat configuration"
            @click=${() => (this.isConfigOpen = false)}
          >
            <span class="icon">close</span>
          </md-icon-button>
        </div>
        <div class="side-sheet-body">
          <chat-config
            .chat=${chat}
            .options=${configOptions}
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
