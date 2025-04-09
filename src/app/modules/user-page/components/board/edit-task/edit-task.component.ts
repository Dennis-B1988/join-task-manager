import {
  Component,
  computed,
  effect,
  inject,
  input,
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

  constructor() {
    console.log(this.selectedTask());
  }

  get selectedPriority() {
    if (this.selectedTask()?.priority === "Urgent") return "urgent";
    if (this.selectedTask()?.priority === "Medium") return "medium";
    if (this.selectedTask()?.priority === "Low") return "low";

    return "";
  }

  toggleSubtaskStatus(subtask: Subtask) {
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

  deleteSubtask(id: string) {
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

  closeForm() {
    this.tasksService.editTask.set(false);
    this.tasksService.selectedTask.set(null);
    console.log("Task selected after close:", this.tasksService.selectedTask());
  }

  deleteTask(task: Task) {
    this.tasksService.deleteTask(task.id!);
    this.closeForm();
  }

  toggleAddTaskAndSetStatus(status: string) {
    this.tasksService.toggleAddTaskAndSetStatus(status);
  }

  getContactInitials(name: string): string {
    return this.contactsService.getInitials(name);
  }

  getContactColor(name: string): string {
    return this.contactsService.generateContactColor(name);
  }

  ngOnDestroy(): void {
    this.tasksService.editTask.set(false);
    this.tasksService.selectedTask.set(null);
    this.contactsService.assignedToTask.set([]);
    this.subtasksService.clearSubtasks();
  }
}
