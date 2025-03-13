import { effect, inject, Injectable, signal } from "@angular/core";
import {
  arrayUnion,
  doc,
  Firestore,
  onSnapshot,
  updateDoc,
} from "@angular/fire/firestore";
import { AuthService } from "../../../../core/services/auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class SubtasksService {
  private authService = inject(AuthService);
  private firestore = inject(Firestore);

  subTasks = signal<any[]>([]);

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

  addSubtask(subtask: string) {
    this.subTasks.update((tasks) => [...tasks, subtask, open]);
  }

  clearSubtasks() {
    this.subTasks.set([]);
  }
}
