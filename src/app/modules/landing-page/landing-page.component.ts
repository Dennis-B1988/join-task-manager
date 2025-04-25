import { Component, computed, inject, OnDestroy } from "@angular/core";
import { LegalNoticeComponent } from "../information-page/components/legal-notice/legal-notice.component";
import { PrivacyPolicyComponent } from "../information-page/components/privacy-policy/privacy-policy.component";
import { LogInComponent } from "./components/log-in/log-in.component";
import { SignUpComponent } from "./components/sign-up/sign-up.component";
import { LandingPageService } from "./services/landing-page/landing-page.service";

@Component({
  selector: "app-landing-page",
  imports: [
    LogInComponent,
    SignUpComponent,
    LegalNoticeComponent,
    PrivacyPolicyComponent,
  ],
  templateUrl: "./landing-page.component.html",
  styleUrl: "./landing-page.component.scss",
})
export class LandingPageComponent implements OnDestroy {
  private landingPageService = inject(LandingPageService);

  signUpActive = computed(() => this.landingPageService.signUpActive());
  legalNoticeActive = computed(() =>
    this.landingPageService.legalNoticeActive(),
  );
  privacyPolicyActive = computed(() =>
    this.landingPageService.privacyPolicyActive(),
  );

  /**
   * Toggles the sign-up active state. If the sign-up is active, the sign-up
   * component is displayed. If the sign-up is not active, the sign-up component
   * is hidden.
   */
  viewSignUp(): void {
    this.landingPageService.signUpActive.set(true);
  }

  /**
   * Toggles the legal notice active state. If the legal notice is active,
   * the legal notice component is displayed. If the legal notice is not active,
   * the legal notice component is hidden.
   */
  viewLegalNotice(): void {
    this.landingPageService.toggleLegalNotice();
  }

  /**
   * Toggles the privacy policy active state. If the privacy policy is active, the
   * privacy policy component is shown. If the privacy policy is not active, the
   * privacy policy component is not shown.
   */
  viewPrivacyPolicy(): void {
    this.landingPageService.togglePrivacyPolicy();
  }

  /**
   * Cleans up the component by resetting the active states for sign-up, legal notice,
   * and privacy policy to false when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.landingPageService.signUpActive.set(false);
    this.landingPageService.legalNoticeActive.set(false);
    this.landingPageService.privacyPolicyActive.set(false);
  }
}
