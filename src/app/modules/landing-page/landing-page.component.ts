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

@Component({
  selector: "app-landing-page",
  imports: [LogInComponent, SignUpComponent],
  templateUrl: "./landing-page.component.html",
  styleUrl: "./landing-page.component.scss",
})
export class LandingPageComponent {
  private landingPageService = inject(LandingPageService);

  signUpActive = computed(() => this.landingPageService.signUpActive());

  viewSignUp() {
    this.landingPageService.toggleSignUp();
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
