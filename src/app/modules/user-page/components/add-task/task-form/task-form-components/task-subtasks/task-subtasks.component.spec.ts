import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskSubtasksComponent } from './task-subtasks.component';

describe('TaskSubtasksComponent', () => {
  let component: TaskSubtasksComponent;
  let fixture: ComponentFixture<TaskSubtasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskSubtasksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskSubtasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
