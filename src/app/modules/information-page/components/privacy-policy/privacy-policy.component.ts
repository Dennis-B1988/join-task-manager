import { Component, computed, inject } from "@angular/core";
import { LandingPageService } from "../../../landing-page/services/landing-page/landing-page.service";

@Component({
  selector: "app-privacy-policy",
  imports: [],
  templateUrl: "./privacy-policy.component.html",
  styleUrl: "./privacy-policy.component.scss",
})
export class PrivacyPolicyComponent {
  private landingPageService = inject(LandingPageService);

  privacyPolicyActive = computed(() =>
    this.landingPageService.privacyPolicyActive(),
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
