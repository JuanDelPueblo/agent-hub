import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { ChatComposerComponent } from './chat-composer';
import { AppStateService } from '../../state/app-state.service';
import type { ConfigOption, RichContentBlock } from '../../core/api/types';

describe('ChatComposerComponent', () => {
  let fixture: ComponentFixture<ChatComposerComponent>;
  let component: ChatComposerComponent;
  let resumed: string[] = [];
  const sendPrompt = async (_id: string, text: string | RichContentBlock[]) => sent.push(text);
  const connectChat = async (id: string) => { resumed.push(id); };
  const sent: Array<string | RichContentBlock[]> = [];

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
    fixture.componentRef.setInput('turnState', 'IDLE');
    fixture.componentRef.setInput('disabled', false);
    fixture.detectChanges();
  });

  it('sends on plain Enter and clears the message', async () => {
    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    textarea.value = '  hello agent  ';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    textarea.dispatchEvent(event);
    await fixture.whenStable();
    expect(event.defaultPrevented).toBe(true);
    expect(sent).toEqual(['hello agent']);
    expect(component.message.value).toBe('');
  });

  it('does not send on Shift+Enter', async () => {
    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    textarea.value = 'line1';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    const event = new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true, bubbles: true, cancelable: true });
    textarea.dispatchEvent(event);
    await fixture.whenStable();
    expect(event.defaultPrevented).toBe(false);
    expect(sent).toEqual([]);
    expect(component.message.value).toBe('line1');
  });

  it('inserts a newline at the cursor on Ctrl+J without sending', async () => {
    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    textarea.value = 'hello world';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.setSelectionRange(5, 5);
    const event = new KeyboardEvent('keydown', { key: 'j', ctrlKey: true, bubbles: true, cancelable: true });
    textarea.dispatchEvent(event);
    await fixture.whenStable();
    expect(event.defaultPrevented).toBe(true);
    expect(sent).toEqual([]);
    expect(component.message.value).toBe('hello\n world');
    expect(textarea.selectionStart).toBe(6);
    expect(textarea.selectionEnd).toBe(6);
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

  it('a stopped chat can send normally without an explicit connection action', async () => {
    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea.disabled).toBe(false);
    expect(fixture.nativeElement.querySelector('.resume-button')).toBeNull();

    textarea.value = 'hello from stopped chat';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    await component.send();
    await fixture.whenStable();

    expect(sent).toEqual(['hello from stopped chat']);
    expect(resumed).toHaveLength(0);
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

  it('restores message text when sending prompt fails', async () => {
    const state = TestBed.inject(AppStateService);
    vi.spyOn(state, 'sendPrompt').mockRejectedValueOnce(new Error('Agent busy'));
    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    textarea.value = 'failed prompt text';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    expect(component.message.value).toBe('failed prompt text');

    await component.send();
    fixture.detectChanges();

    expect(component.message.value).toBe('failed prompt text');
    expect(textarea.value).toBe('failed prompt text');
  });

  it('accepts verified audio attachments and reports rejected types before send', async () => {
    const input = document.createElement('input');
    vi.spyOn(input, 'click');
    component.chooseAttachment('audio', input);
    const audio = new File([new Uint8Array([73, 68, 51])], 'note.mp3', { type: 'audio/mpeg' });
    Object.defineProperty(input, 'files', { value: [audio] });
    await component.addAttachment({ target: input } as unknown as Event);
    expect(component.attachmentError()).toBeNull();
    expect(component.attachments()).toEqual([
      expect.objectContaining({ type: 'audio', mimeType: 'audio/mpeg' }),
    ]);

    const rejectedInput = document.createElement('input');
    vi.spyOn(rejectedInput, 'click');
    component.chooseAttachment('image', rejectedInput);
    const executable = new File(['not an image'], 'bad.exe', { type: 'application/octet-stream' });
    Object.defineProperty(rejectedInput, 'files', { value: [executable] });
    await component.addAttachment({ target: rejectedInput } as unknown as Event);
    expect(component.attachmentError()).toBe('This file type is not supported');
    expect(component.attachments()).toHaveLength(1);
  });
});
