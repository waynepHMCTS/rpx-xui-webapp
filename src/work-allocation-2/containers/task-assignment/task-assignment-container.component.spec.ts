import { CdkTableModule } from '@angular/cdk/table';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PaginationModule } from '@hmcts/ccd-case-ui-toolkit';
import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';
import { Observable } from 'rxjs';
import { TaskListComponent } from '..';
import { ErrorMessageComponent } from '../../../app/components';
import { TaskActionConstants } from '../../components/constants';
import { WorkAllocationComponentsModule } from '../../components/work-allocation.components.module';
import { Assignee } from '../../models/dtos';
import { Task } from '../../models/tasks';
import { InfoMessageCommService, WorkAllocationTaskService } from '../../services';
import { getMockCaseworkers, getMockTasks } from '../../tests/utils.spec';
import {
  NAME_ERROR,
  TaskAssignmentContainerComponent,
} from './task-assignment-container.component';

@Component({
  template: `<exui-task-container-assignment></exui-task-container-assignment>`
})
class WrapperComponent {
  @ViewChild(TaskAssignmentContainerComponent) public appComponentRef: TaskAssignmentContainerComponent;
  @Input() public tasks: Task[];
}

@Component({
  template: `<div>Nothing</div>`
})
class NothingComponent { }

describe('TaskAssignmentContainerComponent', () => {
  let component: TaskAssignmentContainerComponent;
  let wrapper: WrapperComponent;
  let fixture: ComponentFixture<WrapperComponent>;

  const mockTasks = getMockTasks();
  const mockCaseworkers = getMockCaseworkers();
  const mockWorkAllocationService = {
    assignTask: jasmine.createSpy('assignTask').and.returnValue(Observable.of({}))
  };
  const MESSAGE_SERVICE_METHODS = ['addMessage', 'emitMessages', 'getMessages', 'nextMessage', 'removeAllMessages'];
  const mockInfoMessageCommService = jasmine.createSpyObj('mockInfoMessageCommService', MESSAGE_SERVICE_METHODS);

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TaskAssignmentContainerComponent, WrapperComponent, TaskListComponent,
        ErrorMessageComponent, NothingComponent
      ],
      imports: [
        WorkAllocationComponentsModule, CdkTableModule, FormsModule, HttpClientModule, ExuiCommonLibModule, PaginationModule,
        RouterTestingModule.withRoutes(
          [
            { path: 'mywork/list', component: NothingComponent }
          ]
        )
      ],
      providers: [
        { provide: WorkAllocationTaskService, useValue: mockWorkAllocationService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                taskAndCaseworkers: { data: mockTasks[0], caseworkers: [] },
                ...TaskActionConstants.Reassign
              }
            },
            params: Observable.of({ task: mockTasks[0] })
          }
        },
        { provide: InfoMessageCommService, useValue: mockInfoMessageCommService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(WrapperComponent);
    wrapper = fixture.componentInstance;
    component = wrapper.appComponentRef;

    wrapper.tasks = null;
    window.history.pushState({ returnUrl: 'mywork/list', showAssigneeColumn: false }, '', 'mywork/list');
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should send an error message when a caseworker is not selected and there is an attempt to assign', () => {
    expect(component.caseworker).toBeUndefined();
    expect(component.error).toBeNull();

    component.assign();
    fixture.detectChanges();
    expect(component.error).not.toBeNull();
    expect(component.error.title).toEqual(NAME_ERROR.title);
    expect(component.error.description).toEqual(NAME_ERROR.description);
    expect(component.error.fieldId).toEqual(NAME_ERROR.fieldId);

  });

  it('should assign succesfully', () => {
    const caseworker = mockCaseworkers[0];
    component.caseworker = caseworker;
    fixture.detectChanges();

    component.assign();

    fixture.detectChanges();
    const assignee: Assignee = {
      userId: caseworker.idamId
    };
    expect(mockWorkAllocationService.assignTask).toHaveBeenCalledWith(mockTasks[0].id, assignee);
  });
  // TODO: Need to write tests regarding template
});
