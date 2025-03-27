import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsInformationComponent } from './contacts-information.component';

describe('ContactsInformationComponent', () => {
  let component: ContactsInformationComponent;
  let fixture: ComponentFixture<ContactsInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactsInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactsInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
