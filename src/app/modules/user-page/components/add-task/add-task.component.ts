import { Component, inject, signal } from "@angular/core";
import {
  arrayUnion,
  doc,
  Firestore,
  getDoc,
  onSnapshot,
  updateDoc,
} from "@angular/fire/firestore";
import { AuthService } from "../../../../core/services/auth/auth.service";

@Component({
  selector: "app-add-task",
  imports: [],
  templateUrl: "./add-task.component.html",
  styleUrl: "./add-task.component.scss",
})
export class AddTaskComponent {
  authService = inject(AuthService);
  tasks = signal<any>([]);

  constructor(private firestore: Firestore) {
    this.loadTasks();
    onSnapshot(doc(this.firestore, "users", this.authService.userId()), () =>
      this.loadTasks(),
    );
  }

  async loadTasks() {
    const userId = this.authService.userId();
    if (!userId) return;

    const docRef = doc(this.firestore, "users", this.authService.userId());
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      this.tasks.set(docSnap.data()?.["tasks"] || []);
      console.log("Tasks loaded:", this.tasks());
    } else {
      console.log("No tasks found!");
    }
  }

  async addTask() {
    const userId = this.authService.userId();
    if (!userId) return;

    const docRef = doc(this.firestore, "users", this.authService.userId());

    const newTask = {
      id: new Date().getTime(),
      title: "New Task",
      description: "Description",
      priority: "Low",
      status: "To Do",
    };

    await updateDoc(docRef, { tasks: arrayUnion(newTask) });
  }

  async deleteTask(id: number) {
    const userId = this.authService.userId();
    if (!userId) return;

    const docRef = doc(this.firestore, "users", this.authService.userId());

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let tasks = docSnap.data()?.["tasks"] || [];
      tasks = tasks.filter((task: any) => task.id !== id);

      await updateDoc(docRef, { tasks });
    }
  }
}
