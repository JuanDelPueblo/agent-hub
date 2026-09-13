import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Chat } from '../api/types';
import { store } from '../state/app-state';
import { router } from '../router';
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

  static styles = css`
    :host {
      display: block;
      background-color: var(--md-sys-color-surface-container);
      border-bottom: 1px solid var(--md-sys-color-outline-variant);
      padding: 8px 16px;
      height: 64px;
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
      gap: 12px;
    }

    .left-section {
      display: flex;
      align-items: center;
      gap: 12px;
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
      gap: 8px;
    }

    .chat-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--md-sys-color-on-surface);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
    }

    .chat-title:hover {
      text-decoration: underline;
    }

    .badges {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 2px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 1px 6px;
      border-radius: 6px;
      font-size: 0.6875rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .badge.agent {
      background-color: var(--md-sys-color-secondary-container);
      color: var(--md-sys-color-on-secondary-container);
    }

    .badge.running {
      background-color: #e6f4ea;
      color: #137333;
    }

    .badge.stopped {
      background-color: #f1f3f4;
      color: #5f6368;
    }

    .badge.dead {
      background-color: #fce8e6;
      color: #c5221f;
    }

    .badge.prompting {
      background-color: #e8f0fe;
      color: #1a73e8;
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }

    .right-section {
      display: flex;
      align-items: center;
      gap: 4px;
      position: relative;
    }

    .icon {
      font-family: 'Material Symbols Outlined';
      font-size: 20px;
      font-style: normal;
      font-weight: normal;
      line-height: 1;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      display: inline-block;
    }

    .status-dot.running {
      background-color: #34a853;
    }

    .status-dot.stopped {
      background-color: #9aa0a6;
    }

    .status-dot.dead {
      background-color: #ea4335;
    }

    .menu-anchor {
      position: relative;
    }
  `;

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
            <span style="color: var(--md-sys-color-outline)">No chat selected</span>
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
              <span class="chat-title" @click=${this.openRename} title="Click to rename">
                ${title || 'Untitled chat'}
              </span>
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
            @click=${this.toggleConfig}
          >
            <span class="icon">tune</span>
          </md-icon-button>

          <div class="menu-anchor">
            <md-icon-button
              id="menu-trigger"
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
                <div slot="headline" style="color: var(--md-sys-color-error)">
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
            style="width: 100%;"
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
