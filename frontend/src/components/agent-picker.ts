import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '@material/web/dialog/dialog.js';
import '@material/web/button/filled-button.js';
import '@material/web/button/text-button.js';
import '@material/web/icon/icon.js';
import { api } from '../api/client';
import { store } from '../state/app-state';
import { router } from '../router';

@customElement('agent-picker')
export class AgentPicker extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .agent-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px;
      margin-top: 12px;
    }

    .agent-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px 16px;
      border-radius: var(--md-sys-shape-corner-medium);
      background-color: var(--md-sys-color-surface-container-low);
      border: 2px solid transparent;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: center;
      gap: 8px;
    }

    .agent-card:hover {
      background-color: var(--md-sys-color-surface-container);
      transform: translateY(-2px);
    }

    .agent-card.selected {
      background-color: var(--md-sys-color-primary-container);
      border-color: var(--md-sys-color-primary);
    }

    .agent-card md-icon {
      font-size: 32px;
      color: var(--md-sys-color-primary);
    }

    .agent-card .name {
      font-weight: 600;
      font-size: 0.95rem;
      text-transform: capitalize;
      color: var(--md-sys-color-on-surface);
    }

    .error-box {
      padding: 8px 12px;
      background-color: var(--md-sys-color-error-container);
      color: var(--md-sys-color-on-error-container);
      border-radius: 6px;
      font-size: 0.85rem;
      margin-bottom: 12px;
    }
  `;

  @property({ type: String }) projectId = '';
  @state() public isOpen = false;
  @state() private selectedAgent = '';
  @state() private creating = false;
  @state() private errorMessage = '';

  public show(projectId?: string) {
    if (projectId) this.projectId = projectId;
    this.isOpen = true;
    this.selectedAgent = store.agents[0] || 'codex';
    this.creating = false;
    this.errorMessage = '';
  }

  public close() {
    this.isOpen = false;
  }

  private async handleCreate() {
    if (!this.projectId || !this.selectedAgent) return;
    this.creating = true;
    this.errorMessage = '';

    try {
      const chat = await api.createChat(this.projectId, this.selectedAgent);
      await store.loadChats(this.projectId);
      this.close();
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
      <md-dialog ?open=${this.isOpen} @closed=${() => (this.isOpen = false)}>
        <div slot="headline">Select Agent</div>

        <div slot="content">
          ${this.errorMessage
            ? html`<div class="error-box">${this.errorMessage}</div>`
            : ''}

          <div class="agent-grid">
            ${store.agents.map(
              (agent) => html`
                <div
                  class="agent-card ${this.selectedAgent === agent ? 'selected' : ''}"
                  @click=${() => (this.selectedAgent = agent)}
                  role="button"
                  tabindex="0"
                  @keydown=${(e: KeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      this.selectedAgent = agent;
                    }
                  }}
                >
                  <md-icon class="material-symbols-outlined">
                    ${this.agentIcon(agent)}
                  </md-icon>
                  <span class="name">${agent}</span>
                </div>
              `
            )}
          </div>
        </div>

        <div slot="actions">
          <md-text-button @click=${this.close} ?disabled=${this.creating}>
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
