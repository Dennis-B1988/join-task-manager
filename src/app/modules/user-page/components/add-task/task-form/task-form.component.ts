import {
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
  runInInjectionContext,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Subtask, Task } from "../../../../../core/models/task.model";
import { AuthService } from "../../../../../core/services/auth/auth.service";
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
export class TaskFormComponent implements OnDestroy {
  private authService = inject(AuthService);
  private tasksService = inject(TasksService);
  private contactsService = inject(ContactsService);
  private subTasksService = inject(SubtasksService);

  private taskStatus = computed(() => this.tasksService.taskStatus());

  today = new Date().toISOString().split("T")[0];

  assignedTo = computed(() => this.contactsService.assignedToTask());
  filterAssignedTo = computed(() =>
    this.assignedTo().map((assigned) => ({
      displayName: assigned.displayName,
    })),
  );

  subTasks = computed(() => this.subTasksService.subTasks());
  selectedTask = computed(() => this.tasksService.selectedTask());
  // editedTaskId = computed(() => this.tasksService.editedTaskId());

  constructor() {
    effect(() => {
      const task = this.selectedTask();
      this.tasksService.editedTaskId.set(task?.id);
      this.tasksService.taskPriority.set(task?.priority || "Medium");
      if (task) {
        this.taskForm.patchValue({
          id: task.id,
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          priority: task.priority || "Medium",
          category: task.category,
          status: task.status,
        });
        // const userId = this.authService.userId();
        // if (userId) this.contactsService.loadContacts(userId);
      }
    });
    setTimeout(() => {
      console.log("Assigned ", this.filterAssignedTo());
    }, 1000);
  }

  taskForm = new FormGroup({
    id: new FormControl<string | null>(null),
    title: new FormControl<string>("", {
      validators: [Validators.required],
    }),
    description: new FormControl<string>("", {}),
    assignedTo: new FormControl<{ displayName: string }[]>([]),
    dueDate: new FormControl<string>("", {
      validators: [Validators.required],
    }),
    priority: new FormControl<string>("", {
      validators: [Validators.required],
    }),
    category: new FormControl<string>("", {
      validators: [Validators.required],
    }),
    subtask: new FormControl<{ open: Subtask[]; done: Subtask[] }>({
      open: [],
      done: [],
    }),
    // subtaskInput: new FormControl(""),
    status: new FormControl<string>("", {}),
  });

  formValid = this.taskForm.controls;

  // editTask = {
  //   title: this.selectedTask()?.title || "",
  //   description: this.selectedTask()?.description || "",
  //   dueDate: this.selectedTask()?.dueDate || "",
  //   priority: this.selectedTask()?.priority || "",
  //   category: this.selectedTask()?.category || "",
  //   status: this.selectedTask()?.status || "",
  // };

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

    const task: Task = {
      title: formValue.title || "",
      description: formValue.description || "",
      assignedTo: this.filterAssignedTo() || [],
      dueDate: formValue.dueDate || "",
      priority: this.tasksService.taskPriority(),
      category: formValue.category || "",
      subtask: subtasks,
      status: this.taskStatus(),
    };

    if (this.selectedTask()) {
      this.tasksService.updateTask(task);
      this.onClear();
      return;
    }

    this.tasksService.addTask(task);
    console.log(task);
    this.onClear();
  }

  onUpdate() {
    console.log("Update clicked");

    if (!this.taskForm.valid) {
      this.taskForm.markAllAsTouched();
      return;
    }
    const formValue = this.taskForm.value;
    const selected = this.selectedTask();

    console.log("Selected task:", selected);

    const updatedTask: Task = {
      id: this.tasksService.editedTaskId(),
      // id: formValue.id!,
      title: formValue.title || "",
      description: formValue.description || "",
      assignedTo: this.filterAssignedTo() || [],
      dueDate: formValue.dueDate || "",
      priority: this.tasksService.taskPriority(),
      category: formValue.category || "",
      subtask: { open: this.subTasks() || [], done: [] },
      status: this.taskStatus(),
    };

    this.tasksService.updateTask(updatedTask);
    console.log("Updated task:", updatedTask);
  }

  ngOnDestroy(): void {
    this.onClear();
  }
}
