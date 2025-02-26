import { Component, inject } from "@angular/core";
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

  priority: string = "Medium";

  assignedToOpen: boolean = false;
  categoryOpen: boolean = false;
  today = new Date().toISOString().split("T")[0];

  taskForm = new FormGroup({
    title: new FormControl<string>("", {
      validators: [Validators.required],
    }),
    description: new FormControl<string>("", {}),
    dueDate: new FormControl<string>("", {
      validators: [Validators.required],
    }),
    category: new FormControl<string>("", {
      validators: [Validators.required],
    }),
  });

  setPriority(prio: string) {
    this.priority = prio;
    this.tasksService.taskPriority = prio;
    // if (prio === "Urgent") {
    //   this.urgent = true;
    //   this.medium = this.low = false;
    //   this.tasksService.taskPriority = "Urgent";
    // }
    // if (prio === "Medium") {
    //   this.medium = true;
    //   this.urgent = this.low = false;
    //   this.tasksService.taskPriority = "Medium";
    // }
    // if (prio === "Low") {
    //   this.low = true;
    //   this.urgent = this.medium = false;
    //   this.tasksService.taskPriority = "Low";
    // }
    // console.log(this.urgent, this.medium, this.low);
    console.log(this.tasksService.taskPriority);
  }

  onSubmit() {
    if (!this.taskForm.valid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const formValue = this.taskForm.value;
    const newTask: Task = {
      id: new Date().getTime(),
      title: formValue.title || "",
      description: formValue.description || "",
      dueDate: formValue.dueDate || "",
      priority: this.tasksService.taskPriority,
      category: formValue.category || "",
      status: "To Do",
    };

    this.tasksService.addTask(newTask);
    console.log(newTask);
    this.taskForm.reset();
  }

  onClear() {
    this.taskForm.reset();
    this.taskForm.get("category")?.setValue("");
    this.priority = "Medium";
  }

  get assignedToDropdown() {
    if (!this.assignedToOpen) {
      return "assets/img/arrow_dropdown_down.png";
    } else {
      return "assets/img/arrow_dropdown_up.png";
    }
  }

  get categoryDropdown() {
    if (!this.categoryOpen) {
      return "assets/img/arrow_dropdown_down.png";
    } else {
      return "assets/img/arrow_dropdown_up.png";
    }
  }

  toggleAssignedToDropdown() {
    this.assignedToOpen = !this.assignedToOpen;
  }

  toggleCategoryDropdown() {
    this.categoryOpen = !this.categoryOpen;
  }
}
