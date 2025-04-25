import { Injectable, signal } from "@angular/core";
import { Subtask, Task } from "../../../../core/models/task.model";

@Injectable({
  providedIn: "root",
})
export class SubtasksService {
  subTasks = signal<Subtask[]>([]);

  /**
   * Loads the subtasks of a given task into the subTasks signal.
   *
   * @param task - The task whose subtasks are to be loaded.
   *               Expects the task to have a 'subtask' property containing open subtasks.
   *               If no subtasks are found, the function returns without modification.
   */
  loadSubtasks(task: Task): void {
    if (!task?.subtask) return;

    const allSubtasks = [...(task.subtask.open || [])];
    this.subTasks.set(allSubtasks);
  }

  /**
   * Add a new subtask to the list of subtasks for the current task.
   *
   * @param subtaskValue - The value of the new subtask.
   * @param id - The id of the new subtask.
   */
  addSubtask(subtaskValue: string, id: string): void {
    this.subTasks.update((tasks) => [
      ...tasks,
      { id, subtaskValue, done: false },
    ]);
  }

  /**
   * Removes a subtask from the list of subtasks for the current task.
   *
   * @param id - The ID of the subtask to be removed.
   */
  removeSubtask(id: string): void {
    this.subTasks.update((tasks) => tasks.filter((task) => task.id !== id));
  }

  /**
   * Resets the subtasks signal to an empty array.
   * This method should be used when the user navigates away from the current task.
   */
  clearSubtasks(): void {
    this.subTasks.set([]);
  }
}
