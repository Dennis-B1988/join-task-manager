import { Component, inject, input, signal } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Subtask } from "../../../../../../../core/models/task.model";
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
  visible: boolean = false;
  // subTasks = signal<Subtask[]>([]);

  // addSubtask() {
  //   const subtaskValue = this.taskForm().get("subtask")?.value;
  //   const subtaskId = crypto.randomUUID();

  //   console.log("Subtask:", subtaskValue, subtaskId);

  //   if (!subtaskValue) return;

  //   this.subTasksService.addSubtask(subtaskValue, subtaskId);
  //   this.taskForm().get("subtask")?.reset();

  //   console.log(this.subTasks());
  // }

  addSubtask() {
    const form = this.taskForm();
    const subtaskValue = form.get("subtask")?.value;
    const subtaskId = crypto.randomUUID();

    if (!subtaskValue) return;

    this.subTasksService.addSubtask(subtaskValue, subtaskId);
    form.get("subtask")?.reset();
    console.log("Subtasks: ", this.subTasks());
  }

  removeSubtask(id: string) {
    this.subTasksService.removeSubtask(id);
    console.log("Subtasks: ", this.subTasks());
  }
}
