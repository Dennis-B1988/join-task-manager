import { Component, inject, Input, WritableSignal } from "@angular/core";
import { Form, FormGroup } from "@angular/forms";
import { SubtasksService } from "../../../../../services/subtasks/subtasks.service";

@Component({
  selector: "app-task-subtasks",
  imports: [],
  templateUrl: "./task-subtasks.component.html",
  styleUrl: "./task-subtasks.component.scss",
})
export class TaskSubtasksComponent {
  subTasksService = inject(SubtasksService);
  @Input() taskForm!: FormGroup;

  subTasks = this.subTasksService.subTasks;

  addSubtask() {
    if (!this.taskForm.get("subtask")?.value) return;
    this.subTasksService.addSubtask(this.taskForm.get("subtask")?.value);
    console.log(this.subTasks());
  }
}
