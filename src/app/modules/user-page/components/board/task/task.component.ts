import { DragDropModule } from "@angular/cdk/drag-drop";
import { Component, inject, input } from "@angular/core";
import {
  MatProgressBar,
  ProgressBarMode,
} from "@angular/material/progress-bar";
import { Contact } from "../../../../../core/models/contact.model";
import { Task } from "../../../../../core/models/task.model";
import { ContactsService } from "../../../services/contacts/contacts.service";

@Component({
  selector: "app-task",
  imports: [MatProgressBar, DragDropModule],
  templateUrl: "./task.component.html",
  styleUrl: "./task.component.scss",
})
export class TaskComponent {
  contactsService = inject(ContactsService);
  task = input.required<Task>();

  mode: ProgressBarMode = "determinate";

  getOpenSubtasks(task: any): string {
    return task.subtask?.open || [];
  }

  getDoneSubtasks(task: any): string {
    return task.subtask?.done || [];
  }

  getContactColor(name: string): string {
    return this.contactsService.generateContactColor(name);
  }
}
