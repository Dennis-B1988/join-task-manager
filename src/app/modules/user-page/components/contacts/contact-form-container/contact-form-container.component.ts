import { Component, computed, inject } from "@angular/core";
import { ContactsService } from "../../../services/contacts/contacts.service";
import { ContactFormComponent } from "./contact-form/contact-form.component";

export interface ContactFormTexts {
  name: string;
  email: string;
  phone: string;
  cancelButton: string;
  saveButton: string;
}

@Component({
  selector: "app-contact-form-container",
  imports: [ContactFormComponent],
  templateUrl: "./contact-form-container.component.html",
  styleUrl: "./contact-form-container.component.scss",
})
export class ContactFormContainerComponent {
  private contactsService = inject(ContactsService);

  showContact = computed(() => this.contactsService.showContact());
  addContact = computed(() => this.contactsService.addContact());
  editContact = computed(() => this.contactsService.editContact());

  addNewContact = {
    name: "",
    email: "",
    phone: "",
    cancelButton: "Cancel",
    saveButton: "Create contact",
  };

  editExistingContact = {
    name: this.showContact()?.displayName || "",
    email: this.showContact()?.email || "",
    phone: this.showContact()?.phone || "",
    cancelButton: "Delete",
    saveButton: "Save",
  };

  getContactInitials(name: string): string {
    return this.contactsService.getInitials(name);
  }

  getContactColor(name: string): string {
    return this.contactsService.generateContactColor(name);
  }
}
