import { ComponentFixture, TestBed } from "@angular/core/testing";

import { signal } from "@angular/core";
import { MockProvider } from "ng-mocks";
import { LandingPageService } from "../../../landing-page/services/landing-page/landing-page.service";
import { LegalNoticeComponent } from "./legal-notice.component";

describe("LegalNoticeComponent", () => {
  let component: LegalNoticeComponent;
  let fixture: ComponentFixture<LegalNoticeComponent>;
  let mockService: LandingPageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalNoticeComponent],
      providers: [
        MockProvider(LandingPageService, {
          legalNoticeActive: signal(false),
          goBackToLogIn: jasmine.createSpy(),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LegalNoticeComponent);
    component = fixture.componentInstance;
    mockService = TestBed.inject(LandingPageService);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("computed signals", () => {
    it("reflects service.legalNoticeActive", () => {
      expect(component.legalNoticeActive()).toBe(false);
      mockService.legalNoticeActive.set(true);
      fixture.detectChanges();
      expect(component.legalNoticeActive()).toBe(true);
    });
  });

  describe("button clicks", () => {
    it("should call goBack() on legal notice image button click", () => {
      mockService.legalNoticeActive.set(true);
      fixture.detectChanges();
      const imageButton = fixture.nativeElement.querySelector(
        "#legal-notice-go-back-btn",
      );
      imageButton.click();
      fixture.detectChanges();
      expect(mockService.goBackToLogIn).toHaveBeenCalled();
    });
  });
});
