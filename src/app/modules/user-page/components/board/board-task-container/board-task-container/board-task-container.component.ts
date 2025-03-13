import { Component, computed, inject, input } from "@angular/core";
import { ContactsService } from "../../../../services/contacts/contacts.service";
import { TasksService } from "../../../../services/tasks/tasks.service";

@Component({
  selector: "app-board-task-container",
  imports: [],
  templateUrl: "./board-task-container.component.html",
  styleUrl: "./board-task-container.component.scss",
})
export class BoardTaskContainerComponent {
  private tasksService = inject(TasksService);
  private contactsService = inject(ContactsService);
  status = input.required<string>();
  title = input.required<string>();

  tasks = computed(() => this.tasksService.tasks());

  filteredTasks = computed(() =>
    this.tasks().filter((task) => task.status == this.status()),
  );

  assignedToTask = computed(() =>
    this.contactsService
      .assignedToTask()
      .sort((a: any, b: any) => a.displayName.localeCompare(b.displayName)),
  );

  get taskPriority() {
    const priority = this.tasksService.taskPriority();
    if (priority == "Urgent") return "urgent";
    if (priority == "Medium") return "medium";
    if (priority == "Low") return "low";
    return null;
  }

  constructor() {
    setTimeout(() => {
      console.log("Tasks:", this.filteredTasks());
    }, 5000);
  }
}
