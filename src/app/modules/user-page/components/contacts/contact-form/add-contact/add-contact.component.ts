import { Component, inject } from "@angular/core";
import { ButtonWithIconComponent } from "../../../../../../shared/components/button-with-icon/button-with-icon.component";
import { ContactsService } from "../../../../services/contacts/contacts.service";

@Component({
  selector: "app-add-contact",
  imports: [ButtonWithIconComponent],
  templateUrl: "./add-contact.component.html",
  styleUrl: "./add-contact.component.scss",
})
export class AddContactComponent {
  private contactsService = inject(ContactsService);

  closeForm() {
    this.contactsService.addContact.set(false);
  }
}
