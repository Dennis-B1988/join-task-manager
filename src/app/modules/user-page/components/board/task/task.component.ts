import { DragDropModule } from "@angular/cdk/drag-drop";
import { Component, computed, input } from "@angular/core";
import {
  MatProgressBar,
  ProgressBarMode,
} from "@angular/material/progress-bar";
import { Contact } from "../../../../../core/models/contact.model";
import { Task } from "../../../../../core/models/task.model";

@Component({
  selector: "app-task",
  imports: [MatProgressBar, DragDropModule],
  templateUrl: "./task.component.html",
  styleUrl: "./task.component.scss",
})
export class TaskComponent {
  task = input.required<Task>();
  contact: Contact[] = [];

  mode: ProgressBarMode = "determinate";

  color: string = "#1FD7C1";

  getOpenSubtasks(task: any): string {
    return task.subtask?.open || [];
  }

  getDoneSubtasks(task: any): string {
    return task.subtask?.done || [];
  }

  getContactColor(name: string): string {
    const contact = this.contact.find((c) => c.displayName === name);
    if (contact) {
      return contact.color;
    }

    return this.generateColor(name);
  }

  private generateColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    const saturation = 100; // More vibrant colors
    const lightness = 50; // Brighter colors

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
}
