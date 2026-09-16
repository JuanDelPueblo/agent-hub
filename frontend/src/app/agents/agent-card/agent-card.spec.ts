import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AgentAuthState, AgentSummary } from '../../core/api/types';
import { AgentCardComponent } from './agent-card';

function summary(source: AgentSummary['source'], overrides: Partial<AgentSummary> = {}): AgentSummary {
  return {
    id: `${source}-agent`,
    display_name: `${source} agent`,
    source,
    availability: 'available',
    metadata: {},
    ...overrides,
  } as AgentSummary;
}

describe('AgentCardComponent', () => {
  let fixture: ComponentFixture<AgentCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AgentCardComponent] }).compileComponents();
    fixture = TestBed.createComponent(AgentCardComponent);
  });

  function render(agent: AgentSummary, auth: AgentAuthState | null = null): void {
    fixture.componentRef.setInput('agent', agent);
    fixture.componentRef.setInput('auth', auth);
    fixture.detectChanges();
  }

  it('presents built-in sources as read-only without mutation controls', () => {
    render(summary('builtin', { display: { description: 'A builtin.' } }));
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Built-in');
    expect(text).toContain('Read-only');
    expect(text).toContain('A builtin.');
    expect(text).toContain('Defined outside Batey');
    const actionLabels = (Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[])
      .map((button) => button.textContent?.trim() ?? '')
      .join(' ');
    expect(actionLabels).not.toContain('Edit');
    expect(actionLabels).not.toContain('Remove');
    expect(actionLabels).not.toContain('Uninstall');
    expect(actionLabels).not.toContain('Environment');
  });

  it('offers edit and remove for an editable custom agent', () => {
    const edit = vi.fn();
    const remove = vi.fn();
    fixture.componentInstance.edit.subscribe(edit);
    fixture.componentInstance.remove.subscribe(remove);
    render(summary('batey_managed'));
    const buttons = Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];
    const actionLabels = buttons.map((button) => button.textContent?.trim() ?? '').join(' ');
    expect(actionLabels).toContain('Edit');
    expect(actionLabels).toContain('Remove');
    buttons.find((button) => button.textContent?.includes('Edit'))?.click();
    buttons.find((button) => button.textContent?.includes('Remove'))?.click();
    expect(edit).toHaveBeenCalled();
    expect(remove).toHaveBeenCalled();
  });

  it('offers update and uninstall for a registry-managed agent', () => {
    render(summary('registry'));
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Registry-managed');
    expect(text).toContain('Update');
    expect(text).toContain('Uninstall');
    expect(text).toContain('Environment');
    expect(text).not.toContain('Edit');
  });

  it('offers environment settings for editable and registry-managed agents', () => {
    const environment = vi.fn();
    fixture.componentInstance.environment.subscribe(environment);
    render(summary('batey_managed'));
    let buttons = Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];
    expect(buttons.map((button) => button.textContent?.trim() ?? '').join(' ')).toContain('Environment');
    buttons.find((button) => button.textContent?.includes('Environment'))?.click();
    expect(environment).toHaveBeenCalled();
  });

  it('shows an unavailable reason', () => {
    render(summary('builtin', { availability: 'unavailable', unavailable_reason: 'Command missing.' }));
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Unavailable');
    expect(text).toContain('Command missing.');
  });

  it('keeps the availability badge as the single status cue in the header', () => {
    render(summary('builtin', { display: { description: 'A builtin.' } }));
    const head = fixture.nativeElement.querySelector('.card-head') as HTMLElement;
    expect(head.textContent).toContain('Available');
    expect(head.textContent).not.toContain('Read-only');
    expect(head.textContent).not.toContain('Built-in');
    const tags = fixture.nativeElement.querySelector('.tags') as HTMLElement;
    expect(tags.textContent).toContain('Built-in');
    expect(tags.textContent).toContain('Read-only');
  });

  it('represents agent, terminal, and unsupported methods honestly', () => {
    const auth: AgentAuthState = {
      agent_id: 'x',
      logout_supported: true,
      terminal_supported: true,
      methods: [
        { id: 'oauth', name: 'OAuth', type: 'agent', supported: true },
        { id: 'key', name: 'API key', type: 'terminal', supported: true },
        { id: 'device', name: 'Device flow', type: 'device_code', supported: false },
        { id: 'term-unsupported', name: 'No PTY', type: 'terminal', supported: false },
      ],
    };
    render(summary('builtin'), auth);
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Sign in');
    expect(text).toContain('Open terminal');
    expect(text).toContain('Unsupported (device_code)');
    expect(text).toContain('Terminal (unsupported)');

    const disabledButtons = (Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[])
      .filter((button) => button.textContent?.includes('Unsupported'));
    expect(disabledButtons.length).toBe(2);
    expect(disabledButtons[0]?.disabled).toBe(true);
    expect(disabledButtons[1]?.disabled).toBe(true);
  });

  it('shows logout action when logout capability is supported without claiming an active session', () => {
    const logout = vi.fn();
    fixture.componentInstance.logout.subscribe(logout);
    render(summary('builtin'), {
      agent_id: 'x',
      logout_supported: true,
      terminal_supported: true,
      methods: [],
    });
    const text = fixture.nativeElement.textContent as string;
    expect(text).not.toContain('Active session');
    expect(text).toContain('Clear the saved sign-in for this agent');
    const button = Array.from(fixture.nativeElement.querySelectorAll('button'))
      .find((item) => (item as HTMLButtonElement).textContent?.includes('Log out')) as HTMLButtonElement;
    expect(button).toBeDefined();
    button.click();
    expect(logout).toHaveBeenCalled();
  });

  it('shows simple wording when an agent offers no sign-in options', () => {
    render(summary('builtin'), {
      agent_id: 'x',
      logout_supported: false,
      terminal_supported: false,
      methods: [],
    });
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('No sign-in options available.');
    expect(text).not.toContain('reports no authentication methods');
  });

  it('offers a check action when sign-in state is not loaded', () => {
    const retryAuth = vi.fn();
    fixture.componentInstance.retryAuth.subscribe(retryAuth);
    render(summary('builtin'), null);
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Sign-in status is not loaded.');
    const button = Array.from(fixture.nativeElement.querySelectorAll('button'))
      .find((item) => (item as HTMLButtonElement).textContent?.includes('Check')) as HTMLButtonElement;
    expect(button).toBeDefined();
    button.click();
    expect(retryAuth).toHaveBeenCalled();
  });

  it('places each method label on the left and its action on the right', () => {
    render(summary('builtin'), {
      agent_id: 'x',
      logout_supported: false,
      terminal_supported: true,
      methods: [{ id: 'oauth', name: 'OAuth', type: 'agent', supported: true }],
    });
    const rows = fixture.nativeElement.querySelectorAll('.method') as NodeListOf<HTMLElement>;
    expect(rows.length).toBe(1);
    const text = rows[0].querySelector('.method-text');
    const action = rows[0].querySelector('.method-action');
    expect(text).not.toBeNull();
    expect(action).not.toBeNull();
    expect(rows[0].querySelectorAll('button').length).toBe(1);
  });

  it('shows version and usage provider metadata', () => {
    render(summary('builtin', { usage_provider: 'openai', display: { version: '1.2.3' } }));
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Version');
    expect(text).toContain('1.2.3');
    expect(text).toContain('Usage provider');
    expect(text).toContain('openai');
  });

  it('hides logout when logout is not supported', () => {
    render(summary('builtin'), {
      agent_id: 'x',
      logout_supported: false,
      terminal_supported: true,
      methods: [],
    });
    const button = Array.from(fixture.nativeElement.querySelectorAll('button'))
      .find((item) => (item as HTMLButtonElement).textContent?.includes('Log out'));
    expect(button).toBeUndefined();
  });

  it('renders repository, website, and license links', () => {
    render(summary('builtin', {
      display: {
        repository: 'https://example.invalid/repo',
        website: 'https://example.invalid',
        license: 'MIT',
        license_url: 'https://example.invalid/license',
      },
    }));
    const links = (fixture.nativeElement.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>);
    const hrefs = Array.from(links).map((link) => link.getAttribute('href'));
    expect(hrefs).toContain('https://example.invalid/repo');
    expect(hrefs).toContain('https://example.invalid');
    expect(hrefs).toContain('https://example.invalid/license');
  });
});
