import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTaskFromBoardComponent } from './add-task-from-board.component';

describe('AddTaskFromBoardComponent', () => {
  let component: AddTaskFromBoardComponent;
  let fixture: ComponentFixture<AddTaskFromBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTaskFromBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTaskFromBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
