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

/**
 * Validator function to check if two password fields match.
 *
 * @param controlPassword name of the password field
 * @param controlConfirmPassword name of the confirm password field
 * @returns a validator function that takes an AbstractControl as an argument
 * @description if the values of the two fields do not match, the validator
 * returns an object with a key "passwordMismatch" and value true, otherwise
 * it returns null
 */
function passwordMatchValidator(
  controlPassword: string,
  controlConfirmPassword: string,
): any {
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

  /**
   * Returns the image for the password input based on whether the
   * password is empty, visible, or hidden.
   *
   * @returns The image for the password input.
   */
  get passwordImage(): string {
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

  /**
   * Returns the image for the confirm password input based on whether the
   * confirm password is empty, visible, or hidden.
   *
   * @returns The image for the confirm password input.
   */
  get confirmPasswordImage(): string {
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

  /**
   * Toggles the acceptance state of the privacy policy.
   *
   * @remarks
   * This function is called when the user interacts with the policy checkbox.
   * It inverts the current state of the `policy` boolean, indicating whether
   * the user has accepted the privacy policy.
   */
  checkPolicy(): void {
    this.policy = !this.policy;
  }

  /**
   * Submits the sign-up form and creates a new user with the provided
   * display name, email, and password. If the form is invalid, marks all
   * form controls as touched and does nothing else. If the form is valid,
   * sets the loading state to true, creates the user, and then sets the
   * loading state to false and sets the sign-up active state to false.
   */
  async onSubmit(): Promise<void> {
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

  /**
   * Upgrades an anonymous user to a full user by linking their
   * anonymous account to an email/password account.
   *
   * @remarks
   * This function is called when the user clicks on the "Upgrade"
   * button in the user menu. It checks if the form is valid and if the
   * user has accepted the policy. If the form is invalid or the policy has
   * not been accepted, it marks the form as touched and returns. Otherwise,
   * it calls the AuthService's upgradeAnonymousUser method to perform the
   * upgrade.
   */
  upgradeToFullUser(): void {
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

    this.authService.upgradeAnonymousUser(
      this.signupForm.get("displayName")!.value,
      this.signupForm.get("email")!.value,
      this.signupForm.get("passwords")!.get("password")!.value,
    );
  }

  /**
   * Hides the sign-up form and the upgrade menu by setting the sign-up active signal
   * and the upgrade menu signal to false.
   */
  backToLogIn(): void {
    this.landingPageService.signUpActive.set(false);
    this.authService.upgradeMenu.set(false);
  }

  /**
   * Shows the privacy policy component by setting the privacy policy active signal to true.
   */
  showPolicy(): void {
    this.landingPageService.privacyPolicyActive.set(true);
  }

  /**
   * Toggles the focus state of the password input field.
   * When the field is focused, the eye icon is shown. When the field is not focused, the lock icon is shown.
   */
  toggleFocusPassword(): void {
    this.focusPassword = !this.focusPassword;
  }

  /**
   * Toggles the focus state of the confirm password input field.
   * When the field is focused, the eye icon is shown. When the field is not focused, the lock icon is shown.
   */
  toggleFocusConfirmPassword(): void {
    this.focusConfirmPassword = !this.focusConfirmPassword;
  }

  /**
   * Toggles the visibility of the password input field.
   * When the field is visible, the password is shown as text.
   * When the field is hidden, the password is masked.
   */
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Toggles the visibility of the confirm password input field.
   * When the field is visible, the password is shown as text.
   * When the field is hidden, the password is masked.
   */
  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  /**
   * Resets the error messages in the auth service when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.authService.resetErrorMessages();
  }
}
