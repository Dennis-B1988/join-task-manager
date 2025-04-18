import { Component, computed, Host, HostListener, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../../../core/services/auth/auth.service";
import { UnsubscribeService } from "../../../../core/services/unsubscribe/unsubscribe.service";
import { UserService } from "../../../../core/services/user/user.service";

@Component({
  selector: "app-user",
  imports: [RouterLink],
  templateUrl: "./user.component.html",
  styleUrl: "./user.component.scss",
})
export class UserComponent {
  authService = inject(AuthService);
  userService = inject(UserService);
  UnsubscribeService = inject(UnsubscribeService);

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

  toggleUpgradeMenu() {
    this.authService.upgradeMenu.set(!this.authService.upgradeMenu());
  }

  signOut() {
    this.authService.signOut();
    this.userService.deleteGuestDocument();
    this.UnsubscribeService.unsubscribeAll();
    this.toggleUserMenu();
    console.log(this.authService.userId());
  }

  @HostListener("document:click", ["$event"])
  closeUserMenu(event: Event) {
    if (this.menuOpen) {
      const targetElement = event.target as HTMLElement;
      if (!targetElement.closest(".user")) {
        this.menuOpen = false;
      }
    }
  }
}
