import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LandingPageService {
  signUpActive = signal(false);
  legalNoticeActive = signal(false);
  privacyPolicyActive = signal(false);

  /**
   * Toggles the active state of the legal notice. When invoked, it switches
   * the visibility of the legal notice component by setting the current
   * active state to its opposite value.
   */
  toggleLegalNotice(): void {
    this.legalNoticeActive.set(!this.legalNoticeActive());
  }

  /**
   * Toggles the active state of the privacy policy. When invoked, it switches
   * the visibility of the privacy policy component by setting the current
   * active state to its opposite value.
   */

  togglePrivacyPolicy(): void {
    this.privacyPolicyActive.set(!this.privacyPolicyActive());
  }

  /**
   * Resets the active states for legal notice and privacy policy to false.
   * This is used to hide the legal notice and privacy policy components when
   * the user goes back to the log in screen.
   */
  goBackToLogIn(): void {
    this.legalNoticeActive.set(false);
    this.privacyPolicyActive.set(false);
  }
}
