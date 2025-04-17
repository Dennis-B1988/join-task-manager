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

  toggleCategory() {
    this.categoryOpen = !this.categoryOpen;
    console.log(this.categoryOpen);
  }

  setCategory(category: string) {
    this.taskForm()!.get("category")?.setValue(category);
    this.categoryOpen = false;
  }

  @HostListener("document:click", ["$event"])
  closeDropdownOnClickOutside(event: Event) {
    const assignedToInputElement = document.getElementById("category");

    const isClickInsideInput = assignedToInputElement?.contains(
      event.target as Node,
    );

    if (this.categoryOpen && !isClickInsideInput) {
      this.categoryOpen = false;
    }
  }
}
