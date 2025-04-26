import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MockComponent, MockProvider } from "ng-mocks";
import { PrivacyPolicyComponent } from "./privacy-policy.component";

describe("PrivacyPolicyComponent", () => {
  let component: PrivacyPolicyComponent;
  let fixture: ComponentFixture<PrivacyPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacyPolicyComponent],
      providers: [MockProvider(PrivacyPolicyComponent)],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacyPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
