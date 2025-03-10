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
  contacts: any[] = [];

  assignedToTask = computed(() =>
    this.contactsService
      .assignedToTask()
      .sort((a: any, b: any) => a.displayName.localeCompare(b.displayName)),
  );

  constructor() {
    effect(() => {
      this.contacts = this.contactsService.contacts().map((contact) => ({
        displayName: contact.displayName,
        color: contact.color,
        initials: contact.displayName
          .split(" ")
          .map((name: string) => name[0])
          .join(""),
      }));
    });
    setTimeout(() => {
      console.log("Contacts to task:", this.contacts);
    }, 2000);
  }

  toggleAssignedTo() {
    this.assignedToOpen = !this.assignedToOpen;
  }

  assignContactToTask(contact: string) {
    if (this.assignedToTask().includes(contact)) {
      this.contactsService.removeContactFromTask(contact);
      console.log(contact);
    } else {
      this.contactsService.addContactToTask(contact);
    }
  }

  removeContactFromTask(contact: string) {
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
