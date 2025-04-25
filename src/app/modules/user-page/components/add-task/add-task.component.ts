import { Component, inject, OnDestroy, ViewChild } from "@angular/core";
import { ButtonWithIconComponent } from "../../../../shared/components/button-with-icon/button-with-icon.component";
import { TasksService } from "../../services/tasks/tasks.service";
import { TaskFormComponent } from "./task-form/task-form.component";

@Component({
  selector: "app-add-task",
  imports: [TaskFormComponent, ButtonWithIconComponent],
  templateUrl: "./add-task.component.html",
  styleUrl: "./add-task.component.scss",
})
export class AddTaskComponent implements OnDestroy {
  private tasksService = inject(TasksService);
  clearButtonHover: boolean = false;

  @ViewChild(TaskFormComponent) taskFormComponent!: TaskFormComponent;

  /**
   * Adds a new task to the task list by submitting the task form.
   * When adding a new task, the task status is set to "To Do".
   */
  addTask(): void {
    if (this.taskFormComponent) {
      this.tasksService.taskStatus.set("To Do");
      this.taskFormComponent.onSubmit();
    }
  }

  /**
   * Clears the task form to its default state, removing all values from the form fields.
   * This is used to clear the form when the user clicks the "Cancel" button or when the
   * component is destroyed to prevent stale data from being persisted.
   */
  clearTask(): void {
    if (this.taskFormComponent) {
      this.taskFormComponent.onClear();
    }
  }

  /**
   * Cleans up the component by clearing the task form when the component is destroyed.
   * This prevents any stale data from being persisted when the component is reinitialized.
   */
  ngOnDestroy(): void {
    this.taskFormComponent.onClear();
  }
}
