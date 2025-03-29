import { Component, computed, inject } from "@angular/core";
import { ContactsService } from "../../../services/contacts/contacts.service";
import { AddContactComponent } from "./add-contact/add-contact.component";
import { EditContactComponent } from "./edit-contact/edit-contact.component";

@Component({
  selector: "app-contact-form",
  imports: [AddContactComponent, EditContactComponent],
  templateUrl: "./contact-form.component.html",
  styleUrl: "./contact-form.component.scss",
})
export class ContactFormComponent {
  private contactsService = inject(ContactsService);

  addContact = computed(() => this.contactsService.addContact());
  editContact = computed(() => this.contactsService.editContact());
}
