import { Component, inject } from "@angular/core";
import { Auth } from "@angular/fire/auth";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth/auth.service";
import { LogInComponent } from "../../../modules/landing-page/components/log-in/log-in.component";
import { UserComponent } from "../../../modules/user-page/user/user.component";

@Component({
  selector: "app-header",
  imports: [UserComponent, RouterLink],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
})
export class HeaderComponent {
  authService = inject(AuthService);
  userId = this.authService.uid;
}
