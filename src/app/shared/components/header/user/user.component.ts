import { Component, computed, inject } from "@angular/core";
import { AuthService } from "../../../../core/services/auth/auth.service";
import { UnsubscripeService } from "../../../../core/services/unsubscripe/unsubscripe.service";
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
  unsubscripeService = inject(UnsubscripeService);

  menuOpen: boolean = false;

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
  }

  toggleUserMenu() {
    this.menuOpen = !this.menuOpen;
  }

  signOut() {
    this.authService.signOut();
    this.userService.deleteGuestDocument();
    this.unsubscripeService.unsubscripeAll();
    this.toggleUserMenu();
    console.log(this.authService.userId());
  }
}
