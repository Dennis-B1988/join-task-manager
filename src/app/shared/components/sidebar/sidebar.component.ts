import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth/auth.service";

@Component({
  selector: "app-sidebar",
  imports: [RouterLink],
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.scss",
})
export class SidebarComponent {
  authService = inject(AuthService);
  userId = this.authService.uid;
}
