import { Component, inject } from "@angular/core";
import { AuthService } from "../../../core/services/auth/auth.service";

@Component({
  selector: "app-user",
  imports: [],
  templateUrl: "./user.component.html",
  styleUrl: "./user.component.scss",
})
export class UserComponent {
  authService = inject(AuthService);

  signOut() {
    this.authService.signOut();
    console.log(this.authService.userId());
  }
}
