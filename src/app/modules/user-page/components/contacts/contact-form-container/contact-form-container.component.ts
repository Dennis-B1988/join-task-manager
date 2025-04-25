import { Component, computed, inject } from "@angular/core";
import { ContactsService } from "../../../services/contacts/contacts.service";
import { ContactFormComponent } from "./contact-form/contact-form.component";

export interface ContactFormTexts {
  name: string;
  email: string;
  phone: string;
  clearButton: string;
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
    phone: "+49",
    clearButton: "Clear",
    saveButton: "Add contact",
  };

  editExistingContact = {
    name: this.showContact()?.displayName || "",
    email: this.showContact()?.email || "",
    phone: this.showContact()?.phone || "",
    clearButton: "Delete",
    saveButton: "Save",
  };

  /**
   * Closes the contact form and resets the "addContact" and "editContact"
   * observables to false.
   */
  closeForm(): void {
    this.contactsService.addContact.set(false);
    this.contactsService.editContact.set(false);
  }

  /**
   * Returns the initials of the given contact. The returned string is the
   * first letter of the contact's display name, or the first two letters
   * if the display name is only two characters long.
   *
   * @param name - The full name of the contact for which to generate initials.
   * @returns A string containing the initials of the contact.
   */
  getContactInitials(name: string): string {
    return this.contactsService.getInitials(name);
  }

  /**
   * Returns the color associated with the given contact. The color is
   * generated from the contact's display name and is used to style the
   * contact's initials in the assigned to dropdown.
   *
   * @param name the contact for which to generate the color
   * @returns a string containing the contact's color in HSL format
   */
  getContactColor(name: string): string {
    return this.contactsService.generateContactColor(name);
  }
}
