import { effect, inject, Injectable, signal } from "@angular/core";
import {
  arrayUnion,
  doc,
  Firestore,
  onSnapshot,
  updateDoc,
} from "@angular/fire/firestore";
import { Subtask, Task } from "../../../../core/models/task.model";
import { AuthService } from "../../../../core/services/auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class SubtasksService {
  private authService = inject(AuthService);
  private firestore = inject(Firestore);

  subTasks = signal<Subtask[]>([]);

  loadSubtasks(task: Task) {
    if (!task?.subtask) return;

    const allSubtasks = [
      ...(task.subtask.open || []),
      ...(task.subtask.done || []),
    ];
    this.subTasks.set(allSubtasks);
  }

  addSubtask(subtaskValue: string, id: string) {
    this.subTasks.update((tasks) => [
      ...tasks,
      { id, subtaskValue, done: false },
    ]);
    console.log(this.subTasks());
  }

  removeSubtask(id: string) {
    this.subTasks.update((tasks) => tasks.filter((task) => task.id !== id));
    console.log(this.subTasks());
  }

  clearSubtasks() {
    this.subTasks.set([]);
  }
}
