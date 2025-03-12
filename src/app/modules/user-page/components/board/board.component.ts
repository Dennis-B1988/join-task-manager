import { Component, computed, inject, signal } from "@angular/core";
import { TasksService } from "../../services/tasks/tasks.service";
import { BoardTaskContainerComponent } from "./board-task-container/board-task-container/board-task-container.component";

@Component({
  selector: "app-board",
  imports: [BoardTaskContainerComponent],
  templateUrl: "./board.component.html",
  styleUrl: "./board.component.scss",
})
export class BoardComponent {
  tasksService = inject(TasksService);

  readonly TODO = "To Do";
  readonly IN_PROGRESS = "In Progress";
  readonly AWAITING_FEEDBACK = "Awaiting Feedback";
  readonly DONE = "Done";

  tasks = computed(() => this.tasksService.tasks());

  deleteTask(id: string) {
    this.tasksService.deleteTask(id);
  }

  // Filter for later use
  // tasksQuery = query(
  //   collection(this.firestore, "users", userId, "tasks"),
  //   where("task", "!=", null),
  // );
}
