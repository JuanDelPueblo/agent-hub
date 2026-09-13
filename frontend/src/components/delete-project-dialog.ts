import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '@material/web/dialog/dialog.js';
import '@material/web/button/filled-button.js';
import '@material/web/button/text-button.js';
import { Project } from '../api/types';
import { store } from '../state/app-state';
import { sharedStyles } from '../styles/shared';

@customElement('delete-project-dialog')
export class DeleteProjectDialog extends LitElement {
  static styles = [sharedStyles, css`
    :host {
      display: block;
    }

    .dialog-content {
      display: flex;
      flex-direction: column;
      gap: var(--hub-space-4);
      min-width: min(280px, calc(100vw - 48px));
      max-width: 480px;
    }

    .warning-text {
      font-size: var(--md-sys-typescale-body-large-font-size);
      color: var(--md-sys-color-on-surface);
      line-height: var(--md-sys-typescale-body-large-line-height);
    }

    .error-box {
      padding: var(--hub-space-3) var(--hub-space-4);
      background-color: var(--md-sys-color-error-container);
      color: var(--md-sys-color-on-error-container);
      border-radius: var(--md-sys-shape-corner-small);
      font-size: var(--md-sys-typescale-body-medium-font-size);
      white-space: pre-wrap;
    }

    .delete-btn {
      --md-filled-button-container-color: var(--md-sys-color-error);
      --md-filled-button-label-text-color: var(--md-sys-color-on-error);
    }

    .project-files-note {
      color: var(--md-sys-color-on-surface-variant);
      font-size: var(--md-sys-typescale-body-medium-font-size);
    }
  `];

  @property({ type: Boolean }) public open = false;
  @property({ type: Object }) public project: Project | null = null;

  @state() private errorMessage = '';
  @state() private deleting = false;

  protected updated(changedProperties: PropertyValues) {
    if (changedProperties.has('open') && this.open) {
      this.errorMessage = '';
      this.deleting = false;
    }
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

  private async handleDelete() {
    if (!this.project) return;
    this.deleting = true;
    this.errorMessage = '';

    try {
      await store.deleteProject(this.project.id);
      this.handleClose();
    } catch (e: any) {
      this.errorMessage = e?.message || 'Failed to delete project';
    } finally {
      this.deleting = false;
    }
  }

  render() {
    if (!this.project) return html``;

    return html`
      <md-dialog ?open=${this.open} @closed=${this.handleClose}>
        <div slot="headline">
          <span>Delete Project</span>
        </div>

        <div slot="content" class="dialog-content">
          ${this.errorMessage
            ? html`<div class="error-box">${this.errorMessage}</div>`
            : ''}

          <p class="warning-text">
            Are you sure you want to remove project
            <strong>"${this.project.name}"</strong> from Agent Hub?
          </p>
          <p class="warning-text project-files-note">
            Project files on disk will <strong>not</strong> be deleted.
          </p>
        </div>

        <div slot="actions">
          <md-text-button @click=${this.handleClose} ?disabled=${this.deleting}>
            Cancel
          </md-text-button>
          <md-filled-button
            class="delete-btn"
            @click=${this.handleDelete}
            ?disabled=${this.deleting}
          >
            Delete Project
          </md-filled-button>
        </div>
      </md-dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'delete-project-dialog': DeleteProjectDialog;
  }
}
