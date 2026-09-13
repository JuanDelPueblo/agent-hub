import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '@material/web/icon/icon.js';
import { TurnEntryTool } from '../api/types';
import { sharedStyles } from '../styles/shared';

@customElement('tool-call-view')
export class ToolCallView extends LitElement {
  static styles = [sharedStyles, css`
    :host {
      display: block;
      margin: var(--hub-space-2) 0;
    }

    .tool-card {
      border: 1px solid color-mix(in srgb, var(--md-sys-color-outline-variant) 55%, transparent);
      border-radius: var(--md-sys-shape-corner-medium);
      background-color: var(--md-sys-color-surface-container-low);
      overflow: hidden;
      font-size: var(--md-sys-typescale-body-medium-font-size);
    }

    .tool-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      border: 0;
      text-align: left;
      padding: var(--hub-space-3) var(--hub-space-4);
      cursor: pointer;
      user-select: none;
      background-color: var(--md-sys-color-surface-container);
      color: var(--md-sys-color-on-surface);
      font: inherit;
      transition: background-color var(--hub-duration-short3) var(--hub-easing-standard);
    }

    .tool-header:hover {
      background-color: var(--md-sys-color-surface-container-high);
    }

    .tool-title {
      display: flex;
      align-items: center;
      gap: var(--hub-space-2);
      font-weight: var(--md-sys-typescale-label-large-font-weight);
      color: var(--md-sys-color-on-surface);
    }

    .tool-title md-icon {
      --hub-icon-size: 20px;
      color: var(--md-sys-color-primary);
    }

    .tool-meta {
      display: flex;
      align-items: center;
      gap: var(--hub-space-2);
    }

    .tool-header:disabled {
      cursor: default;
      opacity: 1;
    }

    .status-badge {
      font-size: var(--md-sys-typescale-label-small-font-size);
      line-height: var(--md-sys-typescale-label-small-line-height);
      padding: 3px 8px;
      border-radius: var(--md-sys-shape-corner-full);
      font-weight: var(--md-sys-typescale-label-small-font-weight);
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
      padding: var(--hub-space-4);
      font-family: var(--md-sys-typescale-code-font);
      font-size: var(--md-sys-typescale-code-font-size);
      line-height: var(--md-sys-typescale-code-line-height);
      white-space: pre-wrap;
      word-break: break-all;
      background-color: var(--md-sys-color-surface-container-lowest);
      border-top: 1px solid color-mix(in srgb, var(--md-sys-color-outline-variant) 50%, transparent);
      max-height: 250px;
      overflow-y: auto;
      color: var(--md-sys-color-on-surface);
    }

    .chevron {
      transition: transform var(--hub-duration-short4) var(--hub-easing-standard);
      --hub-icon-size: 20px;
      color: var(--md-sys-color-outline);
    }

    .chevron.expanded {
      transform: rotate(180deg);
    }
  `];

  @property({ type: Object }) tool!: TurnEntryTool;
  @state() private expanded = false;

  render() {
    if (!this.tool) return html``;

    const hasOutput = Boolean(this.tool.output);
    const statusClass = `status-${(this.tool.status || 'in_progress').toLowerCase()}`;

    return html`
      <div class="tool-card">
        <button
          class="tool-header"
          type="button"
          ?disabled=${!hasOutput}
          aria-expanded=${hasOutput ? this.expanded : 'false'}
          @click=${() => (hasOutput ? (this.expanded = !this.expanded) : null)}
        >
          <div class="tool-title">
            <md-icon class="material-symbols-outlined">build</md-icon>
            <span>${this.tool.title}</span>
          </div>

          <div class="tool-meta">
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
        </button>

        ${hasOutput && this.expanded
          ? html`<div class="tool-output">${this.tool.output}</div>`
          : ''}
      </div>
    `;
  }
}
