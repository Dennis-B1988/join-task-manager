import { AfterViewInit, Component, computed, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Task } from "../../../../core/models/task.model";
import { UnsubscribeService } from "../../../../core/services/unsubscribe/unsubscribe.service";
import { ButtonWithIconComponent } from "../../../../shared/components/button-with-icon/button-with-icon.component";
import { TasksService } from "../../services/tasks/tasks.service";
import { AddTaskFromBoardComponent } from "./add-task-from-board/add-task-from-board.component";
import { BoardTaskContainerComponent } from "./board-task-container/board-task-container.component";
import { EditTaskComponent } from "./edit-task/edit-task.component";

@Component({
  selector: "app-board",
  imports: [
    BoardTaskContainerComponent,
    ButtonWithIconComponent,
    EditTaskComponent,
    AddTaskFromBoardComponent,
  ],
  templateUrl: "./board.component.html",
  styleUrl: "./board.component.scss",
})
export class BoardComponent implements AfterViewInit {
  private tasksService = inject(TasksService);
  private route = inject(ActivatedRoute);
  private unsubscribeService = inject(UnsubscribeService);

  readonly TODO = "To Do";
  readonly IN_PROGRESS = "In Progress";
  readonly AWAITING_FEEDBACK = "Awaiting Feedback";
  readonly DONE = "Done";

  tasks = computed(() => this.tasksService.tasks());

  addTaskToBoard = computed(() => this.tasksService.addTaskToBoard());
  editTask = computed(() => this.tasksService.editTask());
  showDeleteTask = computed(() => this.tasksService.showDeleteTask());
  selectedTask = computed(() => this.tasksService.selectedTask());

  ngAfterViewInit() {
    const subscription = this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });

    this.unsubscribeService.add(() => subscription.unsubscribe());
  }

  searchTask(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value.trim();
    this.tasksService.searchTask(searchValue);
  }

  toggleAddTaskAndSetStatus(status: string) {
    this.tasksService.toggleAddTaskAndSetStatus(status);
  }

  // closeDeleteModal() {
  //   this.tasksService.showDeleteTask.set(false);
  // }

  closeForm() {
    this.tasksService.editTask.set(false);
    this.tasksService.showDeleteTask.set(false);
    this.tasksService.selectedTask.set(null);
  }

  deleteTask(task: Task) {
    this.tasksService.deleteTask(task.id!);
    this.closeForm();
  }
}
