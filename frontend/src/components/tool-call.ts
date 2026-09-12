import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '@material/web/icon/icon.js';
import { TurnEntryTool } from '../api/types';

@customElement('tool-call-view')
export class ToolCallView extends LitElement {
  static styles = css`
    :host {
      display: block;
      margin: 4px 0;
    }

    .tool-card {
      border: 1px solid var(--md-sys-color-outline-variant);
      border-radius: var(--md-sys-shape-corner-small);
      background-color: var(--md-sys-color-surface-container-low);
      overflow: hidden;
      font-size: 0.85rem;
    }

    .tool-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      cursor: pointer;
      user-select: none;
      background-color: var(--md-sys-color-surface-container);
    }

    .tool-header:hover {
      background-color: var(--md-sys-color-surface-container-high);
    }

    .tool-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      color: var(--md-sys-color-on-surface);
    }

    .tool-title md-icon {
      font-size: 18px;
      color: var(--md-sys-color-primary);
    }

    .status-badge {
      font-size: 0.7rem;
      padding: 2px 8px;
      border-radius: 999px;
      text-transform: uppercase;
      font-weight: 600;
    }

    .status-in_progress {
      background-color: var(--status-starting-container);
      color: var(--status-starting);
    }

    .status-success, .status-completed {
      background-color: var(--status-running-container);
      color: var(--status-running);
    }

    .status-error, .status-failed {
      background-color: var(--status-dead-container);
      color: var(--status-dead);
    }

    .tool-output {
      padding: 10px 12px;
      font-family: var(--md-sys-typescale-code-font);
      font-size: 0.8rem;
      white-space: pre-wrap;
      word-break: break-all;
      background-color: var(--md-sys-color-surface-container-lowest);
      border-top: 1px solid var(--md-sys-color-outline-variant);
      max-height: 250px;
      overflow-y: auto;
      color: var(--md-sys-color-on-surface);
    }

    .chevron {
      transition: transform 0.2s ease;
      font-size: 18px;
      color: var(--md-sys-color-outline);
    }

    .chevron.expanded {
      transform: rotate(180deg);
    }
  `;

  @property({ type: Object }) tool!: TurnEntryTool;
  @state() private expanded = false;

  render() {
    if (!this.tool) return html``;

    const hasOutput = Boolean(this.tool.output);
    const statusClass = `status-${(this.tool.status || 'in_progress').toLowerCase()}`;

    return html`
      <div class="tool-card">
        <div
          class="tool-header"
          @click=${() => (hasOutput ? (this.expanded = !this.expanded) : null)}
        >
          <div class="tool-title">
            <md-icon class="material-symbols-outlined">build</md-icon>
            <span>${this.tool.title}</span>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="status-badge ${statusClass}">
              ${this.tool.status}
            </span>
            ${hasOutput
              ? html`
                  <md-icon class="material-symbols-outlined chevron ${this.expanded ? 'expanded' : ''}">
                    expand_more
                  </md-icon>
                `
              : ''}
          </div>
        </div>

        ${hasOutput && this.expanded
          ? html`<div class="tool-output">${this.tool.output}</div>`
          : ''}
      </div>
    `;
  }
}
