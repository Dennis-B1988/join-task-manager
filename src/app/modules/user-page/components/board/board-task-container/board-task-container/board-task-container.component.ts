import { Component, computed, inject, input } from "@angular/core";
import {
  MatProgressBarModule,
  ProgressBarMode,
} from "@angular/material/progress-bar";
import { ContactsService } from "../../../../services/contacts/contacts.service";
import { TasksService } from "../../../../services/tasks/tasks.service";

@Component({
  selector: "app-board-task-container",
  imports: [MatProgressBarModule],
  templateUrl: "./board-task-container.component.html",
  styleUrl: "./board-task-container.component.scss",
})
export class BoardTaskContainerComponent {
  private tasksService = inject(TasksService);
  private contactsService = inject(ContactsService);
  status = input.required<string>();
  title = input.required<string>();
  finishedSubtasks = 1;
  mode: ProgressBarMode = "determinate";
  value = 50;
  bufferValue = 75;

  tasks = computed(() => this.tasksService.tasks());

  filteredTasks = computed(() =>
    this.tasks().filter((task) => task.status == this.status()),
  );

  assignedToTask = computed(() =>
    this.contactsService
      .assignedToTask()
      .sort((a: any, b: any) => a.displayName.localeCompare(b.displayName)),
  );

  constructor() {
    setTimeout(() => {
      console.log("Tasks:", this.filteredTasks());
    }, 5000);
  }

  getOpenSubtasks(task: any): string {
    return task.subtask?.open || [];
  }

  getDoneSubtasks(task: any): string {
    return task.subtask?.done || [];
  }
}
