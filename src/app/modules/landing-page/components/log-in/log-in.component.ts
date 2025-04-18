import {
  Component,
  computed,
  EnvironmentInjector,
  inject,
  input,
  runInInjectionContext,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  getAuth,
  setPersistence,
} from "firebase/auth";
import { AuthService } from "../../../../core/services/auth/auth.service";

@Component({
  selector: "app-log-in",
  imports: [ReactiveFormsModule],
  templateUrl: "./log-in.component.html",
  styleUrl: "./log-in.component.scss",
})
export class LogInComponent {
  private authService = inject(AuthService);
  private injector = inject(EnvironmentInjector);

  userId = input<string>();
  isLoading: boolean = false;
  rememberMe: boolean = false;
  focusPassword: boolean = false;
  showPassword: boolean = false;

  wrongEmail = computed(() => this.authService.wrongEmail());
  wrongPassword = computed(() => this.authService.wrongPassword());

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

  get passwordImage() {
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

  onSubmit() {
    if (this.loginForm.get("email") && this.loginForm.get("password")) {
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
    } else {
      console.log("Wrong email or password");
    }
  }

  saveUserLocally() {
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

  dontSaveUser() {
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

  async guestLogin() {
    this.isLoading = true;
    try {
      // await this.authService.guestLogIn();
      this.authService.signInAsGuest();
    } catch (error) {
      console.error("Guest login failed:", error);
    } finally {
      this.isLoading = false;
    }
  }

  toggleRememberMe() {
    this.rememberMe = !this.rememberMe;
  }

  toggleFocusPassword() {
    this.focusPassword = !this.focusPassword;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
