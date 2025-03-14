import { Component, computed, inject } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Task } from "../../../../../core/models/task.model";
import { ContactsService } from "../../../services/contacts/contacts.service";
import { SubtasksService } from "../../../services/subtasks/subtasks.service";
import { TasksService } from "../../../services/tasks/tasks.service";
import { TaskAssignedToComponent } from "./task-form-components/task-assigned-to/task-assigned-to.component";
import { TaskCategoryComponent } from "./task-form-components/task-category/task-category.component";
import { TaskPriorityComponent } from "./task-form-components/task-priority/task-priority.component";
import { TaskSubtasksComponent } from "./task-form-components/task-subtasks/task-subtasks.component";

@Component({
  selector: "app-task-form",
  imports: [
    ReactiveFormsModule,
    TaskPriorityComponent,
    TaskSubtasksComponent,
    TaskAssignedToComponent,
    TaskCategoryComponent,
  ],
  templateUrl: "./task-form.component.html",
  styleUrl: "./task-form.component.scss",
})
export class TaskFormComponent {
  private tasksService = inject(TasksService);
  private contactsService = inject(ContactsService);
  private subTasksService = inject(SubtasksService);

  today = new Date().toISOString().split("T")[0];

  assignedTo = computed(() => this.contactsService.assignedToTask());
  filterAssignedTo = computed(() =>
    this.assignedTo().map((assigned) => ({
      displayName: assigned.displayName,
      initials: assigned.initials,
    })),
  );
  subTasks = computed(() => this.subTasksService.subTasks());

  taskForm = new FormGroup({
    title: new FormControl<string>("", {
      validators: [Validators.required],
    }),
    description: new FormControl<string>("", {}),
    assignedTo: new FormControl<string>("", {}),
    dueDate: new FormControl<string>("", {
      validators: [Validators.required],
    }),
    category: new FormControl<string>("", {
      validators: [Validators.required],
    }),
    subtask: new FormControl<string>("", {}),
  });

  formValid = this.taskForm.controls;

  // setPriority(prio: string) {
  //   this.priority = prio;
  //   this.tasksService.taskPriority = prio;

  //   console.log(this.tasksService.taskPriority);
  // }

  // blurDropdown() {
  //   this.assignedToOpen = false;
  //   this.categoryOpen = false;
  // }

  // removeFocus(event: FocusEvent) {
  //   const inputElement = event.target as HTMLInputElement;
  //   inputElement.blur();
  // }

  onClear() {
    this.taskForm.reset();
    this.contactsService.assignedToTask.set([]);
    this.tasksService.setTaskPriority("Medium");
    this.subTasksService.clearSubtasks();
  }

  onSubmit() {
    if (!this.taskForm.valid) {
      this.taskForm.markAllAsTouched();
      return;
    }
    const formValue = this.taskForm.value;

    const subtasks = {
      open: this.subTasks() || [],
      done: [],
    };

    const newTask: Task = {
      title: formValue.title || "",
      description: formValue.description || "",
      assignedTo: this.filterAssignedTo() || [],
      dueDate: formValue.dueDate || "",
      priority: this.tasksService.taskPriority(),
      category: formValue.category || "",
      subtask: subtasks,
      status: "To Do",
    };

    this.tasksService.addTask(newTask);
    console.log(newTask);
    this.onClear();
  }
}
