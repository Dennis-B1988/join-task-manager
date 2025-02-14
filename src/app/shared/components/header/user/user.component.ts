import { Component, computed, inject } from "@angular/core";
import { AuthService } from "../../../../core/services/auth/auth.service";

@Component({
  selector: "app-user",
  imports: [],
  templateUrl: "./user.component.html",
  styleUrl: "./user.component.scss",
})
export class UserComponent {
  authService = inject(AuthService);

  userName = computed(() => {
    const displayName = this.authService.user()?.displayName ?? "Guest";
    return displayName === "Guest"
      ? "G"
      : displayName?.includes(" ")
        ? displayName
            .split(" ")
            .map((name) => name[0])
            .join("")
            .toUpperCase()
        : displayName?.slice(0, 1);
  });

  signOut() {
    this.authService.signOut();
    console.log(this.authService.userId());
  }
}
