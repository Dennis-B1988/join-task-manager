import { Component, DestroyRef, inject, signal } from "@angular/core";
import { Auth, getAuth, onAuthStateChanged } from "@angular/fire/auth";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { User } from "../../../../core/models/user.model";
import { AuthService } from "../../../../core/services/auth/auth.service";

@Component({
  selector: "app-log-in",
  imports: [FormsModule],
  templateUrl: "./log-in.component.html",
  styleUrl: "./log-in.component.scss",
})
export class LogInComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private user = new User();
  private destroyRef = inject(DestroyRef);
  userId = signal<string>("");

  email: string = this.user.email;
  password: string = this.user.password;
  rememberMe: boolean = false;

  constructor(private auth: Auth) {
    const subscribe = this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.userId.set(user.uid);
        this.router.navigate(["/user", user.uid, "summary"]);
      }
    });

    this.destroyRef.onDestroy(() => {
      subscribe();
    });
  }

  checkRememberMe(): void {
    this.rememberMe = !this.rememberMe;
  }

  async onSubmit() {
    if (this.rememberMe && this.email && this.password) {
      this.authService.logIn(this.email, this.password);
      // const uid = (await this.authService.logIn(
      //   this.email,
      //   this.password,
      // )) as string;

      // if (uid) {
      //   this.userId.set(uid);
      //   this.router.navigate(["/user", uid, "summary"]);
      // } else {
      //   console.error("Login failed, UID is empty.");
      // }
    } else {
      console.log("Not checked");
    }
  }

  guestLogin() {
    this.authService.guestLogIn();
  }
}
