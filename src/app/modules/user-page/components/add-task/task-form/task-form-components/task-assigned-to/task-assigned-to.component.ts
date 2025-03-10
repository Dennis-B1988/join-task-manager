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
import { ContactsService } from "../../../../../services/contacts/contacts.service";

@Component({
  selector: "app-task-assigned-to",
  imports: [ReactiveFormsModule],
  templateUrl: "./task-assigned-to.component.html",
  styleUrl: "./task-assigned-to.component.scss",
})
export class TaskAssignedToComponent {
  private contactsService = inject(ContactsService);
  taskForm = input.required<FormGroup>();
  assignedToOpen: boolean = false;
  contacts = signal<any[]>([]);
  searchContact = signal<string>("");

  assignedToTask = computed(() =>
    this.contactsService
      .assignedToTask()
      .sort((a: any, b: any) => a.displayName.localeCompare(b.displayName)),
  );

  filteredContacts = computed(() => {
    const searchTerm = this.searchContact().toLowerCase();

    return searchTerm.length >= 3
      ? this.contacts().filter((contact) =>
          contact.displayName.toLowerCase().includes(searchTerm),
        )
      : this.contacts();
  });

  constructor() {
    effect(() => {
      const fetchedContacts = this.contactsService
        .contacts()
        .map((contact) => ({
          displayName: contact.displayName,
          color: contact.color,
          initials: contact.displayName
            .split(" ")
            .map((name: string) => name[0])
            .join(""),
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

  assignContactToTask(contact: any) {
    if (this.assignedToTask().includes(contact)) {
      this.contactsService.removeContactFromTask(contact);
      console.log(contact);
    } else {
      this.contactsService.addContactToTask(contact);
    }
  }

  removeContactFromTask(contact: any) {
    this.contactsService.removeContactFromTask(contact);
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
