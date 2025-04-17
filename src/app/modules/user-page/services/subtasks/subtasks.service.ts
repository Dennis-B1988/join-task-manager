import { Injectable, signal } from "@angular/core";
import { Subtask, Task } from "../../../../core/models/task.model";

@Injectable({
  providedIn: "root",
})
export class SubtasksService {
  subTasks = signal<Subtask[]>([]);

  loadSubtasks(task: Task) {
    if (!task?.subtask) return;

    const allSubtasks = [...(task.subtask.open || [])];
    this.subTasks.set(allSubtasks);
  }

  addSubtask(subtaskValue: string, id: string) {
    this.subTasks.update((tasks) => [
      ...tasks,
      { id, subtaskValue, done: false },
    ]);
    console.log("New subtasks: ", this.subTasks());
  }

  removeSubtask(id: string) {
    this.subTasks.update((tasks) => tasks.filter((task) => task.id !== id));
    console.log(this.subTasks());
  }

  clearSubtasks() {
    this.subTasks.set([]);
  }
}
