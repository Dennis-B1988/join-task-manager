import {
  Component,
  computed,
  HostListener,
  inject,
  OnDestroy,
  ViewChild,
} from "@angular/core";
import { ButtonWithIconComponent } from "../../../../../shared/components/button-with-icon/button-with-icon.component";
import { TasksService } from "../../../services/tasks/tasks.service";
import { TaskFormComponent } from "../../add-task/task-form/task-form.component";

@Component({
  selector: "app-add-task-from-board",
  imports: [TaskFormComponent, ButtonWithIconComponent],
  templateUrl: "./add-task-from-board.component.html",
  styleUrl: "./add-task-from-board.component.scss",
})
export class AddTaskFromBoardComponent implements OnDestroy {
  private tasksService = inject(TasksService);
  clearButtonHover: boolean = false;

  @ViewChild(TaskFormComponent) taskFormComponent!: TaskFormComponent;

  selectedTask = computed(() => this.tasksService.selectedTask());
  editTask = computed(() => this.tasksService.editTask());
  addTaskToBoard = computed(() => this.tasksService.addTaskToBoard());

  /**
   * Adds a new task to the task list by submitting the task form.
   *
   * When adding a new task, the task form is submitted by calling the onSubmit()
   * method of the task form component. After the form is submitted, the "addTaskToBoard"
   * signal is set to false to close the task form.
   */
  addTask(): void {
    if (this.taskFormComponent) {
      this.taskFormComponent.onSubmit();
      this.tasksService.addTaskToBoard.set(false);
    }
  }

  /**
   * Updates an existing task in the local state and database.
   *
   * When the user updates a task, this function is called to update the task
   * information in the local state and in the database. It also closes the
   * task form by setting the "addTaskToBoard" signal to false.
   */
  updateTask(): void {
    if (this.taskFormComponent) {
      this.taskFormComponent.onUpdate();
      this.tasksService.addTaskToBoard.set(false);
    }
  }

  /**
   * Clears the task form by invoking the onClear method of the TaskFormComponent.
   * This is typically used to reset the form to its default state, removing any
   * input values, and is useful when the user decides to cancel task creation or
   * update.
   */
  clearTask(): void {
    if (this.taskFormComponent) {
      this.taskFormComponent.onClear();
    }
  }

  /**
   * Closes the task form and resets the "addTaskToBoard" observable to false.
   */
  closeForm(): void {
    this.tasksService.addTaskToBoard.set(false);
  }

  /**
   * Resets the "addTaskToBoard" observable to false when the component is destroyed.
   * This ensures that the task form is not shown after the component is destroyed,
   * preventing unintended behavior when navigating away from the board.
   */

  ngOnDestroy(): void {
    this.tasksService.addTaskToBoard.set(false);
  }

  /**
   * Closes the add task menu when a click is detected outside the add-task-container.
   *
   * @param event - The click event that is triggered on the document.
   */
  @HostListener("document:click", ["$event"])
  closeMenu(event: Event): void {
    if (this.addTaskToBoard()) {
      const targetElement = event.target as HTMLElement;
      if (!targetElement.closest(".add-task-container")) {
        this.tasksService.addTaskToBoard.set(false);
      }
    }
  }
}
