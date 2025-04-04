import { Component, inject, OnDestroy, ViewChild } from "@angular/core";
import { ButtonWithIconComponent } from "../../../../../shared/components/button-with-icon/button-with-icon.component";
import { TasksService } from "../../../services/tasks/tasks.service";
import { TaskFormComponent } from "../../add-task/task-form/task-form.component";

@Component({
  selector: "app-add-task-from-board",
  imports: [TaskFormComponent, ButtonWithIconComponent],
  templateUrl: "./add-task-from-board.component.html",
  styleUrl: "./add-task-from-board.component.scss",
})
export class AddTaskFromBoardComponent implements OnDestroy {
  private tasksService = inject(TasksService);
  clearButtonHover: boolean = false;

  @ViewChild(TaskFormComponent) taskFormComponent!: TaskFormComponent;

  addTask() {
    if (this.taskFormComponent) {
      this.taskFormComponent.onSubmit();
      this.tasksService.addTaskToBoard.set(false);
    }
  }

  clearTask() {
    if (this.taskFormComponent) {
      this.taskFormComponent.onClear();
    }
  }

  ngOnDestroy() {
    this.tasksService.addTaskToBoard.set(false);
  }
}
