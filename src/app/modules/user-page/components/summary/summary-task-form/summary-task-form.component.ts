import { DatePipe } from "@angular/common";
import { Component, computed, inject } from "@angular/core";
import { TasksService } from "../../../services/tasks/tasks.service";

@Component({
  selector: "app-summary-task-form",
  imports: [DatePipe],
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

  taskWithShortestDueDate = computed(() => {
    const tasks = this.tasksService.tasks();

    if (tasks.length === 0) return null;

    return tasks.reduce((earliestTask, currentTask) => {
      return new Date(earliestTask.dueDate) < new Date(currentTask.dueDate)
        ? earliestTask
        : currentTask;
    });
  });

  currentDate = new Date();
}
