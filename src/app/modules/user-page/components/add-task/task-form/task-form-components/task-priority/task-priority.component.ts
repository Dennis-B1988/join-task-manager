import { Component, inject } from "@angular/core";
import { TasksService } from "../../../../../services/tasks.service";

@Component({
  selector: "app-task-priority",
  imports: [],
  templateUrl: "./task-priority.component.html",
  styleUrl: "./task-priority.component.scss",
})
export class TaskPriorityComponent {
  tasksService = inject(TasksService);
  priority: string = "Medium";

  setPriority(prio: string) {
    this.priority = prio;
    this.tasksService.taskPriority = prio;

    console.log(this.tasksService.taskPriority);
  }
}
