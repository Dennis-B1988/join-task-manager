import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
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
  isLoading: boolean = false;

  email: string = this.user?.email ?? "";
  password: string = "";
  rememberMe: boolean = false;

  // constructor() {
  //   if (localStorage.getItem("rememberMe")) {
  //     this.rememberMe = true;
  //   }
  //   if (this.rememberMe) {
  //     this.email = this.user?.email ?? "";
  //     this.password = this.user?.password ?? "";
  //   }
  // }

  checkRememberMe(): void {
    this.rememberMe = !this.rememberMe;
    if (this.rememberMe) {
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("rememberMe");
    }
  }

  async onSubmit() {
    if (this.email && this.password) {
      this.isLoading = true;
      try {
        await this.authService.logIn(this.email, this.password);
      } catch (error) {
        console.error("Login failed:", error);
      } finally {
        this.isLoading = false;
      }
    } else {
      console.log("Wrong email or password");
    }
  }

  async guestLogin() {
    this.isLoading = true;
    try {
      await this.authService.guestLogIn();
    } catch (error) {
      console.error("Guest login failed:", error);
    } finally {
      this.isLoading = false;
    }
  }
}
