import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import {
  DisplayTurn,
  DisplayUserMessage,
  DisplayError,
  DisplayStateChange,
  DisplayItem,
} from '../api/types';
import './tool-call';
import './plan-view';
import './permission-card';

@customElement('message-turn')
export class MessageTurn extends LitElement {
  @property({ type: Object })
  item!: DisplayItem;

  @property({ type: String })
  chatId: string = '';

  static styles = css`
    :host {
      display: block;
      margin-bottom: 20px;
    }

    .user-container {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      margin-left: 20%;
    }

    .user-bubble {
      background-color: var(--md-sys-color-primary-container);
      color: var(--md-sys-color-on-primary-container);
      padding: 12px 16px;
      border-radius: 16px 16px 4px 16px;
      white-space: pre-wrap;
      word-break: break-word;
      font-size: 0.9375rem;
      line-height: 1.5;
      max-width: 100%;
      box-shadow: var(--md-sys-elevation-level1);
    }

    .assistant-container {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-right: 5%;
      max-width: 100%;
    }

    .assistant-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      font-size: 0.8125rem;
      color: var(--md-sys-color-on-surface-variant);
    }

    .agent-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background-color: var(--md-sys-color-secondary-container);
      color: var(--md-sys-color-on-secondary-container);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.75rem;
      text-transform: uppercase;
    }

    .agent-name {
      font-weight: 600;
      color: var(--md-sys-color-on-surface);
      text-transform: capitalize;
    }

    .timestamp {
      font-size: 0.75rem;
      color: var(--md-sys-color-outline);
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.6875rem;
      font-weight: 500;
    }

    .status-badge.in_progress {
      background-color: var(--md-sys-color-tertiary-container);
      color: var(--md-sys-color-on-tertiary-container);
    }

    .assistant-body {
      background-color: var(--md-sys-color-surface-container-low);
      border: 1px solid var(--md-sys-color-outline-variant);
      border-radius: 4px 16px 16px 16px;
      padding: 16px;
      width: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .thought-details {
      background-color: var(--md-sys-color-surface-container);
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 0.875rem;
      color: var(--md-sys-color-on-surface-variant);
      border: 1px dashed var(--md-sys-color-outline-variant);
    }

    .thought-summary {
      cursor: pointer;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 6px;
      user-select: none;
    }

    .thought-content {
      margin-top: 8px;
      white-space: pre-wrap;
      word-break: break-word;
      font-family: inherit;
      line-height: 1.5;
      font-style: italic;
      color: var(--md-sys-color-on-surface-variant);
      border-top: 1px solid var(--md-sys-color-outline-variant);
      padding-top: 8px;
    }

    .text-content {
      white-space: pre-wrap;
      word-break: break-word;
      font-size: 0.9375rem;
      line-height: 1.6;
      color: var(--md-sys-color-on-surface);
    }

    .error-container {
      background-color: var(--md-sys-color-error-container);
      color: var(--md-sys-color-on-error-container);
      padding: 12px 16px;
      border-radius: 12px;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .state-change {
      display: flex;
      justify-content: center;
      margin: 8px 0;
    }

    .state-pill {
      font-size: 0.75rem;
      padding: 4px 10px;
      background-color: var(--md-sys-color-surface-variant);
      color: var(--md-sys-color-on-surface-variant);
      border-radius: 12px;
    }

    .icon {
      font-family: 'Material Symbols Outlined';
      font-size: 16px;
      font-style: normal;
      font-weight: normal;
      line-height: 1;
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
  `;

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
        <div class="timestamp" style="margin-top: 4px; padding-right: 4px;">
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
        <span class="icon" style="font-size: 20px;">error</span>
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
