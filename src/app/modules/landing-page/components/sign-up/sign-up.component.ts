import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../../../core/services/auth/auth.service";
import { LandingPageComponent } from "../../landing-page.component";

@Component({
  selector: "app-sign-up",
  imports: [FormsModule],
  templateUrl: "./sign-up.component.html",
  styleUrl: "./sign-up.component.scss",
})
export class SignUpComponent {
  private authService = inject(AuthService);
  private signUp = inject(LandingPageComponent);

  name = this.authService.user.name;
  email = this.authService.user.email;
  password = this.authService.user.password;
  confirmPassword = "";
  policy = false;

  checkPolicy() {
    this.policy = !this.policy;
  }

  onSubmit(): void {
    if (this.password !== this.confirmPassword) {
      console.log("Passwords do not match");
      return;
    }
    this.authService.createUser();
    // this.clearInputs();
    // this.signUpSuccess();
  }

  backToLogIn() {
    this.signUp.signUpActive.set(false);
  }
}
