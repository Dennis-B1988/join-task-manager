import { Component, inject } from "@angular/core";
import { doc, Firestore, setDoc, updateDoc } from "@angular/fire/firestore";
import { collection, query, where } from "firebase/firestore";
import { AuthService } from "../../../../core/services/auth/auth.service";

@Component({
  selector: "app-add-task",
  imports: [],
  templateUrl: "./add-task.component.html",
  styleUrl: "./add-task.component.scss",
})
export class AddTaskComponent {
  authService = inject(AuthService);

  constructor(private firestore: Firestore) {}

  addTask() {
    const task = {
      title: "New Task",
      description: "Description",
      priority: "Low",
      status: "To Do",
    };

    // this.authService.user()?.tasks?.push(task);
    // const newTask = doc(
    //   collection(this.firestore, "users", this.authService.userId(), "tasks"),
    // );
    // setDoc(newTask, task);
    // updateDoc(
    //   doc(
    //     collection(this.firestore, "users", this.authService.userId(), "tasks"),
    //   ),
    //   task,
    // );
    setDoc(
      doc(
        collection(this.firestore, "users", this.authService.userId(), "tasks"),
      ),
      task,
    );

    console.log(this.authService.user()?.tasks);
  }

  seeTasks() {
    const tasksQuery = query(
      collection(this.firestore, "users", this.authService.userId(), "tasks"),
      where("tasks", "!=", null),
    );
    console.log(tasksQuery);
    console.log(this.authService.user()?.tasks);
  }
}
