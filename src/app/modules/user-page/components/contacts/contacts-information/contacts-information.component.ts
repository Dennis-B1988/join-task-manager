import { Component, computed, inject, input } from "@angular/core";
import { ContactsService } from "../../../services/contacts/contacts.service";
import { ContactDetailsComponent } from "./contact-details/contact-details.component";

@Component({
  selector: "app-contacts-information",
  imports: [ContactDetailsComponent],
  templateUrl: "./contacts-information.component.html",
  styleUrl: "./contacts-information.component.scss",
})
export class ContactsInformationComponent {
  private contactsService = inject(ContactsService);

  showContact = computed(() => this.contactsService.showContact());

  /**
   * Closes the contact information panel by setting the `showContact` signal to null.
   */
  closeContact(): void {
    this.contactsService.showContact.set(null);
  }
}
