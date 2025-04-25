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

  /**
   * Toggles the user menu open or closed.
   */
  toggleUserMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  /**
   * Sets the upgradeMenu observable to true, which will show the upgrade
   * menu. This is used when the user clicks on the upgrade button in the
   * user menu.
   */
  showUpgradeMenu(): void {
    this.authService.upgradeMenu.set(true);
  }

  /**
   * Signs out the user and deletes their guest user data.
   *
   * This method will delete the user's document and all associated tasks and
   * contacts. It will then call the `signOut` method of the AuthService to
   * sign out the user and unsubscribe all subscriptions using the
   * UnsubscribeService. Finally, it will toggle the user menu to be closed.
   *
   * @returns A Promise that resolves when the sign-out is complete.
   */
  async signOut(): Promise<void> {
    await this.userService.deleteGuestUserAndData();
    this.authService.signOut();
    this.UnsubscribeService.unsubscribeAll();
    this.toggleUserMenu();
  }

  /**
   * Closes the user menu if it is open and the target element is outside the
   * user menu.
   *
   * @param event The event object from the `document:click` host listener.
   */
  @HostListener("document:click", ["$event"])
  closeUserMenu(event: Event): void {
    if (this.menuOpen) {
      const targetElement = event.target as HTMLElement;
      if (!targetElement.closest(".user")) {
        this.menuOpen = false;
      }
    }
  }
}
