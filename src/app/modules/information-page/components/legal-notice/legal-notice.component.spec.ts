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
        MockProvider(LegalNoticeComponent, {
          legalNoticeActive: signal(false),
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
});
