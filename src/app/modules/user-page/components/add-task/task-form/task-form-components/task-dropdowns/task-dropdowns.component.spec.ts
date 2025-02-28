import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDropdownsComponent } from './task-dropdowns.component';

describe('TaskDropdownsComponent', () => {
  let component: TaskDropdownsComponent;
  let fixture: ComponentFixture<TaskDropdownsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDropdownsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskDropdownsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
