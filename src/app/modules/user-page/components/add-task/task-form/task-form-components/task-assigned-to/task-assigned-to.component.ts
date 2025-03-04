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
  assignedToTask = computed(() => this.contactsService.assignedToTask());
  assignedToOpen: boolean = false;
  contacts: any[] = [];

  constructor() {
    effect(() => {
      this.contacts = this.contactsService.contacts().map((contact) => ({
        displayName: contact.displayName,
        initials: contact.initials,
      }));
    });
    setTimeout(() => {
      console.log(this.contacts);
    }, 2000);
  }

  toggleAssignedTo() {
    this.assignedToOpen = !this.assignedToOpen;
  }

  assignContact(contact: string) {
    this.contactsService.addContactToTask(contact);
  }

  removeFocus(event: FocusEvent) {
    const inputElement = event.target as HTMLInputElement;
    inputElement.blur();
  }

  @HostListener("document:click", ["$event"])
  closeDropdownOnClickOutside(event: Event) {
    const assignedToInputElement = document.getElementById("assignedTo");
    if (
      assignedToInputElement &&
      !assignedToInputElement.contains(event.target as Node)
    ) {
      this.assignedToOpen = false;
    }
  }
}
