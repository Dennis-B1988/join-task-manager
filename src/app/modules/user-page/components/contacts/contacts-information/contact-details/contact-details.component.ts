import {
  Component,
  computed,
  HostListener,
  inject,
  OnDestroy,
} from "@angular/core";
import { NavigationStart, Router } from "@angular/router";
import { filter } from "rxjs";
import { ContactsService } from "../../../../services/contacts/contacts.service";

@Component({
  selector: "app-contact-details",
  imports: [],
  templateUrl: "./contact-details.component.html",
  styleUrl: "./contact-details.component.scss",
})
export class ContactDetailsComponent implements OnDestroy {
  private contactsService = inject(ContactsService);
  private router = inject(Router);

  menuOpen: boolean = false;

  showContact = computed(() => this.contactsService.showContact());

  private subscribe = this.router.events
    .pipe(filter((event) => event instanceof NavigationStart))
    .subscribe((event: NavigationStart) => {
      if (!event.url.startsWith("/contacts")) {
        this.contactsService.showContact.set(null);
      }
    });

  /**
   * Toggles the visibility of the contact edit and delete menu.
   *
   * Switches the `menuOpen` state between true and false, controlling whether
   * the menu is open or closed.
   */
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  /**
   * Opens the contact form to edit the contact currently displayed in the
   * contact details component.
   *
   * Sets the `editContact` signal to true, indicating that the application
   * is in the "edit contact" mode, which typically triggers the display
   * of the contact form for editing an existing contact.
   */
  editExistingContact(): void {
    this.contactsService.editContact.set(true);
  }

  /**
   * Deletes the contact displayed in the contact details component and resets
   * the displayed contact to null.
   */
  deleteContact(): void {
    this.contactsService.deleteContact(this.showContact()?.id!);
    this.contactsService.showContact.set(null);
  }

  /**
   * Generates a color in HSL format based on the input name.
   *
   * @param name - The name used to generate a unique color.
   * @returns A string representing the color in HSL format, with a calculated
   * hue derived from the hash of the name, and fixed saturation and lightness
   * values for vibrant and consistent appearance.
   */
  getContactColor(name: string): string {
    return this.contactsService.generateContactColor(name);
  }

  /**
   * Returns the initials of the given contact. The returned string is the
   * first letter of the contact's display name, or the first two letters
   * if the display name is only two characters long.
   *
   * @param name - The full name of the contact for which to generate initials.
   * @returns A string containing the initials of the contact.
   */
  getContactInitials(name: string): string {
    return this.contactsService.getInitials(name);
  }

  /**
   * Cleans up the component when it is destroyed.
   *
   * This method unsubscribes from the router events subscription to prevent memory leaks,
   * sets the `showContact` signal to null to clear the displayed contact, and ensures
   * that the contact edit and delete menu is closed by setting `menuOpen` to false.
   */
  ngOnDestroy(): void {
    this.subscribe.unsubscribe();
    this.contactsService.showContact.set(null);
    this.menuOpen = false;
  }

  /**
   * Closes the edit and delete contact menu if the user clicks outside of the menu.
   * @param event The event object passed from the host listener.
   */
  @HostListener("document:click", ["$event"])
  closeMenu(event: Event): void {
    if (this.menuOpen) {
      const targetElement = event.target as HTMLElement;
      if (!targetElement.closest(".contact-edit-delete-menu")) {
        this.menuOpen = false;
      }
    }
  }
}
