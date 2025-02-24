import { Component, computed, inject } from "@angular/core";
import { TasksService } from "../../services/tasks.service";

@Component({
  selector: "app-board",
  imports: [],
  templateUrl: "./board.component.html",
  styleUrl: "./board.component.scss",
})
export class BoardComponent {
  tasksService = inject(TasksService);

  tasks = computed(() => this.tasksService.tasks());

  deleteTask(id: number) {
    this.tasksService.deleteTask(id);
  }

  // Filter for later use
  // tasksQuery = query(
  //   collection(this.firestore, "users", userId, "tasks"),
  //   where("task", "!=", null),
  // );
}
