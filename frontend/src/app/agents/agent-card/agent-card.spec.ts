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
    expect(text).toContain('Defined outside Pueblo Hub');
    const actionLabels = (Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[])
      .map((button) => button.textContent?.trim() ?? '')
      .join(' ');
    expect(actionLabels).not.toContain('Edit');
    expect(actionLabels).not.toContain('Remove');
    expect(actionLabels).not.toContain('Uninstall');
  });

  it('offers edit and remove for an editable custom agent', () => {
    const edit = vi.fn();
    const remove = vi.fn();
    fixture.componentInstance.edit.subscribe(edit);
    fixture.componentInstance.remove.subscribe(remove);
    render(summary('pueblo_managed'));
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
    expect(text).not.toContain('Edit');
  });

  it('shows an unavailable reason', () => {
    render(summary('builtin', { availability: 'unavailable', unavailable_reason: 'Command missing.' }));
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Unavailable');
    expect(text).toContain('Command missing.');
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

  it('shows logout when logout is supported', () => {
    const logout = vi.fn();
    fixture.componentInstance.logout.subscribe(logout);
    render(summary('builtin'), {
      agent_id: 'x',
      logout_supported: true,
      terminal_supported: true,
      methods: [],
    });
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Active session');
    const button = Array.from(fixture.nativeElement.querySelectorAll('button'))
      .find((item) => (item as HTMLButtonElement).textContent?.includes('Log out')) as HTMLButtonElement;
    expect(button).toBeDefined();
    button.click();
    expect(logout).toHaveBeenCalled();
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
