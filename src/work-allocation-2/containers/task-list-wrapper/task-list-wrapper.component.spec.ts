import { CdkTableModule } from '@angular/cdk/table';
import { ChangeDetectorRef} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService, LoadingService, PaginationModule } from '@hmcts/ccd-case-ui-toolkit';
import { ExuiCommonLibModule, FeatureToggleService} from '@hmcts/rpx-xui-common-lib';
import { of } from 'rxjs';
import { TaskListComponent } from '..';
import { SessionStorageService } from '../../../app/services';
import { WorkAllocationComponentsModule } from '../../components/work-allocation.components.module';
import { Task } from '../../models/tasks';
import { InfoMessageCommService, WorkAllocationFeatureService, WorkAllocationTaskService } from '../../services';
import { getMockTasks, MockRouter } from '../../tests/utils.spec';
import { TaskListWrapperComponent } from './task-list-wrapper.component';

describe('TaskListWrapperComponent', () => {
  let component: TaskListWrapperComponent;
  let fixture: ComponentFixture<TaskListWrapperComponent>;
  const mockRef = jasmine.createSpyObj('mockRef', ['']);
  const mockRouter: MockRouter = new MockRouter();
  const mockWorkAllocationService = jasmine.createSpyObj('mockWorkAllocationService', ['searchTask', 'getTask']);
  const mockInfoMessageCommService = jasmine.createSpyObj('mockInfoMessageCommService', ['']);
  const mockSessionStorageService = jasmine.createSpyObj('mockSessionStorageService', ['getItem']);
  const mockAlertService = jasmine.createSpyObj('mockAlertService', ['']);
  const mockFeatureService = jasmine.createSpyObj('mockFeatureService', ['getActiveWAFeature']);
  const mockLoadingService = jasmine.createSpyObj('mockLoadingService', ['register', 'unregister']);
  const mockFeatureToggleService = jasmine.createSpyObj('mockLoadingService', ['isEnabled']);
  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [
        WorkAllocationComponentsModule,
        ExuiCommonLibModule,
        RouterTestingModule,
        CdkTableModule,
        PaginationModule
      ],
      declarations: [TaskListComponent, TaskListWrapperComponent],
      providers: [
        { provide: ChangeDetectorRef, useValue: mockRef },
        { provide: WorkAllocationTaskService, useValue: mockWorkAllocationService },
        { provide: Router, useValue: mockRouter },
        { provide: InfoMessageCommService, useValue: mockInfoMessageCommService },
        { provide: SessionStorageService, useValue: mockSessionStorageService },
        { provide: AlertService, useValue: mockAlertService },
        { provide: WorkAllocationFeatureService, useValue: mockFeatureService },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: FeatureToggleService, useValue: mockFeatureToggleService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(TaskListWrapperComponent);
    component = fixture.componentInstance;
    component.isPaginationEnabled$ = of(false);
    const tasks: Task[] = getMockTasks();
    mockWorkAllocationService.searchTask.and.returnValue(of({ tasks }));
    mockFeatureService.getActiveWAFeature.and.returnValue(of('WorkAllocationRelease2'));
    mockFeatureToggleService.isEnabled.and.returnValue(of(false));
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('onActionHandler()', () => {
    const exampleTask = getMockTasks()[0];
    const firstAction = exampleTask.actions[0];
    const secondAction = exampleTask.actions[1];
    const firstTaskAction = { task: exampleTask, action: firstAction };
    const secondTaskAction = { task: exampleTask, action: secondAction };
    it('should handle an action', () => {
      // need to spy on the router and set up the task action
      spyOnProperty(mockRouter, 'url', 'get').and.returnValue(`/mywork/list`);
      const navigateCallsBefore = mockRouter.navigateCalls.length;

      // need to check that navigate has been called
      component.onActionHandler(firstTaskAction);
      expect(mockRouter.navigateCalls.length).toBeGreaterThan(navigateCallsBefore);

      // need to verify correct properties were called
      const lastNavigateCall = mockRouter.navigateCalls.pop();
      expect(lastNavigateCall.commands).toEqual([`/mywork/${exampleTask.id}/${firstAction.id}/`]);
      const exampleNavigateCall = { state: { returnUrl: '/mywork/list', showAssigneeColumn: true } };
      expect(lastNavigateCall.extras).toEqual(exampleNavigateCall);
    });

    it('should handle an action returned via the task manager page', () => {
      // need to spy on the router and set up the task action
      spyOnProperty(mockRouter, 'url', 'get').and.returnValue(`/mywork/manager`);
      const navigateCallsBefore = mockRouter.navigateCalls.length;

      // need to check that navigate has been called
      component.onActionHandler(secondTaskAction);
      expect(mockRouter.navigateCalls.length).toBeGreaterThan(navigateCallsBefore);

      // need to verify correct properties were called
      const lastNavigateCall = mockRouter.navigateCalls.pop();
      expect(lastNavigateCall.commands).toEqual([`/mywork/${exampleTask.id}/${secondAction.id}/`]);
      const exampleNavigateCall = { state: { returnUrl: '/mywork/manager', showAssigneeColumn: true } };
      expect(lastNavigateCall.extras).toEqual(exampleNavigateCall);
    });
  });
});
