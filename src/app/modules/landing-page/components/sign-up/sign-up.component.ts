import { Component, inject } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AuthService } from "../../../../core/services/auth/auth.service";
import { LandingPageService } from "../../services/landing-page/landing-page.service";

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

  // displayName: string = "";
  isLoading: boolean = false;
  policy: boolean = false;
  focusPassword: boolean = false;
  focusConfirmPassword: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

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

  formValid = this.signupForm.controls;

  get passwordImage() {
    const passwordValue = this.signupForm
      .get("passwords")
      ?.get("password")?.value;
    if (passwordValue === "") {
      return "assets/img/lock.png";
    } else if (passwordValue !== "" && this.showPassword) {
      return "assets/img/visible.png";
    } else {
      return "assets/img/visible_off.png";
    }
  }

  get confirmPasswordImage() {
    const passwordValue = this.signupForm
      .get("passwords")
      ?.get("confirmPassword")?.value;
    if (passwordValue === "") {
      return "assets/img/lock.png";
    } else if (passwordValue !== "" && this.showConfirmPassword) {
      return "assets/img/visible.png";
    } else {
      return "assets/img/visible_off.png";
    }
  }

  checkPolicy() {
    this.policy = !this.policy;
  }

  async onSubmit() {
    console.log("Submit");
    if (
      // !this.signupForm.valid
      !this.signupForm.get("displayName") ||
      // !this.signupForm.get("lastname") ||
      !this.signupForm.get("email") ||
      !this.policy
    ) {
      this.signupForm.markAllAsTouched();
      return;
    }

    console.log("Past validation");

    if (
      this.signupForm.get("passwords")!.get("password")!.value !==
      this.signupForm.get("passwords")!.get("confirmPassword")!.value
    ) {
      return console.log("Passwords do not match");
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

  toggleFocusPassword() {
    this.focusPassword = !this.focusPassword;
  }

  toggleFocusConfirmPassword() {
    this.focusConfirmPassword = !this.focusConfirmPassword;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
