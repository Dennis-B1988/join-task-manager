import {
  Component,
  computed,
  effect,
  HostListener,
  inject,
  input,
  signal,
} from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CustomUser } from "../../../../../../../core/models/user.model";
import { AuthService } from "../../../../../../../core/services/auth/auth.service";
import { ContactsService } from "../../../../../services/contacts/contacts.service";

@Component({
  selector: "app-task-assigned-to",
  imports: [ReactiveFormsModule],
  templateUrl: "./task-assigned-to.component.html",
  styleUrl: "./task-assigned-to.component.scss",
})
export class TaskAssignedToComponent {
  private authService = inject(AuthService);
  private contactsService = inject(ContactsService);
  taskForm = input.required<FormGroup>();
  assignedToOpen: boolean = false;
  contacts = signal<any[]>([]);
  searchContact = signal<string>("");

  user = computed<CustomUser | null>(() => this.authService.user());

  filteredContacts = computed(() => {
    const searchTerm = this.searchContact().toLowerCase();
    const currentUser = this.user();
    if (!currentUser || !currentUser.displayName)
      return this.contactsService.contacts();

    return searchTerm.length >= 3
      ? this.contacts().filter((contact) =>
          contact.displayName.toLowerCase().includes(searchTerm),
        )
      : this.contactsService.contacts().sort((a: any, b: any) => {
          if (a.displayName === currentUser.displayName) return -1;
          if (b.displayName === currentUser.displayName) return 1;
          return a.displayName.localeCompare(b.displayName);
        });
  });

  assignedToTask = computed(() => {
    const currentUser = this.user();
    if (!currentUser || !currentUser.displayName)
      return this.contactsService.assignedToTask();

    return this.contactsService.assignedToTask().sort((a: any, b: any) => {
      if (a.displayName === currentUser.displayName) return -1;
      if (b.displayName === currentUser.displayName) return 1;
      return a.displayName.localeCompare(b.displayName);
    });
  });

  constructor() {
    effect(() => {
      const fetchedContacts = this.contactsService
        .contacts()
        .filter((contact) => ({
          displayName: contact.displayName,
          // color: contact.color,
        }));

      this.contacts.set(fetchedContacts);
    });
    setTimeout(() => {
      console.log("Contacts to task:", this.contacts);
    }, 2000);
  }

  toggleAssignedTo() {
    this.assignedToOpen = !this.assignedToOpen;
  }

  searchContacts(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value.trim();
    this.searchContact.set(searchValue.length >= 3 ? searchValue : "");
    console.log(this.searchContact());
  }

  // assignContactToTask(contact: any) {
  //   if (this.assignedToTask().includes(contact)) {
  //     this.contactsService.removeContactFromTask(contact);
  //     console.log(contact);
  //   } else {
  //     this.contactsService.addContactToTask(contact);
  //   }
  // }

  assignContactToTask(contact: { displayName: string }) {
    const form = this.taskForm(); // get the FormGroup from the signal
    const current = form.get("assignedTo")?.value || [];

    const alreadyAssigned = current.some(
      (c: { displayName: string }) => c.displayName === contact.displayName,
    );
    const updated = alreadyAssigned
      ? current.filter(
          (c: { displayName: string }) => c.displayName !== contact.displayName,
        )
      : [...current, contact];

    form.get("assignedTo")?.setValue(updated);
  }

  // removeContactFromTask(contact: any) {
  //   this.contactsService.removeContactFromTask(contact);
  // }

  removeContactFromTask(contact: { displayName: string }) {
    const form = this.taskForm();
    const current = form.get("assignedTo")?.value || [];

    const updated = current.filter(
      (c: { displayName: string }) => c.displayName !== contact.displayName,
    );
    form.get("assignedTo")?.setValue(updated);
  }

  getContactColor(contact: any) {
    return this.contactsService.generateContactColor(contact);
  }

  getContactInitials(contact: any) {
    return this.contactsService.getInitials(contact);
  }

  @HostListener("document:click", ["$event"])
  closeDropdownOnClickOutside(event: Event) {
    const assignedToInputElement = document.getElementById("assignedTo");
    const assignedToDropdownElement = document.querySelector(".dropdown");

    const isClickInsideInput = assignedToInputElement?.contains(
      event.target as Node,
    );
    const isClickInsideDropdown = assignedToDropdownElement?.contains(
      event.target as Node,
    );

    if (this.assignedToOpen && !isClickInsideInput && !isClickInsideDropdown) {
      this.assignedToOpen = false;
    }
  }
}
