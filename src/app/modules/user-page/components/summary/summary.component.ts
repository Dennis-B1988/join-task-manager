import { Component, inject } from "@angular/core";
import { Auth } from "@angular/fire/auth";
import { AuthService } from "../../../../core/services/auth/auth.service";
import { SummaryTaskFormComponent } from "./summary-task-form/summary-task-form.component";

@Component({
  selector: "app-summary",
  imports: [SummaryTaskFormComponent],
  templateUrl: "./summary.component.html",
  styleUrl: "./summary.component.scss",
})
export class SummaryComponent {
  authService = inject(AuthService);
  userName: string = this.authService.user()?.displayName || "";
}
