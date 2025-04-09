import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { Component, computed, inject, input } from "@angular/core";
import { Firestore } from "@angular/fire/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { AuthService } from "../../../../../core/services/auth/auth.service";
import { ContactsService } from "../../../services/contacts/contacts.service";
import { TasksService } from "../../../services/tasks/tasks.service";
import { TaskComponent } from "./task/task.component";

@Component({
  selector: "app-board-task-container",
  imports: [DragDropModule, TaskComponent],
  templateUrl: "./board-task-container.component.html",
  styleUrl: "./board-task-container.component.scss",
})
export class BoardTaskContainerComponent {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  private tasksService = inject(TasksService);
  private contactsService = inject(ContactsService);
  status = input.required<string>();
  title = input.required<string>();
  finishedSubtasks = 1;
  value = 50;
  bufferValue = 75;

  readonly TODO = "To Do";
  readonly IN_PROGRESS = "In Progress";
  readonly AWAITING_FEEDBACK = "Awaiting Feedback";
  readonly DONE = "Done";

  get connectedList() {
    return [
      this.TODO,
      this.IN_PROGRESS,
      this.AWAITING_FEEDBACK,
      this.DONE,
    ].filter((s) => s !== this.status());
  }

  tasks = computed(() => this.tasksService.tasks());
  addTaskToBoard = computed(() => this.tasksService.addTaskToBoard());
  searchTearm = computed(() => this.tasksService.searchTaskTerm());
  isDragging = computed(() => this.tasksService.isDragging());

  filteredTasks = computed(() => {
    const allTasks = this.tasks();
    const term = this.searchTearm();

    return allTasks.filter((task) => {
      const matchesSearch = !term || task.title.toLowerCase().includes(term);
      const matchesStatus = task.status === this.status();
      return matchesSearch && matchesStatus;
    });
  });

  assignedToTask = computed(() =>
    this.contactsService
      .assignedToTask()
      .sort((a: any, b: any) => a.displayName.localeCompare(b.displayName)),
  );

  toggleAddTaskAndSetStatus(status: string) {
    this.tasksService.toggleAddTaskAndSetStatus(status);
  }

  async drop(event: CdkDragDrop<any[]>, newStatus: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    } else {
      const userId = this.authService.userId();
      if (!userId) return;

      const taskToMove = event.previousContainer.data[event.previousIndex];

      if (!taskToMove || !taskToMove.id) {
        console.error("No valid task or task ID found.");
        return;
      }

      try {
        const taskRef = doc(
          this.firestore,
          `users/${userId}/tasks/${taskToMove.id}`,
        );
        await updateDoc(taskRef, { status: newStatus });
        console.log("Task status updated:", taskToMove.id, newStatus);

        this.tasksService.updateLocalTaskStatus(taskToMove.id, newStatus);

        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
      } catch (error) {
        console.error("Error updating task status:", error);
      }
    }
  }
}
