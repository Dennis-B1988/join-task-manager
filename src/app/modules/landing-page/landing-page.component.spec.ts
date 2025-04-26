import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Auth } from "@angular/fire/auth";
import { Firestore } from "@angular/fire/firestore";
import { MockComponent, MockProvider } from "ng-mocks";
import { LogInComponent } from "./components/log-in/log-in.component";
import { SignUpComponent } from "./components/sign-up/sign-up.component";
import { LandingPageComponent } from "./landing-page.component";
import { LandingPageService } from "./services/landing-page/landing-page.service";

describe("LandingPageComponent (standalone)", () => {
  let fixture: ComponentFixture<LandingPageComponent>;
  let component: LandingPageComponent;
  let mockService: LandingPageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(LogInComponent),
        MockComponent(SignUpComponent),
      ],
      imports: [LandingPageComponent],
      providers: [
        MockProvider(LandingPageService, {
          signUpActive: signal(false),
          legalNoticeActive: signal(false),
          privacyPolicyActive: signal(false),
          toggleLegalNotice: jasmine.createSpy(),
          togglePrivacyPolicy: jasmine.createSpy(),
        }),
        MockProvider(Auth),
        MockProvider(Firestore),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    mockService = TestBed.inject(LandingPageService);
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  describe("computed signals", () => {
    it("reflects service.signUpActive", () => {
      // initially false
      expect(component.signUpActive()).toBe(false);

      // flip the service signal
      mockService.signUpActive.set(true);
      fixture.detectChanges();
      expect(component.signUpActive()).toBe(true);
    });

    it("reflects service.legalNoticeActive", () => {
      expect(component.legalNoticeActive()).toBe(false);
      mockService.legalNoticeActive.set(true);
      fixture.detectChanges();
      expect(component.legalNoticeActive()).toBe(true);
    });

    it("reflects service.privacyPolicyActive", () => {
      expect(component.privacyPolicyActive()).toBe(false);
      mockService.privacyPolicyActive.set(true);
      fixture.detectChanges();
      expect(component.privacyPolicyActive()).toBe(true);
    });
  });

  describe("viewX methods", () => {
    it("viewSignUp() sets signUpActive to true", () => {
      component.viewSignUp();
      expect(mockService.signUpActive()).toBe(true);
    });

    it("viewLegalNotice() calls toggleLegalNotice()", () => {
      component.viewLegalNotice();
      expect(mockService.toggleLegalNotice).toHaveBeenCalled();
    });

    it("viewPrivacyPolicy() calls togglePrivacyPolicy()", () => {
      component.viewPrivacyPolicy();
      expect(mockService.togglePrivacyPolicy).toHaveBeenCalled();
    });
  });

  describe("ngOnDestroy", () => {
    it("resets all signals to false", () => {
      // set all true first
      mockService.signUpActive.set(true);
      mockService.legalNoticeActive.set(true);
      mockService.privacyPolicyActive.set(true);

      component.ngOnDestroy();

      expect(mockService.signUpActive()).toBe(false);
      expect(mockService.legalNoticeActive()).toBe(false);
      expect(mockService.privacyPolicyActive()).toBe(false);
    });
  });
});
