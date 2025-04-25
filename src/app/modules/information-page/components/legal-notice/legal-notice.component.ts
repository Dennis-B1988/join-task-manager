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

  /**
   * Resets the active states for legal notice and privacy policy to false.
   * This is used to hide the legal notice and privacy policy components when
   * the user goes back to the log in screen.
   */
  goBack(): void {
    this.landingPageService.goBackToLogIn();
  }
}
