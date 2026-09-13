import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { ChatComposerComponent } from './chat-composer';
import { AppStateService } from '../../state/app-state.service';
import type { ConfigOption } from '../../core/api/types';

describe('ChatComposerComponent', () => {
  let fixture: ComponentFixture<ChatComposerComponent>;
  let component: ChatComposerComponent;
  let resumed: string[] = [];
  const sendPrompt = async (_id: string, text: string) => sent.push(text);
  const connectChat = async (id: string) => { resumed.push(id); };
  const sent: string[] = [];

  beforeEach(async () => {
    sent.length = 0;
    resumed = [];
    await TestBed.configureTestingModule({
      imports: [ChatComposerComponent],
      providers: [
        {
          provide: AppStateService,
          useValue: { sendPrompt, connectChat, cancelActiveTurn: async () => undefined },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ChatComposerComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('chatId', 'chat-1');
    fixture.componentRef.setInput('processState', 'RUNNING');
    fixture.componentRef.setInput('turnState', 'IDLE');
    fixture.componentRef.setInput('disabled', false);
    fixture.detectChanges();
  });

  it('sends through Ctrl+Enter and clears the Material form control', async () => {
    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea.disabled).toBe(false);
    textarea.value = '  hello agent  ';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true, bubbles: true }));
    await fixture.whenStable();
    expect(sent).toEqual(['hello agent']);
    expect(component.message.value).toBe('');
  });

  it('allows typing and displays resume button when agent is stopped', async () => {
    fixture.componentRef.setInput('processState', 'STOPPED');
    fixture.detectChanges();
    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea.disabled).toBe(false);
    expect(textarea.placeholder).toContain('resume');

    const resumeBtn = fixture.nativeElement.querySelector('.resume-button') as HTMLButtonElement;
    expect(resumeBtn).not.toBeNull();
    resumeBtn.click();
    await fixture.whenStable();
    expect(resumed).toEqual(['chat-1']);
  });

  it('disables the textarea while the agent is not ready', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect((fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement).disabled).toBe(true);
  });


  it('places model and reasoning selectors in the composer footer', () => {
    const options: ConfigOption[] = [
      {
        id: 'model',
        name: 'Model',
        type: 'select',
        currentValue: 'gpt-5',
        options: [{ value: 'gpt-5', name: 'GPT-5' }],
      },
      {
        id: 'reasoning_effort',
        name: 'Reasoning effort',
        type: 'select',
        currentValue: 'medium',
        options: [{ value: 'medium', name: 'Medium' }],
      },
    ];
    fixture.componentRef.setInput('options', options);
    fixture.detectChanges();

    const selectors = fixture.nativeElement.querySelectorAll('.selector');
    expect(selectors).toHaveLength(2);
    expect(selectors[0].textContent).toContain('GPT-5');
    expect(selectors[1].textContent).toContain('Reasoning effort: Medium');
  });
});
