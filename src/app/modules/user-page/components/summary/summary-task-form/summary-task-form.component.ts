import { DatePipe } from "@angular/common";
import { Component, computed, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { TasksService } from "../../../services/tasks/tasks.service";

@Component({
  selector: "app-summary-task-form",
  imports: [DatePipe, RouterLink],
  templateUrl: "./summary-task-form.component.html",
  styleUrl: "./summary-task-form.component.scss",
})
export class SummaryTaskFormComponent {
  private tasksService = inject(TasksService);

  tasksSummary = computed(() =>
    this.tasksService
      .tasks()
      .map((task) => ({ status: task.status, priority: task.priority })),
  );

  totalTasks = computed(() => this.tasksService.tasks().length);

  urgentAmount = computed(
    () =>
      this.tasksSummary().filter((task) => task.priority == "Urgent").length,
  );
  toDoAmount = computed(
    () => this.tasksSummary().filter((task) => task.status == "To Do").length,
  );
  doneAmount = computed(
    () => this.tasksSummary().filter((task) => task.status == "Done").length,
  );
  inProgressAmount = computed(
    () =>
      this.tasksSummary().filter((task) => task.status == "In Progress").length,
  );
  awaitingFeedbackAmount = computed(
    () =>
      this.tasksSummary().filter((task) => task.status == "Awaiting Feedback")
        .length,
  );

  /**
   * Computed property that returns the due date of the task
   * with the shortest due date among all urgent tasks that are due in the future.
   */
  taskWithShortestDueDate = computed(() => {
    const tasks = this.tasksService.tasks();
    if (tasks.length === 0) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const futureTasks = tasks.filter(
      (task) => new Date(task.dueDate) > today && task.priority === "Urgent",
    );

    if (futureTasks.length === 0) return null;

    const earliestTask = futureTasks.reduce((earliest, current) => {
      return new Date(earliest.dueDate) < new Date(current.dueDate)
        ? earliest
        : current;
    });

    return new Date(earliestTask.dueDate);
  });

  toDoHover: boolean = false;
  doneHover: boolean = false;
}
