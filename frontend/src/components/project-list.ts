import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { store } from '../state/app-state';
import { router } from '../router';
import { Project } from '../api/types';
import '@material/web/fab/fab.js';
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/iconbutton/icon-button.js';

@customElement('project-list')
export class ProjectList extends LitElement {
  private unsubscribeStore?: () => void;

  static styles = css`
    :host {
      display: block;
      height: 100%;
      overflow-y: auto;
      padding: 24px;
      box-sizing: border-box;
      background-color: var(--md-sys-color-background);
    }

    .container {
      max-width: 1080px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
    }

    .title-group h1 {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--md-sys-color-on-background);
    }

    .title-group p {
      margin: 4px 0 0;
      font-size: 0.9375rem;
      color: var(--md-sys-color-on-surface-variant);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 16px;
    }

    .project-card {
      background-color: var(--md-sys-color-surface-container);
      border: 1px solid var(--md-sys-color-outline-variant);
      border-radius: var(--md-sys-shape-corner-large, 16px);
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
    }

    .project-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--md-sys-elevation-level2);
      border-color: var(--md-sys-color-primary);
    }

    .card-top {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      margin-bottom: 12px;
    }

    .card-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background-color: var(--md-sys-color-secondary-container);
      color: var(--md-sys-color-on-secondary-container);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .card-details {
      min-width: 0;
      flex: 1;
    }

    .card-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--md-sys-color-on-surface);
      margin: 0 0 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .card-path {
      font-size: 0.8125rem;
      color: var(--md-sys-color-outline);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-family: monospace;
    }

    .card-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.8125rem;
      color: var(--md-sys-color-on-surface-variant);
      padding-top: 12px;
      border-top: 1px solid var(--md-sys-color-outline-variant);
    }

    .chat-count {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 500;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px 16px;
      text-align: center;
      background-color: var(--md-sys-color-surface-container-low);
      border-radius: 20px;
      border: 1px dashed var(--md-sys-color-outline-variant);
      margin-top: 32px;
    }

    .empty-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background-color: var(--md-sys-color-primary-container);
      color: var(--md-sys-color-on-primary-container);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }

    .empty-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--md-sys-color-on-surface);
      margin: 0 0 8px;
    }

    .empty-desc {
      font-size: 0.9375rem;
      color: var(--md-sys-color-on-surface-variant);
      max-width: 440px;
      margin: 0 0 24px;
      line-height: 1.5;
    }

    .fab-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 50;
    }

    .icon {
      font-family: 'Material Symbols Outlined';
      font-size: 24px;
      font-style: normal;
      font-weight: normal;
      line-height: 1;
    }

    @media (max-width: 599px) {
      :host {
        padding: 16px;
      }
      .grid {
        grid-template-columns: 1fr;
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

  private openNewProjectDialog() {
    this.dispatchEvent(
      new CustomEvent('open-new-project', { bubbles: true, composed: true })
    );
  }

  private handleProjectClick(project: Project) {
    router.navigate(`/projects/${project.id}`);
  }

  render() {
    const { projects, chatsByProject } = store;

    return html`
      <div class="container">
        <div class="header">
          <div class="title-group">
            <h1>Projects</h1>
            <p>Manage code repositories and active ACP agent sessions</p>
          </div>
          <md-filled-button @click=${this.openNewProjectDialog}>
            <span class="icon" slot="icon" style="font-size: 20px;">add</span>
            New Project
          </md-filled-button>
        </div>

        ${projects.length === 0
          ? html`
              <div class="empty-state">
                <div class="empty-icon">
                  <span class="icon" style="font-size: 32px;">folder_open</span>
                </div>
                <h2 class="empty-title">No projects yet</h2>
                <p class="empty-desc">
                  Create a project by selecting an existing directory on your
                  server or cloning a Git repository.
                </p>
                <md-filled-button @click=${this.openNewProjectDialog}>
                  <span class="icon" slot="icon" style="font-size: 20px;">add</span>
                  Create Your First Project
                </md-filled-button>
              </div>
            `
          : html`
              <div class="grid">
                ${projects.map((p) => {
                  const chats = chatsByProject[p.id] || [];
                  return html`
                    <div
                      class="project-card"
                      @click=${() => this.handleProjectClick(p)}
                    >
                      <div class="card-top">
                        <div class="card-icon">
                          <span class="icon">folder</span>
                        </div>
                        <div class="card-details">
                          <h2 class="card-title">${p.name}</h2>
                          <div class="card-path" title=${p.path}>
                            ${p.path}
                          </div>
                        </div>
                      </div>

                      <div class="card-meta">
                        <span class="chat-count">
                          <span class="icon" style="font-size: 16px;">chat</span>
                          ${chats.length} chat${chats.length === 1 ? '' : 's'}
                        </span>
                        <span style="font-size: 0.75rem; color: var(--md-sys-color-outline)">
                          ${new Date(p.updated_at || p.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  `;
                })}
              </div>
            `}
      </div>

      <div class="fab-container">
        <md-fab
          label="New Project"
          @click=${this.openNewProjectDialog}
        >
          <span class="icon" slot="icon">add</span>
        </md-fab>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'project-list': ProjectList;
  }
}
