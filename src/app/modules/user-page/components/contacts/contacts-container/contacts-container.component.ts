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

  getGroupedLetters(): string[] {
    return Object.keys(this.groupedContacts());
  }

  addContact() {
    this.contactsService.addContact.set(true);
  }

  getContactColor(contact: string) {
    return this.contactsService.generateContactColor(contact);
  }

  getContactInitials(contact: string) {
    return this.contactsService.getInitials(contact);
  }

  lookAtContactInformation(contact: any) {
    this.contactsService.showContact.set(contact);
  }
}
