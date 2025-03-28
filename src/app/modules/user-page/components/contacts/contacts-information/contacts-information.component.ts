import { Component, computed, inject } from "@angular/core";
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

  activeContact = computed(() => this.contactsService.activeContact());
}
