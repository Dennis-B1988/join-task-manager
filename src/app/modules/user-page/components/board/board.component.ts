import { Component, computed, inject } from "@angular/core";
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
