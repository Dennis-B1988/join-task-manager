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

  /**
   * Sets the `contacts` signal to an array of contact objects containing only the `displayName` property.
   *
   * This is done by filtering the `contacts` observable of the `ContactsService` and mapping the results to
   * a new array of objects with only the `displayName` property.
   *
   * The `contacts` signal is used to populate the dropdown list of assigned contacts.
   *
   * This method is called when the component is initialized.
   */
  constructor() {
    effect(() => {
      const fetchedContacts = this.contactsService
        .contacts()
        .filter((contact) => ({
          displayName: contact.displayName,
        }));

      this.contacts.set(fetchedContacts);
    });
  }

  /**
   * Toggles the visibility of the assigned contacts dropdown.
   *
   * This function switches the `assignedToOpen` state between
   * true and false, controlling whether the dropdown is open or closed.
   */
  toggleAssignedTo(): void {
    this.assignedToOpen = !this.assignedToOpen;
  }

  /**
   * Updates the search term for filtering contacts based on user input.
   *
   * @param event - The input event from the search field.
   * If the input value has a length of 3 or more characters, it is set as the search term.
   * Otherwise, the search term is cleared.
   */
  searchContacts(event: Event): void {
    const searchValue = (event.target as HTMLInputElement).value.trim();
    this.searchContact.set(searchValue.length >= 3 ? searchValue : "");
  }

  /**
   * Assigns a contact to the task if it doesn't already exist.
   *
   * @param contact - The contact to be assigned, identified by its displayName.
   * This updates the assignedToTask list by appending the specified contact if it's not already present.
   */
  assignContactToTask(contact: any): void {
    const exists = this.assignedToTask().some(
      (c) => c.displayName === contact.displayName,
    );

    if (exists) {
      this.contactsService.removeContactFromTask(contact);
    } else {
      this.contactsService.addContactToTask(contact);
    }
  }

  /**
   * Checks if a contact is assigned to the task.
   *
   * @param contact - The contact to be checked, identified by its displayName.
   * @returns true if the contact is assigned to the task, false otherwise.
   */
  isContactAssigned(contact: any): boolean {
    return this.assignedToTask().some(
      (c) => c.displayName === contact.displayName,
    );
  }

  /**
   * Removes a contact from the task's assigned list.
   *
   * @param contact - The contact to be removed, identified by its displayName.
   * This updates the assignedToTask list by filtering out the specified contact.
   */
  removeContactFromTask(contact: any): void {
    this.contactsService.removeContactFromTask(contact);
  }

  /**
   * Returns the color associated with the given contact. The color is
   * generated from the contact's display name and is used to style the
   * contact's initials in the assigned to dropdown.
   *
   * @param contact the contact for which to generate the color
   * @returns a string containing the contact's color in HSL format
   */
  getContactColor(contact: any): string {
    return this.contactsService.generateContactColor(contact);
  }

  /**
   * Returns the initials of the given contact. The returned string is the
   * first letter of the contact's display name, or the first two letters
   * if the display name is only two characters long.
   *
   * @param contact the contact for which to generate the initials
   * @returns a string containing the initials of the contact
   */
  getContactInitials(contact: any): string {
    return this.contactsService.getInitials(contact);
  }

  /**
   * Closes the assigned to dropdown when a click is registered outside of the
   * dropdown or the input field.
   *
   * @param event the event that triggered the check
   */
  @HostListener("document:click", ["$event"])
  closeDropdownOnClickOutside(event: Event): void {
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
