import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LandingPageService {
  signUpActive = signal(false);
  legalNoticeActive = signal(false);
  privacyPolicyActive = signal(false);

  toggleLegalNotice() {
    this.legalNoticeActive.set(!this.legalNoticeActive());
  }

  togglePrivacyPolicy() {
    this.privacyPolicyActive.set(!this.privacyPolicyActive());
  }

  goBackToLogIn() {
    this.legalNoticeActive.set(false);
    this.privacyPolicyActive.set(false);
  }
}
