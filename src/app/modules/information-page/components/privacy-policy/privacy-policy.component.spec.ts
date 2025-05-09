import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MockProvider } from "ng-mocks";
import { LandingPageService } from "../../../landing-page/services/landing-page/landing-page.service";
import { PrivacyPolicyComponent } from "./privacy-policy.component";

describe("PrivacyPolicyComponent", () => {
  let component: PrivacyPolicyComponent;
  let fixture: ComponentFixture<PrivacyPolicyComponent>;
  let mockService: LandingPageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacyPolicyComponent],
      providers: [
        MockProvider(LandingPageService, {
          privacyPolicyActive: signal(false),
          goBackToLogIn: jasmine.createSpy(),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacyPolicyComponent);
    component = fixture.componentInstance;
    mockService = TestBed.inject(LandingPageService);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("computed signals", () => {
    it("reflects service.privacyPolicyActive", () => {
      expect(component.privacyPolicyActive()).toBe(false);
      mockService.privacyPolicyActive.set(true);
      fixture.detectChanges();
      expect(component.privacyPolicyActive()).toBe(true);
    });
  });

  describe("button clicks", () => {
    it("should call goBack() on privacy policy image button click", () => {
      mockService.privacyPolicyActive.set(true);
      fixture.detectChanges();
      const imageButton = fixture.nativeElement.querySelector(
        "#privacy-policy-go-back-btn",
      );
      imageButton.click();
      fixture.detectChanges();
      expect(mockService.goBackToLogIn).toHaveBeenCalled();
      mockService.privacyPolicyActive.set(false);
    });
  });
});
