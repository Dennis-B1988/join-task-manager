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

  userId = computed(() => this.authService.userId());

  /**
   * Constructs a new instance of the TasksService.
   *
   * This constructor sets up an effect that watches the `userId` signal emitted by
   * the `AuthService`. When the user ID changes, the constructor will load the
   * user's task list from Firestore and update the component's `tasks` signal.
   */
  constructor() {
    effect(() => {
      const id = this.userId();
      if (id) {
        this.loadTasks(id);
      }
    });
  }

  /**
   * Loads the user's tasks from Firestore and updates the component's
   * `tasks` signal.
   *
   * @param userId - The ID of the user whose tasks to load.
   */
  private loadTasks(userId: string): void {
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
      });

      this.UnsubscribeService.add(UnsubscribeService);
    });
  }

  /**
   * Adds a new task to the user's task list.
   *
   * @param task - The task to be added.
   * @returns A Promise that resolves when the task is added.
   */
  async addTask(task: Task): Promise<void> {
    const userId = this.authService.userId();
    if (!userId) return;

    const tasksCollection = collection(this.firestore, `users/${userId}/tasks`);

    await addDoc(tasksCollection, task);
  }

  /**
   * Updates an existing task in Firestore for the current user.
   *
   * @param task - The task object containing updated information.
   *               Must include the task's `id` and other fields to update.
   * @returns A Promise that resolves when the task update is complete.
   *          Logs an error message if the task update fails.
   */
  async updateTask(task: Task): Promise<void> {
    try {
      const userId = this.authService.userId();
      if (!userId || !task.id) return;

      const taskDoc = doc(this.firestore, `users/${userId}/tasks`, task.id);
      await setDoc(taskDoc, task);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }

  /**
   * Deletes a task from the user's task list.
   *
   * @param taskId The ID of the task to be deleted.
   * @returns A Promise that resolves when the deletion is complete.
   */
  async deleteTask(taskId: string): Promise<void> {
    const userId = this.authService.userId();
    if (!userId) return;

    const taskDoc = doc(this.firestore, `users/${userId}/tasks`, taskId);
    await deleteDoc(taskDoc);
  }

  /**
   * Updates the priority of a task in the local state.
   * This function is used by the task form component to update the task priority
   * when the user selects a different priority option from the dropdown.
   * @param priority The new priority of the task.
   */
  setTaskPriority(priority: string): void {
    this.taskPriority.set(priority);
  }

  /**
   * Updates the status of a task in the local state.
   * This function is used by the board component to update the task status
   * when a task is dragged and dropped to a different board.
   * @param taskId The id of the task to update.
   * @param newStatus The new status of the task.
   */
  updateLocalTaskStatus(taskId: string, newStatus: string): void {
    const updatedTasks = this.tasks().map((task) => {
      if (task.id === taskId) {
        return { ...task, status: newStatus };
      }
      return task;
    });

    this.tasks.set(updatedTasks);
  }

  /**
   * Updates the search term for tasks.
   * Converts the search input to lowercase and updates the local state.
   *
   * @param search - The search string input by the user.
   */
  searchTask(search: string): void {
    this.searchTaskTerm.set(search.toLowerCase());
  }

  /**
   * Toggles the "add task to board" flag and sets the status of the task to be added
   * to the specified status. This is used by the board component to show the task
   * form component when a user clicks on the "Add task to [status]" button.
   * @param status The new status of the task to be added.
   */
  toggleAddTaskAndSetStatus(status: string): void {
    this.taskStatus.set(status);
    this.addTaskToBoard.set(true);
  }
}
