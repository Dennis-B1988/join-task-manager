import {
  Component,
  computed,
  EnvironmentInjector,
  inject,
  OnDestroy,
  runInInjectionContext,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  getAuth,
  setPersistence,
} from "firebase/auth";
import { AuthService } from "../../../../core/services/auth/auth.service";

@Component({
  selector: "app-log-in",
  imports: [ReactiveFormsModule, MatProgressSpinnerModule],
  templateUrl: "./log-in.component.html",
  styleUrl: "./log-in.component.scss",
})
export class LogInComponent implements OnDestroy {
  private authService = inject(AuthService);
  private injector = inject(EnvironmentInjector);

  rememberMe: boolean = false;
  focusPassword: boolean = false;
  showPassword: boolean = false;

  isLoading: boolean = false;

  wrongEmail = computed(() => this.authService.wrongEmail());
  wrongPassword = computed(() => this.authService.wrongPassword());

  loadingUser = computed(() => this.authService.loadingUser());

  loginForm = new FormGroup({
    email: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  /**
   * Returns the image for the password input based on whether the password is
   * empty, visible, or hidden.
   *
   * @returns The image for the password input.
   */
  get passwordImage(): string {
    if (this.loginForm.get("password")?.value === "") {
      return "assets/img/lock.png";
    } else if (
      this.loginForm.get("password")?.value !== "" &&
      this.showPassword
    ) {
      return "assets/img/visible.png";
    } else {
      return "assets/img/visible_off.png";
    }
  }

  /**
   * Submits the login form and logs in to the account with the email and
   * password provided. If `rememberMe` is true, the user will be remembered
   * and logged in automatically on subsequent visits.
   */
  onSubmit(): void {
    if (this.loginForm.get("email") && this.loginForm.get("password")) {
      if (this.isLoading) return;
      this.isLoading = true;

      try {
        if (this.rememberMe) {
          this.saveUserLocally();
        } else {
          this.dontSaveUser();
        }
      } catch (error: any) {
        console.error("Login failed:", error);
      } finally {
        this.isLoading = false;
      }
    }
  }

  /**
   * Sets the auth persistence to browserLocalPersistence and logs in to the
   * account with the provided email and password. This is used when the user
   * wants to save their login information to the browser.
   */
  private saveUserLocally(): void {
    runInInjectionContext(this.injector, async () => {
      const auth = getAuth();
      setPersistence(auth, browserLocalPersistence).then(async () => {
        await this.authService.logIn(
          this.loginForm.get("email")!.value,
          this.loginForm.get("password")!.value,
        );
      });
    });
  }

  /**
   * Sets the auth persistence to browserSessionPersistence and logs in to the
   * account with the provided email and password. This is used when the user
   * does not want to save their login information to the browser.
   */
  private dontSaveUser(): void {
    runInInjectionContext(this.injector, async () => {
      const auth = getAuth();
      setPersistence(auth, browserSessionPersistence).then(async () => {
        await this.authService.logIn(
          this.loginForm.get("email")!.value,
          this.loginForm.get("password")!.value,
        );
      });
    });
  }

  /**
   * Logs in as a guest user. This will create a new user document with the name
   * "Guest" and create dummy contacts and tasks for the user.
   *
   * @returns A promise that resolves when the sign-in is complete.
   */
  async guestLogin(): Promise<void> {
    if (this.isLoading) return;
    this.isLoading = true;

    try {
      await this.authService.signInAsGuest();
    } catch (error) {
      console.error("Guest login failed:", error);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Toggles the remember me checkbox. When the checkbox is checked, the user
   * will be logged in with browserLocalPersistence, which will save their login
   * information to the browser. When the checkbox is unchecked, the user will be
   * logged in with browserSessionPersistence, which will not save their login
   * information to the browser.
   */
  toggleRememberMe(): void {
    this.rememberMe = !this.rememberMe;
  }

  /**
   * Toggles the focus password variable. This variable is used to determine
   * which image to show for the password input. When the password input is
   * focused, the eye icon is shown. When the password input is not focused, the
   * lock icon is shown.
   */
  toggleFocusPassword(): void {
    this.focusPassword = !this.focusPassword;
  }

  /**
   * Toggles the show password variable. This variable is used to determine
   * which type of input to show for the password input. When the variable is
   * true, the password input is a text input and the password is visible.
   * When the variable is false, the password input is a password input and
   * the password is hidden.
   */
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Resets error messages when the component is destroyed.
   *
   * This method calls the resetErrorMessages function of the AuthService
   * to clear any error messages that may have been set during the component's
   * lifecycle.
   */
  ngOnDestroy(): void {
    this.authService.resetErrorMessages();
  }
}
