import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  OnInit,
  signal,
  ViewChild,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { getAuth } from "firebase/auth";
import { LogInComponent } from "./components/log-in/log-in.component";
import { SignUpComponent } from "./components/sign-up/sign-up.component";
import { LandingPageService } from "./services/landing-page/landing-page.service";
import { LegalNoticeComponent } from "../information-page/components/legal-notice/legal-notice.component";
import { PrivacyPolicyComponent } from "../information-page/components/privacy-policy/privacy-policy.component";

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
export class LandingPageComponent {
  private landingPageService = inject(LandingPageService);

  signUpActive = computed(() => this.landingPageService.signUpActive());
  legalNoticeActive = computed(() =>
    this.landingPageService.legalNoticeActive(),
  );
  privacyPolicyActive = computed(() =>
    this.landingPageService.privacyPolicyActive(),
  );

  viewSignUp() {
    this.landingPageService.toggleSignUp();
  }

  viewLegalNotice() {
    this.landingPageService.toggleLegalNotice();
  }

  viewPrivacyPolicy() {
    this.landingPageService.togglePrivacyPolicy();
  }

  // animateLogo: boolean = false; // Trigger logo animation
  // showHeader: boolean = false; // Control header visibility
  // showLogin: boolean = false; // Control login form visibility
  // showLogo: boolean = true;

  // ngOnInit() {
  //   // Start logo animation after 1 second
  //   setTimeout(() => {
  //     this.animateLogo = true;
  //   }, 1000);
  // }

  // onAnimationEnd() {
  //   // After animation ends, display header and login form
  //   this.showHeader = true;
  //   this.showLogin = true;
  //   this.showLogo = false;
  // }
}
