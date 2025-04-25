import { Component, computed, inject } from "@angular/core";
import { Contact } from "../../../../../core/models/contact.model";
import { CustomUser } from "../../../../../core/models/user.model";
import { AuthService } from "../../../../../core/services/auth/auth.service";
import { ContactsService } from "../../../services/contacts/contacts.service";

@Component({
  selector: "app-contacts-container",
  imports: [],
  templateUrl: "./contacts-container.component.html",
  styleUrl: "./contacts-container.component.scss",
})
export class ContactsContainerComponent {
  private authService = inject(AuthService);
  private contactsService = inject(ContactsService);

  user = computed<CustomUser | null>(() => this.authService.user());

  showContact = computed(() => this.contactsService.showContact());

  sortedContacts = computed(() =>
    this.contactsService
      .contacts()
      .filter((contact) => contact.email !== this.user()?.email)
      .sort((a: any, b: any) => a.displayName.localeCompare(b.displayName)),
  );

  groupedContacts = computed(() => {
    const groups: { [key: string]: Contact[] } = {};
    for (const contact of this.sortedContacts()) {
      const firstLetter = contact.displayName[0].toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(contact);
    }
    return groups;
  });

  /**
   * Returns an array of first letters of the contact groups.
   *
   * @returns An array of strings, each containing a letter that is the
   * first letter of a contact group. The letters are in the same order
   * that the groups appear in the groupedContacts() signal.
   */
  getGroupedLetters(): string[] {
    return Object.keys(this.groupedContacts());
  }

  /**
   * Opens the contact form to add a new contact.
   *
   * Sets the `addContact` signal to true, indicating that the application
   * is in the "add contact" mode, which typically triggers the display
   * of the contact form for adding a new contact.
   */
  addContact(): void {
    this.contactsService.addContact.set(true);
  }

  /**
   * Generates a color in HSL format based on the input contact name.
   *
   * @param contact - The full name of the contact for which to generate a color.
   * @returns A string representing the color in HSL format, with a calculated hue
   *          derived from the hash of the contact name, and fixed saturation and
   *          lightness values for vibrant and consistent appearance.
   */
  getContactColor(contact: string): string {
    return this.contactsService.generateContactColor(contact);
  }

  /**
   * Returns the initials of the given contact. The initials are derived from
   * the contact's display name. If the name is a single word, it returns the
   * first letter in uppercase. If the name consists of multiple words, it returns
   * the first letter of the first two words in uppercase.
   *
   * @param contact - The full name of the contact for which to generate initials.
   * @returns A string containing the initials of the contact.
   */
  getContactInitials(contact: string): string {
    return this.contactsService.getInitials(contact);
  }

  /**
   * Sets the specified contact as the currently viewed contact.
   *
   * @param contact - The contact object to be viewed, which contains
   *                  details such as displayName and email.
   */
  lookAtContactInformation(contact: any): void {
    this.contactsService.showContact.set(contact);
  }
}
