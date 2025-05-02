import {
  Component,
  computed,
  HostListener,
  inject,
  OnDestroy,
} from "@angular/core";
import { Subtask, Task } from "../../../../../core/models/task.model";
import { AuthService } from "../../../../../core/services/auth/auth.service";
import { ContactsService } from "../../../services/contacts/contacts.service";
import { SubtasksService } from "../../../services/subtasks/subtasks.service";
import { TasksService } from "../../../services/tasks/tasks.service";

@Component({
  selector: "app-edit-task",
  imports: [],
  templateUrl: "./edit-task.component.html",
  styleUrl: "./edit-task.component.scss",
})
export class EditTaskComponent implements OnDestroy {
  private authService = inject(AuthService);
  private tasksService = inject(TasksService);
  private subtasksService = inject(SubtasksService);
  private contactsService = inject(ContactsService);

  user = computed(() => this.authService.user());

  selectedTask = computed(() => this.tasksService.selectedTask());
  addTaskToBoard = computed(() => this.tasksService.addTaskToBoard());
  editTask = computed(() => this.tasksService.editTask());

  sortedAssignedTo = computed(() => {
    const currentUser = this.user();
    if (!currentUser || !currentUser.displayName)
      return this.selectedTask()?.assignedTo;

    return this.selectedTask()?.assignedTo.sort((a: any, b: any) => {
      if (a.displayName === currentUser.displayName) return -1;
      if (b.displayName === currentUser.displayName) return 1;
      return a.displayName.localeCompare(b.displayName);
    });
  });

  sortedSubtasks = computed(() => {
    const task = this.selectedTask();
    if (!task) return [];

    return [
      ...task.subtask.open.map((s) => ({ ...s, done: false })),
      ...task.subtask.done.map((s) => ({ ...s, done: true })),
    ].sort((a, b) => Number(a.done) - Number(b.done));
  });

  /**
   * The selected task's priority as a lowercase string, or an empty string
   * if no task is selected. This is used in the template to conditionally
   * apply CSS classes to the task priority display.
   */
  get selectedPriority(): string {
    if (this.selectedTask()?.priority === "Urgent") return "urgent";
    if (this.selectedTask()?.priority === "Medium") return "medium";
    if (this.selectedTask()?.priority === "Low") return "low";

    return "";
  }

  /**
   * Toggles the status of a given subtask between open and done.
   *
   * This function updates the subtask's status by moving it from the
   * open list to the done list or vice versa, depending on its current
   * state. It then updates the task in the task service and reloads
   * the subtasks.
   *
   * @param subtask - The subtask whose status is to be toggled.
   */
  toggleSubtaskStatus(subtask: Subtask): void {
    const task = this.selectedTask();
    if (!task) return;

    if (subtask.done) {
      task.subtask.done = task.subtask.done.filter((s) => s.id !== subtask.id);
      task.subtask.open.push(subtask);
    } else {
      task.subtask.open = task.subtask.open.filter((s) => s.id !== subtask.id);
      task.subtask.done.push(subtask);
    }

    subtask.done = !subtask.done;

    this.tasksService.updateTask({ ...task });
    this.subtasksService.loadSubtasks(task);
  }

  /**
   * Deletes a subtask from the selected task.
   *
   * @param id - The ID of the subtask to be deleted.
   */
  deleteSubtask(id: string): void {
    const currentTask = this.selectedTask();
    if (!currentTask) return;

    const updatedTask: Task = {
      ...currentTask,
      subtask: {
        open: currentTask.subtask.open.filter((s) => s.id !== id),
        done: currentTask.subtask.done.filter((s) => s.id !== id),
      },
    };

    this.tasksService.updateTask(updatedTask);
    this.tasksService.selectedTask.set(updatedTask);
    this.subtasksService.loadSubtasks(updatedTask);
  }

  /**
   * Closes the task form and resets the selected task and edit task status.
   */
  closeForm(): void {
    this.tasksService.editTask.set(false);
    this.tasksService.selectedTask.set(null);
  }

  /**
   * Deletes a task and closes the task form.
   *
   * @param task - The task object containing the ID of the task to be deleted.
   */
  deleteTask(task: Task): void {
    this.tasksService.deleteTask(task.id!);
    this.closeForm();
  }

  /**
   * Triggers the task addition process by toggling the "add task to board" flag
   * and specifying the task's new status.
   *
   * This function is used to display the task form component when the user clicks
   * an "Add task" button associated with a specific status. It ensures that the
   * task being added will have its status set to the provided value.
   *
   * @param status - The status to assign to the task being added.
   */
  toggleAddTaskAndSetStatus(status: string): void {
    this.tasksService.toggleAddTaskAndSetStatus(status);
  }

  /**
   * Returns the initials of the given contact's name.
   *
   * @param name - The full name of the contact for which to generate initials.
   * @returns A string containing the initials of the contact's name,
   * derived from the first letter of the first two words in the name
   * if it consists of multiple words, or the first letter of the single
   * word name. The initials are returned in uppercase.
   */
  getContactInitials(name: string): string {
    return this.contactsService.getInitials(name);
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
   * Cleans up the component by resetting task-related states and clearing subtasks.
   *
   * This method is called when the component is destroyed. It resets the edit task
   * and selected task states to ensure that no task remains selected or in edit mode.
   * Additionally, it clears the list of assigned contacts and the subtasks to prevent
   * any stale data from being retained when the component is reinitialized.
   */
  ngOnDestroy(): void {
    this.tasksService.editTask.set(false);
    this.tasksService.selectedTask.set(null);
    this.contactsService.assignedToTask.set([]);
    this.subtasksService.clearSubtasks();
  }

  /**
   * Closes the edit task menu if a click is detected outside of the menu.
   *
   * This method is triggered by a click event on the document. It checks
   * if the edit task mode is active and the add task to board mode is not.
   * If a click occurs outside the element with the class "edit-task",
   * the edit task mode is disabled.
   *
   * @param event - The click event that triggers the menu close check.
   */
  @HostListener("document:click", ["$event"])
  closeMenu(event: Event): void {
    if (this.editTask() && !this.addTaskToBoard()) {
      const targetElement = event.target as HTMLElement;
      if (!targetElement.closest(".edit-task")) {
        this.tasksService.editTask.set(false);
      }
    }
  }
}
