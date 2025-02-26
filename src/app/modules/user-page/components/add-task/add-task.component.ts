import { Component, inject, ViewChild } from "@angular/core";
import { ButtonWithIconComponent } from "../../../../shared/components/button-with-icon/button-with-icon.component";
import { TasksService } from "../../services/tasks.service";
import { TaskFormComponent } from "./task-form/task-form.component";

@Component({
  selector: "app-add-task",
  imports: [TaskFormComponent, ButtonWithIconComponent],
  templateUrl: "./add-task.component.html",
  styleUrl: "./add-task.component.scss",
})
export class AddTaskComponent {
  tasksService = inject(TasksService);
  clearButtonHover: boolean = false;

  @ViewChild(TaskFormComponent) taskFormComponent!: TaskFormComponent;

  addTask() {
    if (this.taskFormComponent) {
      this.taskFormComponent.onSubmit();
    }
  }

  clearTask() {
    if (this.taskFormComponent) {
      this.taskFormComponent.onClear();
    }
  }
}
