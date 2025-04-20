import { Component, computed, inject } from "@angular/core";
import { LandingPageService } from "../../../landing-page/services/landing-page/landing-page.service";

@Component({
  selector: "app-legal-notice",
  imports: [],
  templateUrl: "./legal-notice.component.html",
  styleUrl: "./legal-notice.component.scss",
})
export class LegalNoticeComponent {
  private landingPageService = inject(LandingPageService);

  legalNoticeActive = computed(() =>
    this.landingPageService.legalNoticeActive(),
  );

  goBack() {
    this.landingPageService.goBackToLogIn();
  }
}
