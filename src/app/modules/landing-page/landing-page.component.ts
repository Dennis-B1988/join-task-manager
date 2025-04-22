import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { getAuth } from "firebase/auth";
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

  viewSignUp() {
    this.landingPageService.signUpActive.set(true);
  }

  viewLegalNotice() {
    this.landingPageService.toggleLegalNotice();
  }

  viewPrivacyPolicy() {
    this.landingPageService.togglePrivacyPolicy();
  }

  ngOnDestroy() {
    this.landingPageService.signUpActive.set(false);
    this.landingPageService.legalNoticeActive.set(false);
    this.landingPageService.privacyPolicyActive.set(false);
  }
}
