import {
  AfterViewInit,
  Component,
  computed,
  inject,
  OnDestroy,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
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
export class BoardComponent implements AfterViewInit, OnDestroy {
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
  selectedTask = computed(() => this.tasksService.selectedTask());

  /**
   * Handles the routing fragment parameter and scrolls to the element with
   * the corresponding ID if it exists. This is used to scroll to the task
   * being edited when the user navigates to the edit URL.
   *
   * @remarks
   * This is done in ngAfterViewInit instead of ngOnInit because the
   * element being scrolled to may not be rendered yet when ngOnInit is
   * called.
   */
  ngAfterViewInit(): void {
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

  /**
   * Updates the search term for tasks and updates the local state.
   *
   * @param event - The input event from the search field.
   *               The search value is extracted from the event target and trimmed.
   */
  searchTask(event: Event): void {
    const searchValue = (event.target as HTMLInputElement).value.trim();
    this.tasksService.searchTask(searchValue);
  }

  /**
   * Toggles the "add task to board" flag and sets the status of the task to be added
   * to the specified status. This is used by the board component to show the task
   * form component when a user clicks on the "Add task to [status]" button.
   * @param status The new status of the task to be added.
   */
  toggleAddTaskAndSetStatus(status: string): void {
    this.tasksService.toggleAddTaskAndSetStatus(status);
  }

  /**
   * Cleans up the component by resetting the edit task and selected task states to
   * null. This is called when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.tasksService.editTask.set(false);
    this.tasksService.selectedTask.set(null);
  }
}
