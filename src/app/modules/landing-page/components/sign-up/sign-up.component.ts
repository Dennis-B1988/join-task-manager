import { Component, inject } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AuthService } from "../../../../core/services/auth/auth.service";
import { LandingPageService } from "../../services/landing-page.service";

function passwordMatchValidator(
  controlPassword: string,
  controlConfirmPassword: string,
) {
  return (control: AbstractControl) => {
    const pass = control.get(controlPassword)?.value;
    const confirmPass = control.get(controlConfirmPassword)?.value;
    return pass === confirmPass ? null : { passwordMismatch: true };
  };
}

@Component({
  selector: "app-sign-up",
  imports: [ReactiveFormsModule],
  templateUrl: "./sign-up.component.html",
  styleUrl: "./sign-up.component.scss",
})
export class SignUpComponent {
  private authService = inject(AuthService);
  private landingPageService = inject(LandingPageService);

  isLoading: boolean = false;

  signupForm = new FormGroup({
    displayName: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.email, Validators.required],
    }),
    passwords: new FormGroup(
      {
        password: new FormControl<string>("", {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(6)],
        }),
        confirmPassword: new FormControl<string>("", {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(6)],
        }),
      },
      { validators: [passwordMatchValidator("password", "confirmPassword")] },
    ),
  });

  policy: boolean = false;

  checkPolicy() {
    this.policy = !this.policy;
  }

  async onSubmit() {
    if (
      !this.signupForm.get("displayName") ||
      !this.signupForm.get("email") ||
      this.signupForm.get("passwords")!.get("password")!.value !==
        this.signupForm.get("passwords")!.get("confirmPassword")!.value ||
      !this.policy
    ) {
      console.log("Passwords do not match");
      return;
    }

    this.isLoading = true;
    try {
      await this.authService.createUser(
        this.signupForm.get("displayName")!.value,
        this.signupForm.get("email")!.value,
        this.signupForm.get("passwords")!.get("password")!.value,
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
