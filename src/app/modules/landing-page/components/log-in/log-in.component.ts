import { Component, DestroyRef, inject, signal } from "@angular/core";
import { Auth, getAuth, onAuthStateChanged } from "@angular/fire/auth";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { set } from "firebase/database";
// import { User } from "../../../../core/models/user.model";
import { AuthService } from "../../../../core/services/auth/auth.service";

@Component({
  selector: "app-log-in",
  imports: [FormsModule],
  templateUrl: "./log-in.component.html",
  styleUrl: "./log-in.component.scss",
})
export class LogInComponent {
  private authService = inject(AuthService);
  private user = this.authService.user();
  userId = signal<string>("");

  email: string = this.user?.email || "";
  password: string = this.user?.password || "";
  rememberMe: boolean = false;

  checkRememberMe(): void {
    this.rememberMe = !this.rememberMe;
  }

  onSubmit() {
    if (this.email && this.password) {
      this.authService.logIn(this.email, this.password);
    } else {
      console.log("Not checked");
    }
  }

  guestLogin() {
    this.authService.guestLogIn();
    console.log(this.user);
  }
}
