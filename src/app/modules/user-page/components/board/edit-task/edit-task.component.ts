import { Component, computed, inject, input } from "@angular/core";
import { Subtask, Task } from "../../../../../core/models/task.model";
import { AuthService } from "../../../../../core/services/auth/auth.service";
import { ContactsService } from "../../../services/contacts/contacts.service";
import { TasksService } from "../../../services/tasks/tasks.service";

@Component({
  selector: "app-edit-task",
  imports: [],
  templateUrl: "./edit-task.component.html",
  styleUrl: "./edit-task.component.scss",
})
export class EditTaskComponent {
  private authService = inject(AuthService);
  private tasksService = inject(TasksService);
  private contactsService = inject(ContactsService);

  user = computed(() => this.authService.user());

  selectedTask = computed(() => this.tasksService.selectedTask());

  sortedSubtasks = computed(() => {
    const task = this.selectedTask();
    if (!task) return [];
    return [...task.subtask.open, ...task.subtask.done].sort(
      (a, b) => Number(a.done) - Number(b.done),
    );
  });

  constructor() {
    console.log(this.selectedTask());
  }

  get selectedPriority() {
    if (this.selectedTask()?.priority === "Urgent") return "urgent";
    if (this.selectedTask()?.priority === "Medium") return "medium";
    if (this.selectedTask()?.priority === "Low") return "low";

    return "";
  }

  // toggleSubtaskStatus(subtask: Subtask, isDone: boolean) {
  //   const task = this.selectedTask();
  //   if (!task) return;

  //   if (isDone) {
  //     task.subtask.open = task.subtask.open.filter((s) => s.id !== subtask.id);
  //     task.subtask.done.push(subtask);
  //   } else {
  //     task.subtask.done = task.subtask.done.filter((s) => s.id !== subtask.id);
  //     task.subtask.open.push(subtask);
  //   }

  //   this.tasksService.updateTask(task);
  // }

  toggleSubtaskStatus(subtask: Subtask) {
    subtask.done = !subtask.done;
  }

  closeForm() {
    console.log("Task selected:", this.tasksService.selectedTask());
    this.tasksService.editTask.set(false);
    this.tasksService.selectedTask.set(null);
    console.log("Task selected after close:", this.tasksService.selectedTask());
  }

  deleteTask(task: Task) {
    this.tasksService.deleteTask(task.id!);
    this.closeForm();
  }

  getContactInitials(name: string): string {
    return this.contactsService.getInitials(name);
  }

  getContactColor(name: string): string {
    return this.contactsService.generateContactColor(name);
  }
}
