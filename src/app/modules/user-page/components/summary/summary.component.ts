import { Component, computed, inject } from "@angular/core";
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
  userName = computed(() => this.authService.user()?.displayName.split(" ")[0]);
}
