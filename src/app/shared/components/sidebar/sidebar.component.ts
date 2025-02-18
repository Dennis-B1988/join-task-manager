import { Component, inject, input } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from "../../../core/services/auth/auth.service";

@Component({
  selector: "app-sidebar",
  imports: [RouterLink, RouterLinkActive],
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.scss",
})
export class SidebarComponent {
  authService = inject(AuthService);
  userId = this.authService.userId();
  // userId = input<string>();

  summaryPath: string = "assets/img/summary.png";
  summaryPathActive: string = "assets/img/summary-hover.png";
  summaryCurrentPath: string = this.summaryPath;

  addTasksPath: string = "assets/img/add-task.png";
  addTasksPathActive: string = "assets/img/add-task-hover.png";
  addTasksCurrentPath: string = this.addTasksPath;

  boardPath: string = "assets/img/board.png";
  boardPathActive: string = "assets/img/board-hover.png";
  boardCurrentPath: string = this.boardPath;

  contactsPath: string = "assets/img/contacts.png";
  contactsPathActive: string = "assets/img/contacts-hover.png";
  contactsCurrentPath: string = this.contactsPath;
}
