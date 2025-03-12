import { Component, computed, inject, input } from "@angular/core";
import { TasksService } from "../../../../services/tasks/tasks.service";

@Component({
  selector: "app-board-task-container",
  imports: [],
  templateUrl: "./board-task-container.component.html",
  styleUrl: "./board-task-container.component.scss",
})
export class BoardTaskContainerComponent {
  tasksService = inject(TasksService);
  // toDo = input("toDo");
  // inProgress = input("inProgress");
  // awaitingFeedback = input("awaitingFeedback");
  // done = input("done");
  status = input.required<string>();
  title = input.required<string>();

  tasks = computed(() => this.tasksService.tasks());

  filteredTasks = computed(() =>
    this.tasks().filter((task) => task.status == this.status()),
  );
}
