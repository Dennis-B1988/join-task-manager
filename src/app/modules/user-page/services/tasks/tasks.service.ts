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
import { addDoc, collection, deleteDoc, onSnapshot } from "firebase/firestore";
import { Task } from "../../../../core/models/task.model";
import { AuthService } from "../../../../core/services/auth/auth.service";
import { UnsubscripeService } from "../../../../core/services/unsubscripe/unsubscripe.service";

@Injectable({
  providedIn: "root",
})
export class TasksService {
  private authService = inject(AuthService);
  private firestore = inject(Firestore);
  private injector = inject(EnvironmentInjector);
  private unsubscripeService = inject(UnsubscripeService);
  tasks = signal<any[]>([]);

  userId = computed(() => this.authService.userId());

  taskPriority = signal("Medium");

  constructor() {
    effect(() => {
      const id = this.userId();
      if (id) {
        this.loadTasks(id);
      }
    });
  }

  // loadTasks(userId: string) {
  //   const userDoc = doc(this.firestore, "users", userId);

  //   onSnapshot(userDoc, (docSnap) => {
  //     if (docSnap.exists()) {
  //       this.tasks.set(docSnap.data()?.["tasks"] || []);
  //     } else {
  //       this.tasks.set([]);
  //     }
  //   });
  // }

  loadTasks(userId: string) {
    const tasksCollection = collection(this.firestore, `users/${userId}/tasks`);

    runInInjectionContext(this.injector, async () => {
      const unsubscripeService = onSnapshot(tasksCollection, (snapshot) => {
        const tasksData = snapshot.docs.map((doc) => {
          return {
            id: doc.id, // Firestore document ID
            ...(doc.data() as Task), // Explicitly cast doc.data() as Task
          };
        });

        this.tasks.set(tasksData);
        console.log("Tasks loaded:", this.tasks());
      });

      this.unsubscripeService.add(unsubscripeService);
    });
  }

  // async addTask(task: Task) {
  //   const userId = this.authService.userId();
  //   if (!userId) return;

  //   const docRef = doc(this.firestore, "users", this.authService.userId());

  //   const newTask = { ...task, id: new Date().getTime() };

  //   await updateDoc(docRef, { tasks: arrayUnion(newTask) });
  // }

  async addTask(task: Task) {
    const userId = this.authService.userId();
    if (!userId) return;

    const tasksCollection = collection(this.firestore, `users/${userId}/tasks`);

    await addDoc(tasksCollection, task);
    console.log("Task added:", task);
  }

  // async deleteTask(id: number) {
  //   const userId = this.authService.userId();
  //   if (!userId) return;

  //   runInInjectionContext(this.injector, async () => {
  //     const docRef = doc(this.firestore, "users", this.authService.userId());

  //     getDoc(docRef).then((docSnap) => {
  //       if (docSnap.exists()) {
  //         let tasks = docSnap.data()?.["tasks"] || [];
  //         tasks = tasks.filter((task: any) => task.id !== id);

  //         updateDoc(docRef, { tasks });
  //       }
  //     });
  //   });
  // }

  async deleteTask(taskId: string) {
    const userId = this.authService.userId();
    if (!userId) return;

    const taskDocRef = doc(this.firestore, `users/${userId}/tasks/${taskId}`);

    await deleteDoc(taskDocRef);
    console.log("Task deleted:", taskId);
  }

  setTaskPriority(priority: string) {
    this.taskPriority.set(priority);
    console.log("Priority:", this.taskPriority());
  }
}
