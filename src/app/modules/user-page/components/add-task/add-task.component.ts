import { Component, computed, effect, inject, signal } from "@angular/core";
import {
  arrayUnion,
  doc,
  Firestore,
  getDoc,
  onSnapshot,
  updateDoc,
} from "@angular/fire/firestore";
import { AuthService } from "../../../../core/services/auth/auth.service";
import { TasksService } from "../../services/tasks.service";

@Component({
  selector: "app-add-task",
  imports: [],
  templateUrl: "./add-task.component.html",
  styleUrl: "./add-task.component.scss",
})
export class AddTaskComponent {
  tasksService = inject(TasksService);

  addTask() {
    this.tasksService.addTask();
  }
}
