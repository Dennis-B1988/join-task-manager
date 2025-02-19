import { Component, inject } from "@angular/core";
import { TasksService } from "../../services/tasks.service";
import { TaskFormComponent } from "./task-form/task-form.component";

@Component({
  selector: "app-add-task",
  imports: [TaskFormComponent],
  templateUrl: "./add-task.component.html",
  styleUrl: "./add-task.component.scss",
})
export class AddTaskComponent {
  tasksService = inject(TasksService);

  addTask() {
    this.tasksService.addTask();
  }
}
