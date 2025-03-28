import {
  computed,
  effect,
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
  signal,
} from "@angular/core";
import { doc, Firestore, updateDoc } from "@angular/fire/firestore";
import { addDoc, collection, deleteDoc, onSnapshot } from "firebase/firestore";
import { Task } from "../../../../core/models/task.model";
import { AuthService } from "../../../../core/services/auth/auth.service";
import { UnsubscribeService } from "../../../../core/services/unsubscribe/unsubscribe.service";
import { ContactsService } from "../contacts/contacts.service";

@Injectable({
  providedIn: "root",
})
export class TasksService {
  private authService = inject(AuthService);
  private contactsService = inject(ContactsService);
  private firestore = inject(Firestore);
  private injector = inject(EnvironmentInjector);
  private UnsubscribeService = inject(UnsubscribeService);
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
      const UnsubscribeService = onSnapshot(tasksCollection, (snapshot) => {
        const tasksData = snapshot.docs.map((doc) => {
          const taskData = doc.data() as Task;

          // const updatedAssignedTo = (
          //   Array.isArray(taskData.assignedTo) ? taskData.assignedTo : []
          // ).map((user: any) => ({
          //   ...user,
          //   // color: this.contactsService.generateContactColor(user.displayName),
          // }));

          return {
            id: doc.id, // Firestore document ID
            ...taskData,
            // assignedTo: updatedAssignedTo,
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

  // async addTask(task: Task) {
  // async addTask(task: any) {
  //   const userId = this.authService.userId();
  //   if (!userId) return;

  //   // const tasksCollection = collection(this.firestore, `users/${userId}/tasks`);
  //   try {
  //     const docRef = await addDoc(
  //       collection(this.firestore, `users/${userId}/tasks`),
  //       task,
  //     );

  //     task.id = docRef.id;
  //     return task;
  //   } catch (error) {
  //     console.error("Error adding task:", error);
  //   }

  //   // await addDoc(tasksCollection, task);
  //   // console.log("Task added:", task);
  // }

  // async deleteTask(taskId: string) {
  //   const userId = this.authService.userId();
  //   if (!userId) return;

  //   const taskDocRef = doc(this.firestore, `users/${userId}/tasks/${taskId}`);

  //   await deleteDoc(taskDocRef);
  //   console.log("Task deleted:", taskId);
  // }

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
}
