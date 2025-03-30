import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactFormContainerComponent } from './contact-form-container.component';

describe('ContactFormContainerComponent', () => {
  let component: ContactFormContainerComponent;
  let fixture: ComponentFixture<ContactFormContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactFormContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactFormContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
