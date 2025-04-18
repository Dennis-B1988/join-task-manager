import { Component, computed, inject, OnDestroy } from "@angular/core";
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
export class SignUpComponent implements OnDestroy {
  private authService = inject(AuthService);
  private landingPageService = inject(LandingPageService);

  isLoading: boolean = false;
  policy: boolean = false;
  focusPassword: boolean = false;
  focusConfirmPassword: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  upgradeMenu = computed(() => this.authService.upgradeMenu());

  emailUnavailable = computed(() => this.authService.emailUnavailable());
  weakPassword = computed(() => this.authService.weakPassword());

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
    if (
      this.signupForm.get("displayName")?.invalid ||
      this.signupForm.get("email")?.invalid ||
      this.signupForm.get("passwords")?.get("password")?.invalid ||
      this.signupForm.get("passwords")?.get("confirmPassword")?.invalid ||
      !this.policy
    ) {
      this.signupForm.markAllAsTouched();
      return;
    }

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
      this.landingPageService.signUpActive.set(false);
    }
  }

  async upgradeToFullUser() {
    if (
      this.signupForm.get("displayName")?.invalid ||
      this.signupForm.get("email")?.invalid ||
      this.signupForm.get("passwords")?.get("password")?.invalid ||
      this.signupForm.get("passwords")?.get("confirmPassword")?.invalid ||
      !this.policy
    ) {
      this.signupForm.markAllAsTouched();
      return;
    }

    if (
      this.signupForm.get("passwords")!.get("password")!.value !==
      this.signupForm.get("passwords")!.get("confirmPassword")!.value
    ) {
      return console.log("Passwords do not match");
    }

    this.authService.upgradeAnonymousUser(
      this.signupForm.get("displayName")!.value,
      this.signupForm.get("email")!.value,
      this.signupForm.get("passwords")!.get("password")!.value,
    );
  }

  backToLogIn() {
    this.landingPageService.signUpActive.set(false);
    this.authService.upgradeMenu.set(!this.authService.upgradeMenu());
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

  ngOnDestroy() {
    this.authService.resetErrorMessages();
  }
}
