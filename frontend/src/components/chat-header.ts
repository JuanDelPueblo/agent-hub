import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Chat } from '../api/types';
import { store } from '../state/app-state';
import { router } from '../router';
import { sharedStyles } from '../styles/shared';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/dialog/dialog.js';
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/button/filled-button.js';
import '@material/web/button/text-button.js';
import '@material/web/menu/menu.js';
import '@material/web/menu/menu-item.js';

@customElement('chat-header')
export class ChatHeader extends LitElement {
  @property({ type: Object })
  chat: Chat | null = null;

  @property({ type: Boolean })
  isConfigOpen: boolean = false;

  @state()
  private isRenameOpen = false;

  @state()
  private renameText = '';

  @state()
  private isMenuOpen = false;

  @state()
  private isDeleteDialogOpen = false;

  static styles = [sharedStyles, css`
    :host {
      display: block;
      background-color: var(--md-sys-color-surface);
      border-bottom: 1px solid color-mix(in srgb, var(--md-sys-color-outline-variant) 42%, transparent);
      padding: 10px var(--hub-space-5);
      height: 72px;
      box-sizing: border-box;
    }

    .delete-btn {
      --md-filled-button-container-color: var(--md-sys-color-error);
      --md-filled-button-label-text-color: var(--md-sys-color-on-error);
    }

    .header-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      gap: var(--hub-space-3);
    }

    .left-section {
      display: flex;
      align-items: center;
      gap: var(--hub-space-4);
      min-width: 0;
      flex: 1;
    }

    .nav-toggle {
      display: none;
    }

    @media (max-width: 839px) {
      .nav-toggle {
        display: inline-flex;
      }
    }

    .title-area {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .title-row {
      display: flex;
      align-items: center;
      gap: var(--hub-space-2);
    }

    .chat-title {
      border: 0;
      padding: 0;
      background: transparent;
      font-family: var(--md-sys-typescale-title-large-font-family);
      font-size: var(--md-sys-typescale-title-large-font-size);
      line-height: var(--md-sys-typescale-title-large-line-height);
      font-weight: var(--md-sys-typescale-title-large-font-weight);
      color: var(--md-sys-color-on-surface);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
      text-align: left;
    }

    .chat-title:hover {
      text-decoration: underline;
    }

    .badges {
      display: flex;
      align-items: center;
      gap: var(--hub-space-2);
      margin-top: var(--hub-space-1);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: var(--hub-space-1);
      padding: 3px 8px;
      border-radius: var(--md-sys-shape-corner-full);
      font-size: var(--md-sys-typescale-label-small-font-size);
      line-height: var(--md-sys-typescale-label-small-line-height);
      font-weight: var(--md-sys-typescale-label-small-font-weight);
      letter-spacing: var(--md-sys-typescale-label-small-letter-spacing);
    }

    .badge.agent {
      background-color: var(--md-sys-color-secondary-container);
      color: var(--md-sys-color-on-secondary-container);
    }

    .badge.running {
      background-color: var(--status-running-container);
      color: var(--status-running);
    }

    .badge.stopped {
      background-color: var(--status-stopped-container);
      color: var(--status-stopped);
    }

    .badge.dead {
      background-color: var(--status-dead-container);
      color: var(--status-dead);
    }

    .badge.prompting {
      background-color: var(--md-sys-color-primary-container);
      color: var(--md-sys-color-on-primary-container);
      animation: pulse var(--hub-duration-long1) var(--hub-easing-standard) infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }

    .right-section {
      display: flex;
      align-items: center;
      gap: var(--hub-space-1);
      position: relative;
    }

    .icon { --hub-icon-size: 22px; }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: var(--md-sys-shape-corner-full);
      display: inline-block;
    }

    .status-dot.running {
      background-color: var(--status-running);
    }

    .status-dot.stopped {
      background-color: var(--status-stopped);
    }

    .status-dot.dead {
      background-color: var(--status-dead);
    }

    .menu-anchor {
      position: relative;
    }

    .no-chat-label {
      color: var(--md-sys-color-on-surface-variant);
    }

    .danger-action {
      color: var(--md-sys-color-error);
    }

    .rename-field {
      width: 100%;
    }

    @media (max-width: 599px) {
      :host {
        padding-inline: var(--hub-space-2);
      }

      .chat-title {
        max-width: 42vw;
      }

      .right-section md-icon-button[title='Stop Process'],
      .right-section md-icon-button[title='Reconnect Process'] {
        display: none;
      }
    }
  `];

  private toggleNavDrawer() {
    store.setMobileDrawerOpen(!store.isMobileDrawerOpen);
  }

  private toggleConfig() {
    this.dispatchEvent(
      new CustomEvent('toggle-config', { bubbles: true, composed: true })
    );
  }

  private openRename() {
    if (this.chat) {
      this.renameText = this.chat.title;
      this.isRenameOpen = true;
    }
  }

  private async handleRenameSubmit() {
    if (this.chat && this.renameText.trim()) {
      await store.renameChat(this.chat.id, this.renameText.trim());
      this.isRenameOpen = false;
    }
  }

  private async handleStop() {
    if (this.chat) {
      await store.stopChatProcess(this.chat.id);
    }
  }

  private async handleReconnect() {
    if (this.chat) {
      // The store records a failure in `connectErrors`, and the chat view
      // shows it. Do not let the rejection escape this handler.
      await store.retryConnection(this.chat.id);
    }
  }

  private async handleToggleArchive() {
    if (this.chat) {
      await store.archiveChat(this.chat.id, !this.chat.archived);
    }
  }

  private handleDelete() {
    this.isDeleteDialogOpen = true;
  }

  private async handleConfirmDelete() {
    if (this.chat) {
      await store.deleteChat(this.chat.id);
      this.isDeleteDialogOpen = false;
    }
  }

  render() {
    if (!this.chat) {
      return html`
        <div class="header-container">
          <div class="left-section">
            <md-icon-button class="nav-toggle" @click=${this.toggleNavDrawer}>
              <span class="icon">menu</span>
            </md-icon-button>
            <span class="no-chat-label">No chat selected</span>
          </div>
        </div>
      `;
    }

    const { title, agent, process_state, turn_state, archived } = this.chat;
    const isRunning = process_state === 'RUNNING';
    const isPrompting = turn_state === 'PROMPTING';

    return html`
      <div class="header-container">
        <div class="left-section">
          <md-icon-button class="nav-toggle" @click=${this.toggleNavDrawer}>
            <span class="icon">menu</span>
          </md-icon-button>

          <div class="title-area">
            <div class="title-row">
              <button class="chat-title" type="button" @click=${this.openRename} title="Rename chat">
                ${title || 'Untitled chat'}
              </button>
              ${archived
                ? html`<span class="badge stopped">Archived</span>`
                : null}
            </div>

            <div class="badges">
              <span class="badge agent">${agent}</span>
              ${isPrompting
                ? html`<span class="badge prompting">Thinking...</span>`
                : null}
              <span
                class="badge ${isRunning ? 'running' : process_state === 'DEAD' ? 'dead' : 'stopped'}"
              >
                <span
                  class="status-dot ${isRunning ? 'running' : process_state === 'DEAD' ? 'dead' : 'stopped'}"
                ></span>
                ${process_state || 'STOPPED'}
              </span>
            </div>
          </div>
        </div>

        <div class="right-section">
          ${isRunning
            ? html`
                <md-icon-button
                  title="Stop Process"
                  @click=${this.handleStop}
                >
                  <span class="icon">pause_circle</span>
                </md-icon-button>
              `
            : html`
                <md-icon-button
                  title="Reconnect Process"
                  @click=${this.handleReconnect}
                >
                  <span class="icon">play_circle</span>
                </md-icon-button>
              `}

          <md-icon-button
            title="Chat Configuration"
            aria-label="Chat Configuration"
            @click=${this.toggleConfig}
          >
            <span class="icon">tune</span>
          </md-icon-button>

          <div class="menu-anchor">
            <md-icon-button
              id="menu-trigger"
              aria-label="Chat actions"
              @click=${() => (this.isMenuOpen = !this.isMenuOpen)}
            >
              <span class="icon">more_vert</span>
            </md-icon-button>

            <md-menu
              id="header-menu"
              anchor="menu-trigger"
              .open=${this.isMenuOpen}
              @closed=${() => (this.isMenuOpen = false)}
            >
              <md-menu-item @click=${this.openRename}>
                <div slot="headline">Rename Chat</div>
              </md-menu-item>
              ${isRunning
                ? html`
                    <md-menu-item @click=${this.handleStop}>
                      <div slot="headline">Stop Process</div>
                    </md-menu-item>
                  `
                : html`
                    <md-menu-item @click=${this.handleReconnect}>
                      <div slot="headline">Reconnect ACP</div>
                    </md-menu-item>
                  `}
              <md-menu-item @click=${this.handleToggleArchive}>
                <div slot="headline">
                  ${archived ? 'Unarchive Chat' : 'Archive Chat'}
                </div>
              </md-menu-item>
              <md-menu-item @click=${this.handleDelete}>
                <div slot="headline" class="danger-action">
                  Delete Chat
                </div>
              </md-menu-item>
            </md-menu>
          </div>
        </div>
      </div>

      <!-- Rename Dialog -->
      <md-dialog
        .open=${this.isRenameOpen}
        @closed=${() => (this.isRenameOpen = false)}
      >
        <div slot="headline">Rename Chat</div>
        <form slot="content" id="rename-form" method="dialog">
          <md-outlined-text-field
            label="Chat Title"
            .value=${this.renameText}
            @input=${(e: any) => (this.renameText = e.target.value)}
            class="rename-field"
            autofocus
          ></md-outlined-text-field>
        </form>
        <div slot="actions">
          <md-text-button @click=${() => (this.isRenameOpen = false)}>
            Cancel
          </md-text-button>
          <md-filled-button @click=${this.handleRenameSubmit}>
            Save
          </md-filled-button>
        </div>
      </md-dialog>

      <!-- Delete Chat Dialog -->
      <md-dialog
        .open=${this.isDeleteDialogOpen}
        @closed=${() => (this.isDeleteDialogOpen = false)}
      >
        <div slot="headline">Delete Chat</div>
        <div slot="content">
          Are you sure you want to delete "${this.chat.title || 'this chat'}"? This action cannot be undone.
        </div>
        <div slot="actions">
          <md-text-button @click=${() => (this.isDeleteDialogOpen = false)}>
            Cancel
          </md-text-button>
          <md-filled-button class="delete-btn" @click=${this.handleConfirmDelete}>
            Delete
          </md-filled-button>
        </div>
      </md-dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chat-header': ChatHeader;
  }
}
