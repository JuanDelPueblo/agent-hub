import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import {
  DisplayTurn,
  DisplayUserMessage,
  DisplayError,
  DisplayStateChange,
  DisplayItem,
} from '../api/types';
import { sharedStyles } from '../styles/shared';
import './tool-call';
import './plan-view';
import './permission-card';

@customElement('message-turn')
export class MessageTurn extends LitElement {
  @property({ type: Object })
  item!: DisplayItem;

  @property({ type: String })
  chatId: string = '';

  static styles = [sharedStyles, css`
    :host {
      display: block;
      margin-bottom: var(--hub-space-7);
      animation: message-enter var(--hub-duration-medium2) var(--hub-easing-emphasized-decelerate) both;
    }

    .user-container {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      margin-left: 18%;
    }

    .user-bubble {
      background-color: var(--md-sys-color-primary-container);
      color: var(--md-sys-color-on-primary-container);
      padding: var(--hub-space-4) var(--hub-space-5);
      border-radius: var(--md-sys-shape-corner-large) var(--md-sys-shape-corner-large) var(--md-sys-shape-corner-small) var(--md-sys-shape-corner-large);
      white-space: pre-wrap;
      word-break: break-word;
      font-size: var(--md-sys-typescale-body-large-font-size);
      line-height: var(--md-sys-typescale-body-large-line-height);
      max-width: 100%;
      box-shadow: var(--md-sys-elevation-level1);
    }

    .assistant-container {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-right: 3%;
      max-width: 100%;
    }

    .assistant-header {
      display: flex;
      align-items: center;
      gap: var(--hub-space-2);
      margin-bottom: var(--hub-space-3);
      font-size: var(--md-sys-typescale-body-small-font-size);
      line-height: var(--md-sys-typescale-body-small-line-height);
      color: var(--md-sys-color-on-surface-variant);
    }

    .agent-avatar {
      width: 32px;
      height: 32px;
      border-radius: var(--md-sys-shape-corner-medium) var(--md-sys-shape-corner-medium) var(--md-sys-shape-corner-medium) var(--md-sys-shape-corner-extra-small);
      background-color: var(--md-sys-color-secondary-container);
      color: var(--md-sys-color-on-secondary-container);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: var(--md-sys-typescale-label-medium-font-weight);
      font-size: var(--md-sys-typescale-label-medium-font-size);
      text-transform: uppercase;
    }

    .agent-name {
      font-weight: var(--md-sys-typescale-label-large-font-weight);
      color: var(--md-sys-color-on-surface);
      text-transform: capitalize;
    }

    .timestamp {
      font-size: var(--md-sys-typescale-body-small-font-size);
      color: var(--md-sys-color-outline);
    }

    .user-timestamp {
      margin-top: var(--hub-space-1);
      padding-right: var(--hub-space-1);
    }

    .error-icon {
      --hub-icon-size: 20px;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: var(--hub-space-1);
      padding: 3px 8px;
      border-radius: var(--md-sys-shape-corner-full);
      font-size: var(--md-sys-typescale-label-small-font-size);
      line-height: var(--md-sys-typescale-label-small-line-height);
      font-weight: var(--md-sys-typescale-label-small-font-weight);
    }

    .status-badge.in_progress {
      background-color: var(--md-sys-color-tertiary-container);
      color: var(--md-sys-color-on-tertiary-container);
    }

    .assistant-body {
      background-color: var(--md-sys-color-surface-container-low);
      border-radius: var(--md-sys-shape-corner-small) var(--md-sys-shape-corner-large) var(--md-sys-shape-corner-large) var(--md-sys-shape-corner-large);
      padding: var(--hub-space-5);
      width: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--hub-space-4);
    }

    .thought-details {
      background-color: var(--md-sys-color-surface-container);
      border-radius: var(--md-sys-shape-corner-medium);
      padding: var(--hub-space-3) var(--hub-space-4);
      font-size: var(--md-sys-typescale-body-medium-font-size);
      color: var(--md-sys-color-on-surface-variant);
      border: 1px dashed var(--md-sys-color-outline-variant);
    }

    .thought-summary {
      cursor: pointer;
      font-weight: var(--md-sys-typescale-label-large-font-weight);
      display: flex;
      align-items: center;
      gap: 6px;
      user-select: none;
    }

    .thought-content {
      margin-top: var(--hub-space-2);
      white-space: pre-wrap;
      word-break: break-word;
      font-family: inherit;
      line-height: 1.5;
      font-style: italic;
      color: var(--md-sys-color-on-surface-variant);
      border-top: 1px solid color-mix(in srgb, var(--md-sys-color-outline-variant) 45%, transparent);
      padding-top: var(--hub-space-2);
    }

    .text-content {
      white-space: pre-wrap;
      word-break: break-word;
      font-size: var(--md-sys-typescale-body-large-font-size);
      line-height: 1.65;
      color: var(--md-sys-color-on-surface);
    }

    .error-container {
      background-color: var(--md-sys-color-error-container);
      color: var(--md-sys-color-on-error-container);
      padding: var(--hub-space-4) var(--hub-space-5);
      border-radius: var(--md-sys-shape-corner-medium);
      font-size: var(--md-sys-typescale-body-medium-font-size);
      display: flex;
      align-items: center;
      gap: var(--hub-space-3);
    }

    .state-change {
      display: flex;
      justify-content: center;
      margin: var(--hub-space-3) 0;
    }

    .state-pill {
      font-size: var(--md-sys-typescale-label-small-font-size);
      padding: 5px 10px;
      background-color: var(--md-sys-color-surface-variant);
      color: var(--md-sys-color-on-surface-variant);
      border-radius: var(--md-sys-shape-corner-full);
    }

    .icon {
      --hub-icon-size: 18px;
      display: inline-block;
    }

    .spinner {
      animation: spin 1.2s linear infinite;
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes message-enter {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 599px) {
      .user-container {
        margin-left: 8%;
      }

      .assistant-container {
        margin-right: 0;
      }

      .assistant-body {
        padding: var(--hub-space-4);
      }
    }
  `];

  private formatTime(ts: string) {
    if (!ts) return '';
    try {
      const date = new Date(ts);
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  }

  private renderUserMessage(item: DisplayUserMessage) {
    return html`
      <div class="user-container">
        <div class="user-bubble">${item.text}</div>
        <div class="timestamp user-timestamp">
          ${this.formatTime(item.timestamp)}
        </div>
      </div>
    `;
  }

  private renderTurn(item: DisplayTurn) {
    const isRunning = item.status === 'in_progress';
    const initial = item.agent ? item.agent[0].toUpperCase() : 'A';

    return html`
      <div class="assistant-container">
        <div class="assistant-header">
          <div class="agent-avatar">${initial}</div>
          <span class="agent-name">${item.agent}</span>
          <span class="timestamp">${this.formatTime(item.timestamp)}</span>
          ${isRunning
            ? html`
                <span class="status-badge in_progress">
                  <span class="icon spinner">progress_activity</span>
                  <span>Thinking...</span>
                </span>
              `
            : null}
        </div>

        <div class="assistant-body">
          ${item.entries.map((entry) => {
            switch (entry.type) {
              case 'thought_chunk':
                return html`
                  <details class="thought-details">
                    <summary class="thought-summary">
                      <span class="icon">psychology</span>
                      <span>Thought Process</span>
                    </summary>
                    <div class="thought-content">${entry.text}</div>
                  </details>
                `;
              case 'tool_call':
                return html`<tool-call .tool=${entry}></tool-call>`;
              case 'plan':
                return html`<plan-view .entries=${entry.entries}></plan-view>`;
              case 'permission_request':
                return html`
                  <permission-card
                    .permission=${entry}
                    .chatId=${this.chatId}
                  ></permission-card>
                `;
              case 'message_chunk':
                return html`<div class="text-content">${entry.text}</div>`;
              default:
                return html``;
            }
          })}
        </div>
      </div>
    `;
  }

  private renderError(item: DisplayError) {
    return html`
      <div class="error-container">
        <span class="icon error-icon">error</span>
        <span>${item.message}</span>
      </div>
    `;
  }

  private renderStateChange(item: DisplayStateChange) {
    return html`
      <div class="state-change">
        <span class="state-pill">
          Process: ${item.process} · Turn: ${item.turn}
        </span>
      </div>
    `;
  }

  render() {
    if (!this.item) return html``;

    switch (this.item.type) {
      case 'user_message':
        return this.renderUserMessage(this.item);
      case 'turn':
        return this.renderTurn(this.item);
      case 'error':
        return this.renderError(this.item);
      case 'state_change':
        return this.renderStateChange(this.item);
      default:
        return html``;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'message-turn': MessageTurn;
  }
}
