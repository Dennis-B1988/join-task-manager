import { Component, DestroyRef, inject, signal } from "@angular/core";
import { Auth, getAuth, onAuthStateChanged } from "@angular/fire/auth";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { set } from "firebase/database";
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
  private user = this.authService.user();
  // private destroyRef = inject(DestroyRef);
  userId = signal<string>("");

  email: string = this.user?.email || "";
  password: string = this.user?.password || "";
  rememberMe: boolean = false;

  // constructor(private auth: Auth) {
  //   const subscribe = this.auth.onAuthStateChanged((user) => {
  //     if (user) {
  //       this.userId.set(user.uid);
  //       this.router.navigate(["/user", user.uid, "summary"]);
  //       console.log("User logged in:", user.displayName);
  //       console.log("User Mail:", user.email);
  //     }
  //   });

  //   this.destroyRef.onDestroy(() => subscribe());
  // }

  checkRememberMe(): void {
    this.rememberMe = !this.rememberMe;
  }

  onSubmit() {
    this.authService.logIn(this.email, this.password);
    // if (this.rememberMe && this.email && this.password) {
    //   this.authService.logIn(this.email, this.password);
    // } else {
    //   console.log("Not checked");
    // }
  }

  guestLogin() {
    this.authService.guestLogIn();
  }
}
