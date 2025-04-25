import { DragDropModule } from "@angular/cdk/drag-drop";
import { Component, computed, inject, input } from "@angular/core";
import {
  MatProgressBar,
  ProgressBarMode,
} from "@angular/material/progress-bar";
import { Task } from "../../../../../../core/models/task.model";
import { ContactsService } from "../../../../services/contacts/contacts.service";
import { SubtasksService } from "../../../../services/subtasks/subtasks.service";
import { TasksService } from "../../../../services/tasks/tasks.service";

@Component({
  selector: "app-task",
  imports: [MatProgressBar, DragDropModule],
  templateUrl: "./task.component.html",
  styleUrl: "./task.component.scss",
})
export class TaskComponent {
  private contactsService = inject(ContactsService);
  private subtasksService = inject(SubtasksService);
  tasksService = inject(TasksService);
  task = input.required<Task>();

  mode: ProgressBarMode = "determinate";

  openSubtasks = computed(() => this.task()?.subtask?.open || []);
  doneSubtasks = computed(() => this.task()?.subtask?.done || []);

  /**
   * Handles the task click event to initiate task editing.
   *
   * This function is triggered when a task is clicked. It checks if a dragging
   * operation is not in progress and then schedules a task editing operation
   * after a delay. This ensures that task editing is not triggered during
   * dragging.
   *
   * @param task - The task object to be edited.
   */
  onTaskClick(task: any): void {
    setTimeout(() => {
      if (!this.tasksService.isDragging()) {
        this.editTask(task);
      }
    });
  }

  /**
   * Handles the drag end event to update the dragging state.
   *
   * This function is called when the drag operation ends. It sets
   * the `isDragging` state to false after a delay of 100 milliseconds
   * to ensure any subsequent operations dependent on the dragging state
   * are executed correctly.
   */
  onDragEnded(): void {
    setTimeout(() => {
      this.tasksService.isDragging.set(false);
    }, 100);
  }

  /**
   * Prepares the application state for editing a task.
   *
   * This function sets the provided task as the selected task to be edited.
   * It updates the assigned contacts and loads the task's subtasks, enabling
   * the user to modify the task details. The edit mode is activated by setting
   * the editTask signal to true.
   *
   * @param task - The task object that is set for editing, containing
   *               assigned contacts and subtasks.
   */
  editTask(task: Task): void {
    this.contactsService.assignedToTask.set(task.assignedTo);
    this.tasksService.editTask.set(true);
    this.tasksService.selectedTask.set(task);
    this.subtasksService.loadSubtasks(task);
  }

  /**
   * Generates a color in HSL format based on the input name.
   *
   * @param name - The name used to generate a unique color.
   * @returns A string representing the color in HSL format, with a calculated
   * hue derived from the hash of the name, and fixed saturation and lightness
   * values for vibrant and consistent appearance.
   */
  getContactColor(name: string): string {
    return this.contactsService.generateContactColor(name);
  }

  /**
   * Returns the initials of the given contact. The returned string is the
   * first letter of the contact's display name, or the first two letters
   * if the display name is only two characters long.
   *
   * @param name - The full name of the contact for which to generate initials.
   * @returns A string containing the initials of the contact.
   */
  getContactInitials(name: string): string {
    return this.contactsService.getInitials(name);
  }
}
