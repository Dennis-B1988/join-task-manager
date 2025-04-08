import {
  computed,
  effect,
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
  signal,
} from "@angular/core";
import { deleteDoc, doc, Firestore, setDoc } from "@angular/fire/firestore";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { Task } from "../../../../core/models/task.model";
import { AuthService } from "../../../../core/services/auth/auth.service";
import { UnsubscribeService } from "../../../../core/services/unsubscribe/unsubscribe.service";

@Injectable({
  providedIn: "root",
})
export class TasksService {
  private authService = inject(AuthService);
  private firestore = inject(Firestore);
  private injector = inject(EnvironmentInjector);
  private UnsubscribeService = inject(UnsubscribeService);
  tasks = signal<any[]>([]);
  taskPriority = signal<string>("Medium");
  taskStatus = signal<string>("To Do");
  addTaskToBoard = signal<boolean>(false);
  editTask = signal<boolean>(false);
  editedTaskId = signal<string | undefined>(undefined);
  selectedTask = signal<Task | null>(null);
  searchTaskTerm = signal<string>("");
  isDragging = signal<boolean>(false);
  // searchTaskList = signal<Task[]>([]);

  userId = computed(() => this.authService.userId());

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
      const UnsubscribeService = onSnapshot(tasksCollection, (snapshot) => {
        const tasksData = snapshot.docs.map((doc) => {
          const taskData = doc.data() as Task;

          return {
            id: doc.id, // Firestore document ID
            ...taskData,
          };
        });

        this.tasks.set(tasksData);
        console.log("Tasks loaded:", this.tasks());
      });

      this.UnsubscribeService.add(UnsubscribeService);
    });
  }

  async addTask(task: Task) {
    const userId = this.authService.userId();
    if (!userId) return;

    const tasksCollection = collection(this.firestore, `users/${userId}/tasks`);

    await addDoc(tasksCollection, task);
    console.log("Task added:", task);
  }

  async updateTask(task: Task) {
    try {
      const userId = this.authService.userId();
      console.log("userId:", userId, "task.id:", task.id);
      if (!userId || !task.id) return;

      const taskDoc = doc(this.firestore, `users/${userId}/tasks`, task.id);
      await setDoc(taskDoc, task);
      console.log("Task updated:", task);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }

  async deleteTask(taskId: string) {
    const userId = this.authService.userId();
    if (!userId) return;

    const taskDoc = doc(this.firestore, `users/${userId}/tasks`, taskId);
    await deleteDoc(taskDoc);
  }

  setTaskPriority(priority: string) {
    this.taskPriority.set(priority);
    console.log("Priority:", this.taskPriority());
  }

  updateLocalTaskStatus(taskId: string, newStatus: string): void {
    // Create a new array to avoid direct mutation
    const updatedTasks = this.tasks().map((task) => {
      if (task.id === taskId) {
        // Create a new task object with the updated status
        return { ...task, status: newStatus };
      }
      return task;
    });

    // Update the signal with the new tasks array
    this.tasks.set(updatedTasks);
  }

  // searchTask(search: string) {
  //   this.searchTaskTerm.set(search);

  //   if (search.length === 0) {
  //     this.searchTaskList.set([]);
  //     return;
  //   }

  //   const filteredTasks = this.tasks().filter((task) => {
  //     return task.title.toLowerCase().includes(search.toLowerCase());
  //   });

  //   this.searchTaskList.set(filteredTasks);
  // }
  searchTask(search: string) {
    this.searchTaskTerm.set(search.toLowerCase());
  }
}
