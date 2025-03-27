import { Component, inject } from "@angular/core";
import { ContactsService } from "../../../services/contacts/contacts.service";

@Component({
  selector: "app-contacts-container",
  imports: [],
  templateUrl: "./contacts-container.component.html",
  styleUrl: "./contacts-container.component.scss",
})
export class ContactsContainerComponent {
  private contactsService = inject(ContactsService);

  contact: any = {
    displayName: "Risette Twinings",
    phone: "123-456-7890",
    email: "sB4wY@example.com",
  };

  addContact() {
    this.contactsService.createContact(this.contact);
  }
}
