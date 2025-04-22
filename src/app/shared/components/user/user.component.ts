import { Component, computed, HostListener, inject } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from "../../../core/services/auth/auth.service";
import { UnsubscribeService } from "../../../core/services/unsubscribe/unsubscribe.service";
import { UserService } from "../../../core/services/user/user.service";

@Component({
  selector: "app-user",
  imports: [RouterLink, RouterLinkActive],
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

  toggleUserMenu() {
    this.menuOpen = !this.menuOpen;
  }

  showUpgradeMenu() {
    this.authService.upgradeMenu.set(true);
  }

  async signOut() {
    await this.userService.deleteGuestUserAndData();
    this.authService.signOut();
    this.UnsubscribeService.unsubscribeAll();
    this.toggleUserMenu();
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
