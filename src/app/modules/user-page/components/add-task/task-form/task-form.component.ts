import { Component, inject } from "@angular/core";
import { TasksService } from "../../../services/tasks.service";

@Component({
  selector: "app-task-form",
  imports: [],
  templateUrl: "./task-form.component.html",
  styleUrl: "./task-form.component.scss",
})
export class TaskFormComponent {
  private tasksService = inject(TasksService);

  urgent: boolean = false;
  medium: boolean = true;
  low: boolean = false;

  setPriority(prio: string) {
    if (prio === "Urgent") {
      this.urgent = true;
      this.medium = false;
      this.low = false;
      this.tasksService.taskPriority = "Urgent";
    }
    if (prio === "Medium") {
      this.urgent = false;
      this.medium = true;
      this.low = false;
      this.tasksService.taskPriority = "Medium";
    }
    if (prio === "Low") {
      this.urgent = false;
      this.medium = false;
      this.low = true;
      this.tasksService.taskPriority = "Low";
    }
    console.log(this.urgent, this.medium, this.low);
    console.log(this.tasksService.taskPriority);
  }
}
