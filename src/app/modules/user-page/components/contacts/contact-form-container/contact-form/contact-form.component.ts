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

  cancelDeleteContact() {
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

  ngOnDestroy(): void {
    this.hasInitialized = false;
    this.contactsService.addContact.set(false);
    this.contactsService.editContact.set(false);
    this.contactsService.showContact.set(null);
  }

  @HostListener("document:click", ["$event"])
  closeMenu(event: Event) {
    if (this.editContact() || this.addContact()) {
      const targetElement = event.target as HTMLElement;
      if (!targetElement.closest(".form-content")) {
        this.contactsService.addContact.set(false);
        this.contactsService.editContact.set(false);
      }
    }
  }
}
