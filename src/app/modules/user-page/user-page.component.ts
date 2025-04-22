import { Component, computed, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AuthService } from "../../core/services/auth/auth.service";
import { SharedModule } from "../../shared/shared.module";
import { PrivacyPolicyComponent } from "../information-page/components/privacy-policy/privacy-policy.component";
import { SignUpComponent } from "../landing-page/components/sign-up/sign-up.component";
import { LandingPageService } from "../landing-page/services/landing-page/landing-page.service";

@Component({
  selector: "app-user-page",
  imports: [
    RouterOutlet,
    SharedModule,
    SignUpComponent,
    PrivacyPolicyComponent,
  ],
  templateUrl: "./user-page.component.html",
  styleUrl: "./user-page.component.scss",
})
export class UserPageComponent {
  private authService = inject(AuthService);
  private landingPageService = inject(LandingPageService);

  privacyPolicyActive = computed(() =>
    this.landingPageService.privacyPolicyActive(),
  );

  upgradeMenu = computed(() => this.authService.upgradeMenu());
}
