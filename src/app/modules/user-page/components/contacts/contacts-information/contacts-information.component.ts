import { Component, inject } from "@angular/core";
import { ContactsService } from "../../../services/contacts/contacts.service";

@Component({
  selector: "app-contacts-information",
  imports: [],
  templateUrl: "./contacts-information.component.html",
  styleUrl: "./contacts-information.component.scss",
})
export class ContactsInformationComponent {
  private contactsService = inject(ContactsService);

  getContactColor(name: string): string {
    return this.contactsService.generateContactColor(name);
  }

  getContactInitials(name: string): string {
    return this.contactsService.getInitials(name);
  }
}
