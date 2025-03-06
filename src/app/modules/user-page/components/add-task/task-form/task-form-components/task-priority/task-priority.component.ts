import { Component, computed, inject } from "@angular/core";
import { TasksService } from "../../../../../services/tasks/tasks.service";

@Component({
  selector: "app-task-priority",
  imports: [],
  templateUrl: "./task-priority.component.html",
  styleUrl: "./task-priority.component.scss",
})
export class TaskPriorityComponent {
  tasksService = inject(TasksService);
  priority = computed(() => this.tasksService.taskPriority());

  setPriority(prio: string) {
    this.tasksService.setTaskPriority(prio);

    console.log("Priority:", this.tasksService.taskPriority);
  }
}
