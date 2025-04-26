import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Auth } from "@angular/fire/auth";
import { Firestore } from "@angular/fire/firestore";
import { MockComponent, MockProvider } from "ng-mocks";

import { LogInComponent } from "./components/log-in/log-in.component";
import { SignUpComponent } from "./components/sign-up/sign-up.component";
import { LandingPageComponent } from "./landing-page.component";
import { LandingPageService } from "./services/landing-page/landing-page.service";

describe("LandingPageComponent", () => {
  let fixture: ComponentFixture<LandingPageComponent>;
  let component: LandingPageComponent;
  let mockService: LandingPageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingPageComponent],
      declarations: [
        MockComponent(LogInComponent),
        MockComponent(SignUpComponent),
      ],
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

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("computed signals", () => {
    it("should reflect signUpActive", () => {
      expect(component.signUpActive()).toBe(false);

      mockService.signUpActive.set(true);
      fixture.detectChanges();

      expect(component.signUpActive()).toBe(true);
    });

    it("should reflect legalNoticeActive", () => {
      expect(component.legalNoticeActive()).toBe(false);

      mockService.legalNoticeActive.set(true);
      fixture.detectChanges();

      expect(component.legalNoticeActive()).toBe(true);
    });

    it("should reflect privacyPolicyActive", () => {
      expect(component.privacyPolicyActive()).toBe(false);

      mockService.privacyPolicyActive.set(true);
      fixture.detectChanges();

      expect(component.privacyPolicyActive()).toBe(true);
    });
  });

  describe("viewX methods", () => {
    it("should activate signUp on viewSignUp()", () => {
      component.viewSignUp();
      expect(mockService.signUpActive()).toBe(true);
    });

    it("should toggle legal notice on viewLegalNotice()", () => {
      component.viewLegalNotice();
      expect(mockService.toggleLegalNotice).toHaveBeenCalled();
    });

    it("should toggle privacy policy on viewPrivacyPolicy()", () => {
      component.viewPrivacyPolicy();
      expect(mockService.togglePrivacyPolicy).toHaveBeenCalled();
    });
  });

  describe("on destroy", () => {
    it("should reset all signals", () => {
      mockService.signUpActive.set(true);
      mockService.legalNoticeActive.set(true);
      mockService.privacyPolicyActive.set(true);

      component.ngOnDestroy();

      expect(mockService.signUpActive()).toBe(false);
      expect(mockService.legalNoticeActive()).toBe(false);
      expect(mockService.privacyPolicyActive()).toBe(false);
    });
  });

  describe("DOM", () => {
    it("should render LogInComponent", () => {
      const logInElement = fixture.nativeElement.querySelector("app-log-in");
      expect(logInElement).not.toBeNull();
    });

    it("should show SignUpComponent when signUpActive is true", () => {
      expect(fixture.nativeElement.querySelector("app-sign-up")).toBeNull();

      mockService.signUpActive.set(true);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector("app-sign-up")).not.toBeNull();
    });

    describe("button clicks", () => {
      it("should call viewSignUp() on sign up button click", () => {
        const button = fixture.nativeElement.querySelector("#sign-up-btn");
        button.click();
        fixture.detectChanges();
        expect(mockService.signUpActive()).toBe(true);
      });

      it("should call togglePrivacyPolicy() on privacy policy button click", () => {
        const button = fixture.nativeElement.querySelector(
          "#privacy-policy-btn",
        );
        button.click();
        fixture.detectChanges();
        expect(mockService.togglePrivacyPolicy).toHaveBeenCalled();
      });

      it("should call toggleLegalNotice() on legal notice button click", () => {
        const button = fixture.nativeElement.querySelector("#legal-notice-btn");
        button.click();
        fixture.detectChanges();
        expect(mockService.toggleLegalNotice).toHaveBeenCalled();
      });
    });
  });
});
