import { Component, inject, input } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Task } from "../../../../../core/models/task.model";
import { TasksService } from "../../../services/tasks.service";

@Component({
  selector: "app-task-form",
  imports: [ReactiveFormsModule],
  templateUrl: "./task-form.component.html",
  styleUrl: "./task-form.component.scss",
})
export class TaskFormComponent {
  private tasksService = inject(TasksService);

  urgent: boolean = false;
  medium: boolean = true;
  low: boolean = false;

  taskForm = new FormGroup({
    title: new FormControl<string>("", {
      validators: [Validators.required],
    }),
    description: new FormControl<string>("", {
      validators: [],
    }),
    dueDate: new FormControl<string>("", {
      validators: [Validators.required],
    }),
    category: new FormControl<string>("", {
      validators: [Validators.required],
    }),
  });

  setPriority(prio: string) {
    if (prio === "Urgent") {
      this.urgent = true;
      this.medium = false;
      this.low = false;
      this.tasksService.taskPriority = "Urgent";
    }
    if (prio === "Medium") {
      this.urgent = false;
      this.medium = true;
      this.low = false;
      this.tasksService.taskPriority = "Medium";
    }
    if (prio === "Low") {
      this.urgent = false;
      this.medium = false;
      this.low = true;
      this.tasksService.taskPriority = "Low";
    }
    console.log(this.urgent, this.medium, this.low);
    console.log(this.tasksService.taskPriority);
  }

  onSubmit() {
    if (!this.taskForm.valid) return;

    const newTask: Task = {
      id: new Date().getTime(),
      title: this.taskForm.get("title")?.value!,
      description: this.taskForm.get("description")?.value!,
      dueDate: this.taskForm.get("dueDate")?.value!,
      priority: this.tasksService.taskPriority,
      category: this.taskForm.get("category")?.value!,
      status: "To Do",
    };

    this.tasksService.addTask(newTask);
    console.log(newTask);
    this.taskForm.reset();
  }
}
