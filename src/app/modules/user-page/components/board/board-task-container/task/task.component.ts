import { DragDropModule } from "@angular/cdk/drag-drop";
import { Component, computed, inject, input, OnInit } from "@angular/core";
import {
  MatProgressBar,
  ProgressBarMode,
} from "@angular/material/progress-bar";
import { Contact } from "../../../../../../core/models/contact.model";
import { Task } from "../../../../../../core/models/task.model";
import { ContactsService } from "../../../../services/contacts/contacts.service";
import { SubtasksService } from "../../../../services/subtasks/subtasks.service";
import { TasksService } from "../../../../services/tasks/tasks.service";

@Component({
  selector: "app-task",
  imports: [MatProgressBar, DragDropModule],
  templateUrl: "./task.component.html",
  styleUrl: "./task.component.scss",
})
export class TaskComponent {
  private contactsService = inject(ContactsService);
  tasksService = inject(TasksService);
  task = input.required<Task>();

  mode: ProgressBarMode = "determinate";

  openSubtasks = computed(() => this.task()?.subtask?.open || []);
  doneSubtasks = computed(() => this.task()?.subtask?.done || []);

  getContactColor(name: string): string {
    return this.contactsService.generateContactColor(name);
  }

  getContactInitials(name: string): string {
    return this.contactsService.getInitials(name);
  }

  editTask(task: Task) {
    this.contactsService.assignedToTask.set(task.assignedTo);
    console.log("Assigned to this task: ", task.assignedTo);
    this.tasksService.editTask.set(true);
    this.tasksService.selectedTask.set(task);
    // this.tasksService.editedTaskId.set(task.id);
    console.log("Contact in task:", task.assignedTo);
    console.log("Task selected:", this.tasksService.selectedTask());
  }
}
