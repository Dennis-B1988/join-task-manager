import { Component, inject, input, signal } from "@angular/core";
import { FormBuilder, FormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../../../core/services/auth/auth.service";
import { LandingPageComponent } from "../../landing-page.component";

@Component({
  selector: "app-sign-up",
  imports: [FormsModule],
  templateUrl: "./sign-up.component.html",
  styleUrl: "./sign-up.component.scss",
})
export class SignUpComponent {
  authService = inject(AuthService);
  signUp = inject(LandingPageComponent);

  name = signal<string>("");
  email = signal<string>("");
  password = signal<string>("");
  confirmPassword = signal<string>("");
  policy = signal<boolean>(false);

  checkPolicy() {
    this.policy.set(!this.policy());
  }

  onSubmit(): void {
    this.authService
      .signUp(this.email(), this.name(), this.password())
      .subscribe({
        next: () => {
          this.signUp.signUpActive.set(false);
        },
        error: () => {
          console.log("error");
        },
      });
  }

  backToLogIn() {
    // this.signUp.signUp.set(false);
  }
}
