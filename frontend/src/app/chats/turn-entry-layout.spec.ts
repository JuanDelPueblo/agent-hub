import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { AppStateService } from '../state/app-state.service';
import { PermissionCardComponent } from '../permissions/permission-card/permission-card';
import { PlanViewComponent } from './plan-view/plan-view';
import { ToolCallComponent } from './tool-call/tool-call';

describe('turn entry layout', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissionCardComponent, PlanViewComponent, ToolCallComponent],
      providers: [
        {
          provide: AppStateService,
          useValue: { respondPermission: vi.fn(async () => undefined) },
        },
      ],
    }).compileComponents();
  });

  it('uses compact headers without Material avatar spacing', () => {
    const plan = TestBed.createComponent(PlanViewComponent);
    plan.componentInstance.entries = [{ content: 'Read the router', status: 'completed' }];
    plan.detectChanges();

    const planElement = plan.nativeElement as HTMLElement;
    expect(planElement.querySelector('mat-card-header')).toBeNull();
    expect(planElement.querySelector('.plan-header > mat-icon')?.textContent?.trim()).toBe('format_list_bulleted');
    expect(planElement.querySelector('.plan-title')?.textContent?.trim()).toBe('Execution plan');

    const permission = TestBed.createComponent(PermissionCardComponent);
    permission.componentInstance.permission = {
      id: 1,
      type: 'permission_request',
      requestId: 'req-1',
      method: 'fs/write_text_file',
      description: 'Write backend/src/web/hub.rs',
      responded: true,
      decision: 'Allowed',
    };
    permission.detectChanges();

    const permissionElement = permission.nativeElement as HTMLElement;
    expect(permissionElement.querySelector('mat-card-header')).toBeNull();
    expect(permissionElement.querySelector('.permission-header > mat-icon')?.textContent?.trim()).toBe('shield_person');
    expect(permissionElement.querySelector('.permission-title')?.textContent?.trim()).toBe('Permission request');
    expect(permissionElement.querySelector('.decision')?.textContent).toContain('Responded: Allowed');
  });

  it('leaves vertical rhythm to the turn body instead of stacking child margins', () => {
    const plan = TestBed.createComponent(PlanViewComponent);
    plan.componentInstance.entries = [{ content: 'Read the router', status: 'pending' }];
    plan.detectChanges();

    const permission = TestBed.createComponent(PermissionCardComponent);
    permission.componentInstance.permission = {
      id: 1,
      type: 'permission_request',
      requestId: 'req-1',
      method: 'fs/write_text_file',
      description: 'Write backend/src/web/hub.rs',
      responded: true,
      decision: 'Allowed',
    };
    permission.detectChanges();

    const tool = TestBed.createComponent(ToolCallComponent);
    tool.componentInstance.tool = {
      id: 2,
      type: 'tool_call',
      toolCallId: 'tool-1',
      title: 'Edit backend/src/web/hub.rs',
      status: 'completed',
      output: null,
    };
    tool.detectChanges();

    for (const element of [plan.nativeElement, permission.nativeElement, tool.nativeElement] as HTMLElement[]) {
      const style = getComputedStyle(element);
      expect(Number.parseFloat(style.marginTop)).toBe(0);
      expect(Number.parseFloat(style.marginBottom)).toBe(0);
    }
  });
});
