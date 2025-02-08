import { Component, inject, signal } from "@angular/core";
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
  authService = inject(AuthService);
  router = inject(Router);
  user = new User();
  userId = signal<string>("");

  email = this.user.email;
  password = this.user.password;
  rememberMe = signal<boolean>(false);

  checkRememberMe(): void {
    this.rememberMe.set(!this.rememberMe());
  }

  async onSubmit() {
    if (this.rememberMe() && this.email && this.password) {
      const uid = (await this.authService.logIn(
        this.email,
        this.password,
      )) as string;

      if (uid) {
        this.userId.set(uid);
        console.log("Navigating to:", `/user/${this.userId()}/summary`);
        this.router.navigate(["/user", uid, "summary"]);
      } else {
        console.error("Login failed, UID is empty.");
      }
    } else {
      console.log("Not checked");
    }
  }

  async guestLogin() {
    console.log(this.authService.uid()); // for testing if logout works
  }
}
