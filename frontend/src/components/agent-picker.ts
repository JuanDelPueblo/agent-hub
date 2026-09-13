import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '@material/web/dialog/dialog.js';
import '@material/web/button/filled-button.js';
import '@material/web/button/text-button.js';
import '@material/web/icon/icon.js';
import { api } from '../api/client';
import { store } from '../state/app-state';
import { router } from '../router';
import { sharedStyles } from '../styles/shared';

@customElement('agent-picker')
export class AgentPicker extends LitElement {
  static styles = [sharedStyles, css`
    :host {
      display: block;
    }

    .agent-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: var(--hub-space-3);
      margin-top: var(--hub-space-3);
    }

    .agent-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--hub-space-6) var(--hub-space-4);
      border-radius: var(--md-sys-shape-corner-large);
      background-color: var(--md-sys-color-surface-container-low);
      border: 1px solid transparent;
      cursor: pointer;
      transition: background-color var(--hub-duration-short4) var(--hub-easing-standard),
        box-shadow var(--hub-duration-short4) var(--hub-easing-standard),
        transform var(--hub-duration-short3) var(--hub-easing-standard);
      text-align: center;
      gap: var(--hub-space-2);
      color: var(--md-sys-color-on-surface);
    }

    .agent-card:hover {
      background-color: var(--md-sys-color-surface-container);
      box-shadow: var(--md-sys-elevation-level1);
      transform: translateY(-2px);
    }

    .agent-card.selected {
      background-color: var(--md-sys-color-primary-container);
      border-color: var(--md-sys-color-primary);
      box-shadow: var(--md-sys-elevation-level1);
    }

    .agent-card md-icon {
      --hub-icon-size: 32px;
      color: var(--md-sys-color-primary);
    }

    .agent-card .name {
      font-weight: var(--md-sys-typescale-title-medium-font-weight);
      font-size: var(--md-sys-typescale-title-medium-font-size);
      line-height: var(--md-sys-typescale-title-medium-line-height);
      text-transform: capitalize;
      color: var(--md-sys-color-on-surface);
    }

    .error-box {
      padding: var(--hub-space-3) var(--hub-space-4);
      background-color: var(--md-sys-color-error-container);
      color: var(--md-sys-color-on-error-container);
      border-radius: var(--md-sys-shape-corner-medium);
      font-size: var(--md-sys-typescale-body-medium-font-size);
      margin-bottom: var(--hub-space-3);
    }
  `];

  @property({ type: String }) projectId = '';
  @property({ type: Boolean }) public open = false;
  @state() private selectedAgent = '';
  @state() private creating = false;
  @state() private errorMessage = '';

  protected updated(changedProperties: any) {
    if (changedProperties.has('open') && this.open) {
      this.selectedAgent = store.agents[0] || 'codex';
      this.creating = false;
      this.errorMessage = '';
    }
  }

  public show(projectId?: string) {
    if (projectId) this.projectId = projectId;
    this.open = true;
  }

  public close() {
    this.handleClose();
  }

  private handleClose() {
    this.open = false;
    this.dispatchEvent(
      new CustomEvent('dialog-closed', { bubbles: true, composed: true })
    );
    this.dispatchEvent(
      new CustomEvent('close', { bubbles: true, composed: true })
    );
  }

  private async handleCreate() {
    if (!this.projectId || !this.selectedAgent) return;
    this.creating = true;
    this.errorMessage = '';

    try {
      const chat = await api.createChat(this.projectId, this.selectedAgent);
      await store.loadChats(this.projectId);
      this.handleClose();
      router.navigate(`/projects/${this.projectId}/chats/${chat.id}`);
    } catch (e: any) {
      this.errorMessage = e?.message || 'Failed to create chat';
    } finally {
      this.creating = false;
    }
  }

  private agentIcon(agent: string): string {
    const a = agent.toLowerCase();
    if (a.includes('codex')) return 'terminal';
    if (a.includes('claude')) return 'smart_toy';
    if (a.includes('opencode')) return 'code';
    if (a.includes('gemini') || a.includes('antigravity')) return 'psychology';
    return 'robot_2';
  }

  render() {
    return html`
      <md-dialog ?open=${this.open} @closed=${this.handleClose}>
        <div slot="headline">Select Agent</div>

        <div slot="content">
          ${this.errorMessage
            ? html`<div class="error-box">${this.errorMessage}</div>`
            : ''}

          <div class="agent-grid">
            ${store.agents.map(
              (agent) => html`
                <button
                  class="agent-card ${this.selectedAgent === agent ? 'selected' : ''}"
                  type="button"
                  aria-pressed=${this.selectedAgent === agent ? 'true' : 'false'}
                  @click=${() => (this.selectedAgent = agent)}
                >
                  <md-icon class="material-symbols-outlined">
                    ${this.agentIcon(agent)}
                  </md-icon>
                  <span class="name">${agent}</span>
                </button>
              `
            )}
          </div>
        </div>

        <div slot="actions">
          <md-text-button @click=${this.handleClose} ?disabled=${this.creating}>
            Cancel
          </md-text-button>
          <md-filled-button
            @click=${this.handleCreate}
            ?disabled=${!this.selectedAgent || this.creating}
          >
            Start Chat
          </md-filled-button>
        </div>
      </md-dialog>
    `;
  }
}
