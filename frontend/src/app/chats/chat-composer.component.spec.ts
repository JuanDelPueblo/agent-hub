import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { ChatComposerComponent } from './chat-composer.component';
import { AppStateService } from '../state/app-state.service';

describe('ChatComposerComponent', () => {
  let fixture: ComponentFixture<ChatComposerComponent>;
  let component: ChatComposerComponent;
  const sendPrompt = async (_id: string, text: string) => sent.push(text);
  const sent: string[] = [];

  beforeEach(async () => {
    sent.length = 0;
    await TestBed.configureTestingModule({ imports: [ChatComposerComponent], providers: [{ provide: AppStateService, useValue: { sendPrompt, cancelActiveTurn: async () => undefined } }] }).compileComponents();
    fixture = TestBed.createComponent(ChatComposerComponent);
    component = fixture.componentInstance;
    component.chatId = 'chat-1'; component.processState = 'RUNNING'; component.turnState = 'IDLE'; component.disabled = false;
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

  it('disables the textarea while the agent is not ready', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect((fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement).disabled).toBe(true);
  });
});
