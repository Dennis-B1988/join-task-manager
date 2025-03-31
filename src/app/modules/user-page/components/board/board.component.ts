import { Component, computed, inject, signal } from "@angular/core";
import { ButtonWithIconComponent } from "../../../../shared/components/button-with-icon/button-with-icon.component";
import { TasksService } from "../../services/tasks/tasks.service";
import { BoardTaskContainerComponent } from "./board-task-container/board-task-container.component";
import { EditTaskComponent } from "./edit-task/edit-task.component";

@Component({
  selector: "app-board",
  imports: [
    BoardTaskContainerComponent,
    ButtonWithIconComponent,
    EditTaskComponent,
  ],
  templateUrl: "./board.component.html",
  styleUrl: "./board.component.scss",
})
export class BoardComponent {
  tasksService = inject(TasksService);

  readonly TODO = "To Do";
  readonly IN_PROGRESS = "In Progress";
  readonly AWAITING_FEEDBACK = "Awaiting Feedback";
  readonly DONE = "Done";

  tasks = computed(() => this.tasksService.tasks());

  editTask = computed(() => this.tasksService.editTask());

  // deleteTask(id: string) {
  //   this.tasksService.deleteTask(id);
  // }
}
