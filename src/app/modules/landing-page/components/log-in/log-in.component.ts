import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../../../core/services/auth/auth.service";

@Component({
  selector: "app-log-in",
  imports: [FormsModule],
  templateUrl: "./log-in.component.html",
  styleUrl: "./log-in.component.scss",
})
export class LogInComponent {
  authService = inject(AuthService);

  email = signal<string>("");
  password = signal<string>("");

  onSubmit(): void {
    // this.authService.logIn(this.email(), this.password());
  }
}
