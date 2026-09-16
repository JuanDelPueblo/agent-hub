import { Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import type {
  AgentAuthMethod,
  AgentAuthState,
  AgentMutability,
  AgentSummary,
  ObservedAuthState,
  ProtocolAuthElicitation,
  ProtocolAuthFlow,
} from '../../core/api/types';

@Component({
  selector: 'hub-agent-card',
  imports: [
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './agent-card.html',
  styleUrl: './agent-card.scss',
})
export class AgentCardComponent {
  readonly agent = input.required<AgentSummary>();
  readonly auth = input<AgentAuthState | null>(null);
  readonly authLoading = input(false);
  readonly authError = input<string | null>(null);
  readonly protocolFlow = input<ProtocolAuthFlow | null>(null);
  readonly protocolElicitations = input<ProtocolAuthElicitation[]>([]);
  readonly protocolLoading = input(false);

  readonly authenticate = output<string>();
  readonly terminal = output<string>();
  readonly logout = output<void>();
  readonly clearCredentials = output<void>();
  readonly cancelProtocol = output<void>();
  readonly dismissProtocol = output<void>();
  readonly respondElicitation = output<{ id: string; action: string }>();
  readonly edit = output<void>();
  readonly remove = output<void>();
  readonly update = output<void>();
  readonly uninstall = output<void>();
  readonly retryAuth = output<void>();

  readonly mutability = computed<AgentMutability>(() => {
    const agent = this.agent();
    if (agent.mutability) return agent.mutability;
    if (agent.source === 'batey_managed') return 'editable';
    if (agent.source === 'registry') return 'registry_managed';
    return 'read_only';
  });

  readonly targeted = input(false);
  readonly available = computed(() => this.agent().availability === 'available');
  readonly observed = computed<ObservedAuthState>(() => this.auth()?.observed_state ?? 'unknown');
  readonly isAuthenticated = computed(() => this.observed() === 'authenticated');
  readonly logoutSupported = computed(() => this.auth()?.logout_supported === true);
  /** Normal Log out only when Batey observed authenticated state. */
  readonly showLogout = computed(() => this.logoutSupported() && this.isAuthenticated());
  /** Lower-emphasis credential clear when capability exists but state is not authenticated. */
  readonly showClear = computed(() => this.logoutSupported() && !this.isAuthenticated());

  observedLabel(): string {
    switch (this.observed()) {
      case 'authenticated':
        return 'Authenticated';
      case 'authentication_required':
        return 'Authentication required';
      default:
        return 'Sign-in status unknown';
    }
  }

  elicitationHost(url: string | null | undefined): string {
    if (!url) return '';
    try {
      return new URL(url).host;
    } catch {
      return '';
    }
  }

  sourceLabel(source: string): string {
    switch (source) {
      case 'batey_managed':
        return 'Custom';
      case 'registry':
        return 'Registry';
      case 'builtin':
        return 'Built-in';
      case 'file':
        return 'File';
      case 'declarative':
        return 'Declarative';
      default:
        return source;
    }
  }

  methodTypeLabel(method: AgentAuthMethod): string {
    switch (method.type) {
      case 'agent':
        return method.supported ? 'In-app' : 'In-app (unsupported)';
      case 'terminal':
        return method.supported ? 'Terminal' : 'Terminal (unsupported)';
      default:
        return `Unsupported (${method.type})`;
    }
  }
}
