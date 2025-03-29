import { Component, computed, inject } from "@angular/core";
import { ContactsService } from "../../services/contacts/contacts.service";
import { ContactFormComponent } from "./contact-form/contact-form.component";
import { ContactsContainerComponent } from "./contacts-container/contacts-container.component";
import { ContactsInformationComponent } from "./contacts-information/contacts-information.component";

@Component({
  selector: "app-contacts",
  imports: [
    ContactsContainerComponent,
    ContactsInformationComponent,
    ContactFormComponent,
  ],
  templateUrl: "./contacts.component.html",
  styleUrl: "./contacts.component.scss",
})
export class ContactsComponent {
  private contactsService = inject(ContactsService);

  addContact = computed(() => this.contactsService.addContact());
  editContact = computed(() => this.contactsService.editContact());
}
