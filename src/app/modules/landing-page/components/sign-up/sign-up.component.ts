import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { User } from "../../../../core/models/user.model";
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
  user = new User();

  name: string = this.user.displayName;
  email: string = this.user.email;
  password: string = this.user?.password || "";
  confirmPassword: string = "";
  policy: boolean = false;

  checkPolicy() {
    this.policy = !this.policy;
  }

  onSubmit(): void {
    if (
      !this.name ||
      !this.email ||
      this.password !== this.confirmPassword ||
      !this.policy
    ) {
      console.log("Passwords do not match");
      return;
    }
    this.authService.createUser(this.name, this.email, this.password);
    this.signUp.signUpActive.set(false);

    // this.clearInputs();
    // this.signUpSuccess();
  }

  backToLogIn() {
    this.signUp.signUpActive.set(false);
  }
}
