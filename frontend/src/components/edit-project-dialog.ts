import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '@material/web/dialog/dialog.js';
import '@material/web/button/filled-button.js';
import '@material/web/button/text-button.js';
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/icon/icon.js';
import './folder-picker';
import { Project } from '../api/types';
import { store } from '../state/app-state';

@customElement('edit-project-dialog')
export class EditProjectDialog extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .dialog-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 320px;
      max-width: 540px;
    }

    @media (min-width: 600px) {
      .dialog-content {
        min-width: 480px;
      }
    }

    .field-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .field-label {
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--md-sys-color-on-surface-variant);
    }

    .selected-path-card {
      padding: 10px 14px;
      background-color: var(--md-sys-color-surface-container);
      border-radius: var(--md-sys-shape-corner-small);
      font-family: var(--md-sys-typescale-code-font);
      font-size: 0.8rem;
      word-break: break-all;
    }

    .error-box {
      padding: 10px 14px;
      background-color: var(--md-sys-color-error-container);
      color: var(--md-sys-color-on-error-container);
      border-radius: var(--md-sys-shape-corner-small);
      font-size: 0.85rem;
      white-space: pre-wrap;
    }
  `;

  @property({ type: Boolean }) public open = false;
  @property({ type: Object }) public project: Project | null = null;

  @state() private projectName = '';
  @state() private selectedPath = '';
  @state() private errorMessage = '';
  @state() private saving = false;

  protected updated(changedProperties: PropertyValues) {
    if (changedProperties.has('open') && this.open) {
      this.projectName = this.project?.name || '';
      this.selectedPath = this.project?.path || '';
      this.errorMessage = '';
      this.saving = false;
    }
    if (changedProperties.has('project') && this.project) {
      if (!this.projectName) this.projectName = this.project.name;
      if (!this.selectedPath) this.selectedPath = this.project.path;
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

  private handleFolderBrowsed(e: CustomEvent) {
    this.selectedPath = e.detail.path;
  }

  private handleFolderSelected(e: CustomEvent) {
    this.selectedPath = e.detail.path;
  }

  private async handleSave() {
    if (!this.project) return;
    const name = this.projectName.trim();
    const path = this.selectedPath.trim();

    if (!name || !path) {
      this.errorMessage = 'Please provide both project name and directory path.';
      return;
    }

    this.saving = true;
    this.errorMessage = '';

    try {
      await store.editProject(this.project.id, name, path);
      this.handleClose();
    } catch (e: any) {
      this.errorMessage = e?.message || 'Failed to update project';
    } finally {
      this.saving = false;
    }
  }

  render() {
    return html`
      <md-dialog ?open=${this.open} @closed=${this.handleClose}>
        <div slot="headline">
          <span>Edit Project</span>
        </div>

        <div slot="content" class="dialog-content">
          ${this.errorMessage
            ? html`<div class="error-box">${this.errorMessage}</div>`
            : ''}

          <div class="field-group">
            <md-outlined-text-field
              label="Project Display Name"
              .value=${this.projectName}
              @input=${(e: any) => (this.projectName = e.target.value)}
            ></md-outlined-text-field>
          </div>

          <div class="field-group">
            <span class="field-label">Project Directory</span>
            <folder-picker
              .initialPath=${this.selectedPath}
              @folder-browsed=${this.handleFolderBrowsed}
              @folder-selected=${this.handleFolderSelected}
            ></folder-picker>
          </div>

          ${this.selectedPath
            ? html`
                <div class="field-group">
                  <span class="field-label">Selected Directory</span>
                  <div class="selected-path-card">${this.selectedPath}</div>
                </div>
              `
            : ''}
        </div>

        <div slot="actions">
          <md-text-button @click=${this.handleClose} ?disabled=${this.saving}>
            Cancel
          </md-text-button>
          <md-filled-button
            @click=${this.handleSave}
            ?disabled=${!this.projectName || !this.selectedPath || this.saving}
          >
            Save Changes
          </md-filled-button>
        </div>
      </md-dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'edit-project-dialog': EditProjectDialog;
  }
}
