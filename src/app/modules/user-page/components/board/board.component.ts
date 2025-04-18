import { AfterViewInit, Component, computed, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
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

  readonly TODO = "To Do";
  readonly IN_PROGRESS = "In Progress";
  readonly AWAITING_FEEDBACK = "Awaiting Feedback";
  readonly DONE = "Done";

  tasks = computed(() => this.tasksService.tasks());

  addTaskToBoard = computed(() => this.tasksService.addTaskToBoard());
  editTask = computed(() => this.tasksService.editTask());

  ngAfterViewInit() {
    this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  }

  searchTask(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value.trim();
    this.tasksService.searchTask(searchValue);
    console.log(this.tasksService.searchTaskTerm());
  }

  toggleAddTaskAndSetStatus(status: string) {
    this.tasksService.toggleAddTaskAndSetStatus(status);
  }
}
