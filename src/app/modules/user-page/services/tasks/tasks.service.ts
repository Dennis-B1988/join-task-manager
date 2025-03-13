import {
  computed,
  effect,
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
  signal,
} from "@angular/core";
import { doc, Firestore } from "@angular/fire/firestore";
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

  loadTasks(userId: string) {
    const tasksCollection = collection(this.firestore, `users/${userId}/tasks`);

    runInInjectionContext(this.injector, async () => {
      const unsubscripeService = onSnapshot(tasksCollection, (snapshot) => {
        const tasksData = snapshot.docs.map((doc) => {
          const taskData = doc.data() as Task;

          const updatedAssignedTo = (
            Array.isArray(taskData.assignedTo) ? taskData.assignedTo : []
          ).map((user: any) => ({
            ...user,
            color: this.generateColor(user.displayName),
          }));

          return {
            id: doc.id, // Firestore document ID
            ...taskData,
            assignedTo: updatedAssignedTo,
          };
        });

        this.tasks.set(tasksData);
        console.log("Tasks loaded:", this.tasks());
      });

      this.unsubscripeService.add(unsubscripeService);
    });
  }

  async addTask(task: Task) {
    const userId = this.authService.userId();
    if (!userId) return;

    const tasksCollection = collection(this.firestore, `users/${userId}/tasks`);

    await addDoc(tasksCollection, task);
    console.log("Task added:", task);
  }

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

  private generateColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    const saturation = 100; // More vibrant colors
    const lightness = 50; // Brighter colors

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
}
