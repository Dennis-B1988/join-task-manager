import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LandingPageService {
  signUpActive = signal(false);

  toggleSignUp() {
    this.signUpActive.set(!this.signUpActive());
  }
}
