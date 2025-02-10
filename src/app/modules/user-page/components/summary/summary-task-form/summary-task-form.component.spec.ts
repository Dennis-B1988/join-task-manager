import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryTaskFormComponent } from './summary-task-form.component';

describe('SummaryTaskFormComponent', () => {
  let component: SummaryTaskFormComponent;
  let fixture: ComponentFixture<SummaryTaskFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryTaskFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryTaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
