import { TestBed } from "@angular/core/testing";
import { LandingPageService } from "./landing-page.service";

describe("LandingPageService", () => {
  let service: LandingPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LandingPageService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("computed signals", () => {
    it("signUpActive", () => {
      expect(service.signUpActive()).toBe(false);
      service.signUpActive.set(true);
      expect(service.signUpActive()).toBe(true);
    });

    it("legalNoticeActive", () => {
      expect(service.legalNoticeActive()).toBe(false);
      service.legalNoticeActive.set(true);
      expect(service.legalNoticeActive()).toBe(true);
    });

    it("privacyPolicyActive", () => {
      expect(service.privacyPolicyActive()).toBe(false);
      service.privacyPolicyActive.set(true);
      expect(service.privacyPolicyActive()).toBe(true);
    });

    it("toggleLegalNotice", () => {
      expect(service.legalNoticeActive()).toBe(false);
      service.toggleLegalNotice();
      expect(service.legalNoticeActive()).toBe(true);
    });

    it("togglePrivacyPolicy", () => {
      expect(service.privacyPolicyActive()).toBe(false);
      service.togglePrivacyPolicy();
      expect(service.privacyPolicyActive()).toBe(true);
    });

    it("goBackToLogIn", () => {
      expect(service.legalNoticeActive()).toBe(false);
      expect(service.privacyPolicyActive()).toBe(false);
      service.goBackToLogIn();
      expect(service.legalNoticeActive()).toBe(false);
      expect(service.privacyPolicyActive()).toBe(false);
    });
  });
});
