import { Component } from "@angular/core";

@Component({
  selector: "app-board",
  imports: [],
  templateUrl: "./board.component.html",
  styleUrl: "./board.component.scss",
})
export class BoardComponent {
  constructor() {}

  // Filter for later use
  // tasksQuery = query(
  //   collection(this.firestore, "users", userId, "tasks"),
  //   where("task", "!=", null),
  // );
}
