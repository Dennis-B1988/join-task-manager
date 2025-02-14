import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../../../core/services/auth/auth.service";
import { LandingPageService } from "../../services/landing-page.service";

@Component({
  selector: "app-sign-up",
  imports: [FormsModule],
  templateUrl: "./sign-up.component.html",
  styleUrl: "./sign-up.component.scss",
})
export class SignUpComponent {
  private authService = inject(AuthService);
  private landingPageService = inject(LandingPageService);

  isLoading: boolean = false;

  displayName: string = "";
  email: string = "";
  password: string = "";
  confirmPassword: string = "";
  policy: boolean = false;

  checkPolicy() {
    this.policy = !this.policy;
  }

  async onSubmit() {
    if (
      !this.displayName ||
      !this.email ||
      this.password !== this.confirmPassword ||
      !this.policy
    ) {
      console.log("Passwords do not match");
      return;
    }

    this.isLoading = true;
    try {
      await this.authService.createUser(
        this.displayName,
        this.email,
        this.password,
      );
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      this.isLoading = false;
      this.landingPageService.toggleSignUp();
    }
  }

  backToLogIn() {
    this.landingPageService.toggleSignUp();
  }
}
