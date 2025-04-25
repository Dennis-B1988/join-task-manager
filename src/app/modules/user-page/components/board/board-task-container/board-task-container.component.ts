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
      const matchesSearch =
        !term ||
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term);
      const matchesStatus = task.status === this.status();
      return matchesSearch && matchesStatus;
    });
  });

  assignedToTask = computed(() =>
    this.contactsService
      .assignedToTask()
      .sort((a: any, b: any) => a.displayName.localeCompare(b.displayName)),
  );

  /**
   * Toggles the "add task to board" flag and sets the status of the task to be added
   * to the specified status. This is used by the board-task-container component to
   * show the task form component when a user clicks on the "Add task to [status]" button.
   * @param status The new status of the task to be added.
   */
  toggleAddTaskAndSetStatus(status: string): void {
    this.tasksService.toggleAddTaskAndSetStatus(status);
  }

  /**
   * Handles the drop event when a task is dragged and dropped into a different status.
   * This function will update the task status in the Firestore database and update the
   * local state of the tasks.
   * @param event The drag and drop event.
   * @param newTaskStatus The new status of the task.
   */
  async drop(event: CdkDragDrop<any[]>, newTaskStatus: string): Promise<void> {
    const { previousContainer, container, previousIndex, currentIndex } = event;

    if (previousContainer === container) {
      moveItemInArray(container.data, previousIndex, currentIndex);
      return;
    }

    const userId = this.authService.userId();
    if (!userId) {
      return;
    }

    const taskToMove = previousContainer.data[previousIndex];

    if (!taskToMove || !taskToMove.id) {
      return;
    }

    const taskRef = doc(
      this.firestore,
      `users/${userId}/tasks/${taskToMove.id}`,
    );

    try {
      await updateDoc(taskRef, { status: newTaskStatus });
      this.tasksService.updateLocalTaskStatus(taskToMove.id, newTaskStatus);
      transferArrayItem(
        previousContainer.data,
        container.data,
        previousIndex,
        currentIndex,
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  }
}
