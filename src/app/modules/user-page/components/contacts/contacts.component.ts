import { Component, computed, inject, OnDestroy } from "@angular/core";
import { ContactsService } from "../../services/contacts/contacts.service";
import { ContactFormContainerComponent } from "./contact-form-container/contact-form-container.component";
import { ContactsContainerComponent } from "./contacts-container/contacts-container.component";
import { ContactsInformationComponent } from "./contacts-information/contacts-information.component";

@Component({
  selector: "app-contacts",
  imports: [
    ContactsContainerComponent,
    ContactsInformationComponent,
    ContactFormContainerComponent,
  ],
  templateUrl: "./contacts.component.html",
  styleUrl: "./contacts.component.scss",
})
export class ContactsComponent implements OnDestroy {
  private contactsService = inject(ContactsService);
  windowWidth = computed(() => window.innerWidth);

  addContact = computed(() => this.contactsService.addContact());
  editContact = computed(() => this.contactsService.editContact());
  showContact = computed(() => this.contactsService.showContact());

  contactCreatedOrUpdated = computed(() =>
    this.contactsService.contactCreatedOrUpdated(),
  );

  /**
   * Clean up component state when component is destroyed.
   *
   * When the component is destroyed, reset the state of the contact service
   * to prevent accidental contact creation or editing.
   */
  ngOnDestroy(): void {
    this.contactsService.addContact.set(false);
    this.contactsService.editContact.set(false);
    this.contactsService.showContact.set(null);
  }
}
