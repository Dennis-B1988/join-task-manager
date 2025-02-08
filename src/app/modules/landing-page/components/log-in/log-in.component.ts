import { Component, inject, signal } from "@angular/core";
import { signInWithEmailAndPassword } from "@angular/fire/auth";
import { collectionData } from "@angular/fire/firestore";
import { FormsModule } from "@angular/forms";
import { collection, Firestore } from "firebase/firestore";
import { Observable } from "rxjs";
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
  user = new User();

  email = this.user.email;
  password = this.user.password;

  rememberMe = signal<boolean>(false);

  checkRememberMe(): void {
    this.rememberMe.set(!this.rememberMe());
  }

  onSubmit(): void {
    this.authService.logIn(this.email, this.password);
  }
}
