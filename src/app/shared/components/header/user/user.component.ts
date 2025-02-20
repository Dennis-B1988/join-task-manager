import { Component, computed, inject } from "@angular/core";
import { AuthService } from "../../../../core/services/auth/auth.service";
import { UserService } from "../../../../core/services/user/user.service";

@Component({
  selector: "app-user",
  imports: [],
  templateUrl: "./user.component.html",
  styleUrl: "./user.component.scss",
})
export class UserComponent {
  authService = inject(AuthService);
  userService = inject(UserService);

  userName = computed(() => {
    const user = this.authService.user();
    if (!user) return "G";

    const displayName = user.displayName ?? "Guest";
    return displayName === "Guest"
      ? "G"
      : displayName?.includes(" ")
        ? displayName
            .split(" ")
            .map((name) => name[0])
            .join("")
            .toUpperCase()
        : displayName?.charAt(0).toUpperCase();
  });

  constructor() {
    console.log("Initial User:", this.authService.user());

    setTimeout(() => {
      console.log("Updated User:", this.authService.user());
    }, 5000);
  }

  signOut() {
    this.authService.signOut();
    this.userService.deleteGuestDocument();
    console.log(this.authService.userId());
  }
}
