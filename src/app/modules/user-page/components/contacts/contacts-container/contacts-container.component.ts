import { Component, computed, inject, input } from "@angular/core";
import { Contact } from "../../../../../core/models/contact.model";
import { ContactsService } from "../../../services/contacts/contacts.service";

@Component({
  selector: "app-contacts-container",
  imports: [],
  templateUrl: "./contacts-container.component.html",
  styleUrl: "./contacts-container.component.scss",
})
export class ContactsContainerComponent {
  private contactsService = inject(ContactsService);

  showContact = computed(() => this.contactsService.showContact());

  sortedContacts = computed(() =>
    this.contactsService
      .contacts()
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

  // contact: any = {
  //   displayName: "Risette Twinings",
  //   phone: "123-456-7890",
  //   email: "sB4wY@example.com",
  // };

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
    console.log("Active contact:", this.contactsService.showContact());
  }
}
