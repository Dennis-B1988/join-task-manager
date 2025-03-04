import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskAssignedToComponent } from './task-assigned-to.component';

describe('TaskAssignedToComponent', () => {
  let component: TaskAssignedToComponent;
  let fixture: ComponentFixture<TaskAssignedToComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskAssignedToComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskAssignedToComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
