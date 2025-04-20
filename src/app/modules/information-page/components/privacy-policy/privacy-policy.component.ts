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

  goBack() {
    this.landingPageService.goBackToLogIn();
  }
}
