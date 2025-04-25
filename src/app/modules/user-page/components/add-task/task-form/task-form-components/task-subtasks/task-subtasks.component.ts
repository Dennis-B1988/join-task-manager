import { Component, inject, input } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { SubtasksService } from "../../../../../services/subtasks/subtasks.service";

@Component({
  selector: "app-task-subtasks",
  imports: [ReactiveFormsModule],
  templateUrl: "./task-subtasks.component.html",
  styleUrl: "./task-subtasks.component.scss",
})
export class TaskSubtasksComponent {
  subTasksService = inject(SubtasksService);
  taskForm = input.required<FormGroup>();
  subTasks = this.subTasksService.subTasks;

  /**
   * Adds a new subtask to the list of subtasks for the current task.
   *
   * @remarks
   * This function is called when the user clicks the "Add subtask" button.
   * It generates a new subtask ID using the uuid package and adds the subtask
   * to the list of subtasks using the SubtasksService.
   * If the subtask input field is empty, the function does nothing.
   */
  addSubtask(): void {
    const form = this.taskForm();
    const subtaskValue = form.get("subtask")?.value;
    const subtaskId = crypto.randomUUID();

    if (!subtaskValue) return;

    this.subTasksService.addSubtask(subtaskValue, subtaskId);
    form.get("subtask")?.reset();
  }

  /**
   * Removes a subtask from the list of subtasks for the current task.
   *
   * @param id - The ID of the subtask to be removed.
   */
  removeSubtask(id: string): void {
    this.subTasksService.removeSubtask(id);
  }
}
