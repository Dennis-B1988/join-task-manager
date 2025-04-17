import {
  Component,
  computed,
  inject,
  OnDestroy,
  ViewChild,
} from "@angular/core";
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

  selectedTask = computed(() => this.tasksService.selectedTask());
  editTask = computed(() => this.tasksService.editTask());

  addTask() {
    if (this.taskFormComponent) {
      this.taskFormComponent.onSubmit();
      this.tasksService.addTaskToBoard.set(false);
    }
  }

  updateTask() {
    if (this.taskFormComponent) {
      this.taskFormComponent.onUpdate();
      this.tasksService.addTaskToBoard.set(false);
    }
  }

  clearTask() {
    if (this.taskFormComponent) {
      this.taskFormComponent.onClear();
    }
  }

  closeForm() {
    this.tasksService.addTaskToBoard.set(false);
  }

  ngOnDestroy() {
    this.tasksService.addTaskToBoard.set(false);
  }
}
