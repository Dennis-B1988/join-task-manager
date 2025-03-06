import {
  computed,
  effect,
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
  signal,
} from "@angular/core";
import {
  arrayUnion,
  doc,
  Firestore,
  getDoc,
  updateDoc,
} from "@angular/fire/firestore";
import { onSnapshot } from "firebase/firestore";
import { Task } from "../../../../core/models/task.model";
import { AuthService } from "../../../../core/services/auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class TasksService {
  authService = inject(AuthService);
  firestore = inject(Firestore);
  injector = inject(EnvironmentInjector);
  tasks = signal<any[]>([]);

  userId = computed(() => this.authService.userId());

  taskPriority: string = "";

  constructor() {
    effect(() => {
      const id = this.userId();
      if (id) {
        this.loadTasks(id);
      }
    });
  }

  loadTasks(userId: string) {
    const userDoc = doc(this.firestore, "users", userId);

    onSnapshot(userDoc, (docSnap) => {
      if (docSnap.exists()) {
        this.tasks.set(docSnap.data()?.["tasks"] || []);
      } else {
        this.tasks.set([]);
      }
    });
  }

  async addTask(task: Task) {
    const userId = this.authService.userId();
    if (!userId) return;

    const docRef = doc(this.firestore, "users", this.authService.userId());

    const newTask = { ...task, id: new Date().getTime() };

    await updateDoc(docRef, { tasks: arrayUnion(newTask) });
  }

  async deleteTask(id: number) {
    const userId = this.authService.userId();
    if (!userId) return;

    runInInjectionContext(this.injector, async () => {
      const docRef = doc(this.firestore, "users", this.authService.userId());

      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          let tasks = docSnap.data()?.["tasks"] || [];
          tasks = tasks.filter((task: any) => task.id !== id);

          updateDoc(docRef, { tasks });
        }
      });
    });
  }
}
