import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ButtonWithIconComponent } from "../../../../../../shared/components/button-with-icon/button-with-icon.component";
import { ContactsService } from "../../../../services/contacts/contacts.service";
import { ContactFormTexts } from "../contact-form-container.component";

@Component({
  selector: "app-contact-form",
  imports: [ButtonWithIconComponent, ReactiveFormsModule],
  templateUrl: "./contact-form.component.html",
  styleUrl: "./contact-form.component.scss",
})
export class ContactFormComponent {
  private contactsService = inject(ContactsService);
  contact = input.required<ContactFormTexts>();
  clearButtonHover: boolean = false;

  showContact = computed(() => this.contactsService.showContact());

  contactForm = new FormGroup({
    name: new FormControl<string>("", {
      validators: [Validators.required],
    }),
    email: new FormControl<string>("", {
      validators: [Validators.required, Validators.email],
    }),
    phone: new FormControl<string>("", {
      validators: [Validators.required],
    }),
  });

  constructor() {
    effect(() => {
      if (this.contactsService.addContact()) {
        this.contactForm.patchValue({
          phone: "+49",
        });
      }

      if (!this.contactsService.showContact()) return;

      const currentContact = this.showContact();

      if (this.contactsService.editContact()) {
        this.contactForm.patchValue({
          name: currentContact?.displayName,
          email: currentContact?.email,
          phone: currentContact?.phone,
        });
      }
    });
  }

  onSubmit() {
    if (!this.contactForm.valid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const contact = {
      id: this.showContact()?.id,
      displayName: this.contactForm.value.name!,
      email: this.contactForm.value.email!,
      phone: this.contactForm.value.phone!,
    };

    if (this.contactsService.addContact()) {
      this.contactsService.createContact(contact);
      this.contactsService.addContact.set(false);
    } else if (this.contactsService.editContact()) {
      this.contactsService.updateContact(contact);
      this.contactsService.showContact.set(contact);
      this.contactsService.editContact.set(false);
    }
    this.contactForm.reset();
  }

  closeForm() {
    this.contactsService.addContact.set(false);
    this.contactsService.editContact.set(false);
  }

  openDeleteModal() {
    this.contactsService.showDeleteContact.set(true);
  }

  closeDeleteModal() {
    this.contactsService.showDeleteContact.set(false);
  }
}
