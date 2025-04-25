import { Component, HostListener, input } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-task-category",
  imports: [ReactiveFormsModule],
  templateUrl: "./task-category.component.html",
  styleUrl: "./task-category.component.scss",
})
export class TaskCategoryComponent {
  taskForm = input.required<FormGroup>();

  categories: string[] = ["Technical Task", "User Story"];
  categoryOpen: boolean = false;

  /**
   * Toggles the visibility of the category dropdown.
   */

  toggleCategory(): void {
    this.categoryOpen = !this.categoryOpen;
  }

  /**
   * Sets the category on the task form and closes the category dropdown.
   * @param category the category to set
   */
  setCategory(category: string): void {
    this.taskForm()!.get("category")?.setValue(category);
    this.categoryOpen = false;
  }

  /**
   * Closes the category dropdown if the user clicks outside of the category input
   * element.
   * @param event the event to check
   */
  @HostListener("document:click", ["$event"])
  closeDropdownOnClickOutside(event: Event): void {
    const assignedToInputElement = document.getElementById("category");

    const isClickInsideInput = assignedToInputElement?.contains(
      event.target as Node,
    );

    if (this.categoryOpen && !isClickInsideInput) {
      this.categoryOpen = false;
    }
  }
}
