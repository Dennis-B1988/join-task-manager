import { Component, computed, effect, inject, OnDestroy } from "@angular/core";
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
export class TaskFormComponent implements OnDestroy {
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
    priority: new FormControl<string>("", {}),
    category: new FormControl<string>("", {
      validators: [Validators.required],
    }),
    subtask: new FormControl<string>("", {}),
    status: new FormControl<string>("", {}),
  });

  formValid = this.taskForm.controls;

  /**
   * Initializes the TaskFormComponent by setting up an effect to synchronize
   * the form data with the selected task. When a task is selected, the form
   * fields are populated with the task's details such as id, title, description,
   * due date, priority, category, and status. The component also updates the
   * task priority and edited task ID in the TasksService.
   */
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
      }
    });
  }

  /**
   * Resets the task form to its default state, clearing all values from the form fields.
   * This method is used when the user clicks the "Cancel" button or when the
   * component is destroyed to prevent stale data from being persisted.
   */
  onClear(): void {
    this.taskForm.reset();
    this.contactsService.assignedToTask.set([]);
    this.tasksService.setTaskPriority("Medium");
    this.subTasksService.clearSubtasks();
  }

  /**
   * Handles the form submission for creating a new task.
   *
   * This method first validates the form, marking all fields as touched if
   * invalid. If the form is valid, it constructs a new task object using
   * the form values, including details such as title, description, assigned
   * contacts, due date, priority, category, and subtasks. The new task is
   * then added to the task list via the `TasksService`. Finally, the form
   * is cleared to reset the inputs.
   */
  onSubmit(): void {
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

    this.tasksService.addTask(task);
    this.onClear();
  }

  /**
   * Updates the selected task with the current form values.
   *
   * Validates the form before proceeding. If the form is invalid, marks all fields
   * as touched and exits the function. Constructs an updated task object with the
   * form values, including the current subtasks and status. Sends the updated task
   * to the `TasksService` for updating in the database. Once updated, sets the
   * `selectedTask` to the newly updated task.
   */
  onUpdate(): void {
    if (!this.taskForm.valid) {
      this.taskForm.markAllAsTouched();
      return;
    }
    const formValue = this.taskForm.value;
    const selected = this.selectedTask();

    const updatedTask: Task = {
      id: this.tasksService.editedTaskId(),
      title: formValue.title || "",
      description: formValue.description || "",
      assignedTo: this.filterAssignedTo() || [],
      dueDate: formValue.dueDate || "",
      priority: this.tasksService.taskPriority(),
      category: formValue.category || "",
      subtask: {
        open: this.subTasks() || [],
        done: selected?.subtask?.done || [],
      },
      status: this.taskStatus(),
    };

    this.tasksService.updateTask(updatedTask).then(() => {
      this.tasksService.selectedTask.set(updatedTask);
    });
  }

  /**
   * Resets the "addTaskToBoard" observable to false when the component is destroyed.
   * This is used to prevent the task form from being shown after the component
   * is destroyed, such as when the user navigates away from the page.
   */
  ngOnDestroy(): void {
    this.tasksService.addTaskToBoard.set(false);
  }
}
