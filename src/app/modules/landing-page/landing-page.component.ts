import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { User } from "../../core/models/user.model";

@Component({
  selector: "app-landing-page",
  imports: [RouterLink],
  templateUrl: "./landing-page.component.html",
  styleUrl: "./landing-page.component.scss",
})
export class LandingPageComponent implements OnInit {
  // user = input.required<User>();
  user = "Test User";
  userId = "1";

  animateLogo: boolean = false; // Trigger logo animation
  showHeader: boolean = false; // Control header visibility
  showLogin: boolean = false; // Control login form visibility
  showLogo: boolean = true;

  ngOnInit() {
    // Start logo animation after 1 second
    setTimeout(() => {
      this.animateLogo = true;
    }, 1000);
  }

  onAnimationEnd() {
    // After animation ends, display header and login form
    this.showHeader = true;
    this.showLogin = true;
    this.showLogo = false;
  }
}
