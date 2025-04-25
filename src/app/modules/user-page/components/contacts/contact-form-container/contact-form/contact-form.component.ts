import {
  Component,
  computed,
  effect,
  HostListener,
  inject,
  input,
  OnDestroy,
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
export class ContactFormComponent implements OnDestroy {
  private contactsService = inject(ContactsService);
  contact = input.required<ContactFormTexts>();
  clearButtonHover: boolean = false;
  hasInitialized: boolean = false;

  showContact = computed(() => this.contactsService.showContact());
  addContact = computed(() => this.contactsService.addContact());
  editContact = computed(() => this.contactsService.editContact());
  contactCreatedOrUpdated = computed(() =>
    this.contactsService.contactCreatedOrUpdated(),
  );

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

  /**
   * Initializes the contact form component.
   *
   * If the component is in add mode and has not been initialized before, resets
   * the form with default values. If the component is in edit mode and the
   * contact is provided, patches the form with the contact's values.
   *
   * The initialization is done once and only when the component is in add mode
   * and has not been initialized before, or when the component is in edit mode
   * and the contact is provided. If the component is in add mode and has been
   * initialized before, the form is not reset. If the component is in edit mode
   * and the contact is not provided, the form is not patched.
   */
  constructor() {
    effect(() => {
      if (this.contactsService.addContact() && !this.hasInitialized) {
        this.contactForm.reset({
          name: "",
          email: "",
          phone: "+49",
        });
        this.hasInitialized = true;
      }

      if (!this.contactsService.addContact()) {
        this.hasInitialized = false;
      }

      if (this.contactsService.editContact() && this.showContact()) {
        const contact = this.showContact();
        this.contactForm.patchValue({
          name: contact?.displayName ?? "",
          email: contact?.email ?? "",
          phone: contact?.phone ?? "",
        });
      }
    });
  }

  /**
   * Submits the contact form and creates or updates a contact based on whether
   * the contact form is in add or edit mode. If the form is not valid, marks all
   * form controls as touched. If the form is valid, creates or updates a contact
   * using the provided form values and resets the form. If the contact was
   * created or updated successfully, sets the contact created or updated flag
   * to "Created" or "Updated", respectively, and resets the flag after 800ms.
   */
  onSubmit(): void {
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
      this.contactsService.contactCreatedOrUpdated.set("Created");
    } else if (this.contactsService.editContact()) {
      this.contactsService.updateContact(contact);
      this.contactsService.showContact.set(contact);
      this.contactsService.editContact.set(false);
      this.contactsService.contactCreatedOrUpdated.set("Updated");
    }
    this.contactForm.reset();

    setTimeout(() => {
      this.contactsService.contactCreatedOrUpdated.set("");
    }, 800);
  }

  /**
   * Cancels the delete contact operation or resets the contact form if add contact mode is enabled.
   *
   * If the edit contact mode is enabled, this method deletes the currently selected contact and
   * resets the edit contact mode to false. If the add contact mode is enabled, this method resets
   * the contact form to its initial state with the name, email, and phone fields cleared and the
   * phone field set to "+49".
   */
  cancelDeleteContact(): void {
    if (this.contactsService.editContact()) {
      this.contactsService.deleteContact(this.showContact()?.id!);
      this.contactsService.editContact.set(false);
      this.contactsService.showContact.set(null);
    } else if (this.contactsService.addContact()) {
      this.contactForm.reset({
        name: "",
        email: "",
        phone: "+49",
      });
    }
  }

  /**
   * Cleans up the component by resetting the initialization state and contact-related observables.
   *
   * This method is called when the component is destroyed. It ensures that the `hasInitialized`
   * flag is set to false and resets the `addContact`, `editContact`, and `showContact` observables
   * in the `ContactsService` to prevent any residual states that might affect future interactions
   * with the contact form.
   */
  ngOnDestroy(): void {
    this.hasInitialized = false;
    this.contactsService.addContact.set(false);
    this.contactsService.editContact.set(false);
    this.contactsService.showContact.set(null);
  }

  /**
   * Closes the edit or add contact form when the user clicks outside of the form
   * @param event The event object of the click event
   */
  @HostListener("document:click", ["$event"])
  closeMenu(event: Event): void {
    if (this.editContact() || this.addContact()) {
      const targetElement = event.target as HTMLElement;
      if (!targetElement.closest(".form-content")) {
        this.contactsService.addContact.set(false);
        this.contactsService.editContact.set(false);
      }
    }
  }
}
