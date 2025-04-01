import { Component, computed, inject, input } from "@angular/core";
import { Subtask, Task } from "../../../../../core/models/task.model";
import { ContactsService } from "../../../services/contacts/contacts.service";
import { TasksService } from "../../../services/tasks/tasks.service";

@Component({
  selector: "app-edit-task",
  imports: [],
  templateUrl: "./edit-task.component.html",
  styleUrl: "./edit-task.component.scss",
})
export class EditTaskComponent {
  private tasksService = inject(TasksService);
  private contactsService = inject(ContactsService);

  selectedTask = computed(() => this.tasksService.selectedTask());

  constructor() {
    console.log(this.selectedTask());
  }

  get selectedPriority() {
    if (this.selectedTask()?.priority === "Urgent") return "urgent";
    if (this.selectedTask()?.priority === "Medium") return "medium";
    if (this.selectedTask()?.priority === "Low") return "low";

    return "";
  }

  toggleSubtaskStatus(subtask: Subtask, isDone: boolean) {
    const task = this.selectedTask();
    if (!task) return;

    if (isDone) {
      task.subtask.open = task.subtask.open.filter((s) => s.id !== subtask.id);
      task.subtask.done.push(subtask);
    } else {
      task.subtask.done = task.subtask.done.filter((s) => s.id !== subtask.id);
      task.subtask.open.push(subtask);
    }

    this.tasksService.updateTask(task);
  }

  getContactInitials(name: string): string {
    return this.contactsService.getInitials(name);
  }

  closeForm() {
    console.log("Task selected:", this.tasksService.selectedTask());
    this.tasksService.editTask.set(false);
    this.tasksService.selectedTask.set(null);
    console.log("Task selected after close:", this.tasksService.selectedTask());
  }
}
