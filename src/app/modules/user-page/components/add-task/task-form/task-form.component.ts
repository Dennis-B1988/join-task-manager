import { Component, computed, effect, inject } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Task } from "../../../../../core/models/task.model";
import { ContactsService } from "../../../services/contacts/contacts.service";
import { TasksService } from "../../../services/tasks.service";

@Component({
  selector: "app-task-form",
  imports: [ReactiveFormsModule],
  templateUrl: "./task-form.component.html",
  styleUrl: "./task-form.component.scss",
})
export class TaskFormComponent {
  private tasksService = inject(TasksService);
  private contactsService = inject(ContactsService);

  priority: string = "Medium";
  today = new Date().toISOString().split("T")[0];
  contacts: string[] = [];
  assignedTo: string[] = [];
  assignedToOpen: boolean = false;
  categories: string[] = ["Technical Task", "User Story"];
  categoryOpen: boolean = false;
  subTasks: any[] = [];

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

  constructor() {
    effect(() => {
      this.contacts = this.contactsService
        .contacts()
        .map((contact) => contact.name);
    });
    setTimeout(() => {
      console.log(this.contacts);
    }, 2000);
  }

  setPriority(prio: string) {
    this.priority = prio;
    this.tasksService.taskPriority = prio;

    console.log(this.tasksService.taskPriority);
  }

  setContact(contact: string) {
    this.taskForm.get("assignedTo")?.setValue(contact);
    this.assignedToOpen = false;
  }

  setCategory(category: string) {
    this.taskForm.get("category")?.setValue(category);
    this.categoryOpen = false;
  }

  toggleCategory() {
    this.categoryOpen = !this.categoryOpen;
    console.log(this.categoryOpen);
  }

  removeFocus(event: FocusEvent) {
    const inputElement = event.target as HTMLInputElement;
    inputElement.blur();
  }

  addSubtask(subTask: string) {
    this.subTasks.push(subTask);
    console.log(subTask);
  }

  onClear() {
    this.taskForm.reset();
    this.priority = "Medium";
    this.taskForm.get("category")?.setValue("");
    this.subTasks = [];
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
      assignedTo: this.assignedTo,
      dueDate: formValue.dueDate || "",
      priority: this.tasksService.taskPriority,
      category: formValue.category || "",
      subtask: this.subTasks,
      status: "To Do",
    };

    this.tasksService.addTask(newTask);
    console.log(newTask);
    this.onClear();
  }
}
