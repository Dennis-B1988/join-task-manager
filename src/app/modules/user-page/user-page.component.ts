import { Component, computed, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AuthService } from "../../core/services/auth/auth.service";
import { SharedModule } from "../../shared/shared.module";
import { SignUpComponent } from "../landing-page/components/sign-up/sign-up.component";

@Component({
  selector: "app-user-page",
  imports: [RouterOutlet, SharedModule, SignUpComponent],
  templateUrl: "./user-page.component.html",
  styleUrl: "./user-page.component.scss",
})
export class UserPageComponent {
  private authService = inject(AuthService);

  upgradeMenu = computed(() => this.authService.upgradeMenu());
}
