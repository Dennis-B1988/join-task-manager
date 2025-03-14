import { Component, inject, input } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { SubtasksService } from "../../../../../services/subtasks/subtasks.service";

@Component({
  selector: "app-task-subtasks",
  imports: [ReactiveFormsModule],
  templateUrl: "./task-subtasks.component.html",
  styleUrl: "./task-subtasks.component.scss",
})
export class TaskSubtasksComponent {
  subTasksService = inject(SubtasksService);
  taskForm = input.required<FormGroup>();

  subTasks = this.subTasksService.subTasks;

  addSubtask() {
    const subtaskValue = this.taskForm().get("subtask")?.value;
    const subtaskId = crypto.randomUUID();

    console.log("Subtask:", subtaskValue, subtaskId);

    if (!subtaskValue) return;

    this.subTasksService.addSubtask(subtaskValue, subtaskId);
    this.taskForm().get("subtask")?.reset();

    console.log(this.subTasks());
  }
}
