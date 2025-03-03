import {
  Component,
  computed,
  effect,
  HostListener,
  inject,
  signal,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Task } from "../../../../../core/models/task.model";
import { ContactsService } from "../../../services/contacts/contacts.service";
import { SubtasksService } from "../../../services/subtasks/subtasks.service";
import { TasksService } from "../../../services/tasks.service";
import { TaskPriorityComponent } from "./task-form-components/task-priority/task-priority.component";
import { TaskSubtasksComponent } from "./task-form-components/task-subtasks/task-subtasks.component";

@Component({
  selector: "app-task-form",
  imports: [ReactiveFormsModule, TaskPriorityComponent, TaskSubtasksComponent],
  templateUrl: "./task-form.component.html",
  styleUrl: "./task-form.component.scss",
})
export class TaskFormComponent {
  private tasksService = inject(TasksService);
  private contactsService = inject(ContactsService);
  private subTasksService = inject(SubtasksService);

  priority: string = "Medium";
  today = new Date().toISOString().split("T")[0];
  contacts: string[] = [];
  assignedTo: string[] = [];
  assignedToOpen: boolean = false;
  categories: string[] = ["Technical Task", "User Story"];
  categoryOpen: boolean = false;
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

  // setPriority(prio: string) {
  //   this.priority = prio;
  //   this.tasksService.taskPriority = prio;

  //   console.log(this.tasksService.taskPriority);
  // }

  toggleAssignedTo() {
    this.assignedToOpen = !this.assignedToOpen;
  }

  setContact(contact: string) {
    this.taskForm.get("assignedTo")?.setValue(contact);
    this.assignedToOpen = false;
  }

  toggleCategory() {
    this.categoryOpen = !this.categoryOpen;
    console.log(this.categoryOpen);
  }

  setCategory(category: string) {
    this.taskForm.get("category")?.setValue(category);
    this.categoryOpen = false;
  }

  blurDropdown() {
    this.assignedToOpen = false;
    this.categoryOpen = false;
    console.log(this.assignedToOpen);
  }

  removeFocus(event: FocusEvent) {
    const inputElement = event.target as HTMLInputElement;
    inputElement.blur();
  }

  onClear() {
    this.taskForm.reset();
    this.priority = "Medium";
    // this.taskForm.get("category")?.setValue("");
    this.subTasksService.clearSubtasks();
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
      subtask: this.subTasks(),
      status: "To Do",
    };

    this.tasksService.addTask(newTask);
    console.log(newTask);
    this.onClear();
  }

  @HostListener("document:click", ["$event"])
  closeDropdownOnClickOutside(event: Event) {
    const assignedToInputElement = document.getElementById("assignedTo");
    const categoryInputElement = document.getElementById("category");
    if (
      assignedToInputElement &&
      !assignedToInputElement.contains(event.target as Node)
    ) {
      this.assignedToOpen = false;
    }

    if (
      categoryInputElement &&
      !categoryInputElement.contains(event.target as Node)
    ) {
      this.categoryOpen = false;
    }
  }
}
