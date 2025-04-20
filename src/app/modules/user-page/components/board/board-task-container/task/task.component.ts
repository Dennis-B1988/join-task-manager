import { DragDropModule } from "@angular/cdk/drag-drop";
import { Component, computed, inject, input } from "@angular/core";
import {
  MatProgressBar,
  ProgressBarMode,
} from "@angular/material/progress-bar";
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
  private subtasksService = inject(SubtasksService);
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

  onTaskClick(task: any): void {
    // Delay check slightly to make sure drag end has been processed
    setTimeout(() => {
      if (!this.tasksService.isDragging()) {
        this.editTask(task);
      }
    });
  }

  onDragEnded(): void {
    // Slight delay ensures click isn't triggered too soon after drag ends
    setTimeout(() => {
      this.tasksService.isDragging.set(false);
    }, 100);
  }

  editTask(task: Task) {
    this.contactsService.assignedToTask.set(task.assignedTo);
    this.tasksService.editTask.set(true);
    this.tasksService.selectedTask.set(task);
    this.subtasksService.loadSubtasks(task);
  }
}
