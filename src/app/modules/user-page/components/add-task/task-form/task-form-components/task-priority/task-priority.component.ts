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

  /**
   * Updates the priority of a task in the local state.
   * This function is used by the task form component to update the task priority
   * when the user selects a different priority option from the dropdown.
   * @param priority The new priority of the task.
   */
  setPriority(prio: string): void {
    this.tasksService.setTaskPriority(prio);
  }
}
