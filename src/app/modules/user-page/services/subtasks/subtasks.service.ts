import { effect, inject, Injectable, signal } from "@angular/core";
import {
  arrayUnion,
  doc,
  Firestore,
  onSnapshot,
  updateDoc,
} from "@angular/fire/firestore";
import { Subtask } from "../../../../core/models/task.model";
import { AuthService } from "../../../../core/services/auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class SubtasksService {
  private authService = inject(AuthService);
  private firestore = inject(Firestore);

  subTasks = signal<Subtask[]>([]);

  // constructor() {
  //   effect(() => {
  //     const id = this.authService.userId();
  //     if (id) {
  //       this.loadSubtasks();
  //     }
  //   });
  // }

  // loadSubtasks() {
  //   const userId = this.authService.userId();
  //   if (!userId) return;

  //   const userDoc = doc(this.firestore, "users", userId);

  //   onSnapshot(userDoc, (docSnap) => {
  //     if (docSnap.exists()) {
  //       this.subTasks.set(docSnap.data()?.["tasks"]["subtasks"] || []);
  //     } else {
  //       this.subTasks.set([]);
  //     }
  //   });
  // }

  // addSubtask(subtask: string) {
  //   const userId = this.authService.userId();
  //   if (!userId) return;

  //   const docRef = doc(this.firestore, "users", userId);

  //   this.subTasks.update((tasks) => [...tasks, subtask]);

  //   updateDoc(docRef, { "tasks.subtasks": arrayUnion(subtask) });
  // }

  addSubtask(subtaskValue: string, id: string) {
    this.subTasks.update((tasks) => [...tasks, { id, subtaskValue }]);
    console.log(this.subTasks());
  }

  removeSubtask(id: string) {
    this.subTasks.update((tasks) => tasks.filter((task) => task.id !== id));
    console.log(this.subTasks());
  }

  // moveSubtaskToDone(id: string) {
  //   this.subTasks.update((tasks) => tasks.filter((task) => task.id !== id));
  //   console.log(this.subTasks());
  // }

  // moveSubtaskToOpen(id: string) {
  //   this.subTasks.update((tasks) => tasks.filter((task) => task.id !== id));
  //   console.log(this.subTasks());
  // }

  clearSubtasks() {
    this.subTasks.set([]);
  }
}
