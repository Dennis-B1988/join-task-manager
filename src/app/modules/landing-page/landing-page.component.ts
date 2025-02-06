import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  OnInit,
  signal,
  ViewChild,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { LogInComponent } from "./components/log-in/log-in.component";
import { SignUpComponent } from "./components/sign-up/sign-up.component";

@Component({
  selector: "app-landing-page",
  imports: [LogInComponent, SignUpComponent],
  templateUrl: "./landing-page.component.html",
  styleUrl: "./landing-page.component.scss",
})
export class LandingPageComponent {
  // user = input.required<User>();
  user = "Test User";
  userId = "1";

  signUpActive = signal(false);

  viewSignUp() {
    this.signUpActive.set(!this.signUpActive());
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
