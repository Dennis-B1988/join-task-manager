import { Component, computed, inject, OnInit } from "@angular/core";
import { AuthService } from "../../../../core/services/auth/auth.service";
import { SummaryTaskFormComponent } from "./summary-task-form/summary-task-form.component";

@Component({
  selector: "app-summary",
  imports: [SummaryTaskFormComponent],
  templateUrl: "./summary.component.html",
  styleUrl: "./summary.component.scss",
})
export class SummaryComponent implements OnInit {
  private authService = inject(AuthService);
  isMobile: boolean = false;

  userName = computed(() => this.authService.user()?.displayName.split(" ")[0]);

  greetings: string[] = [
    "Good Day,",
    "Good Morning,",
    "Good Afternoon,",
    "Good Evening,",
  ];

  timeOfDay: number = Math.floor(
    (new Date().getHours() / 24) * this.greetings.length,
  );

  greeting = this.greetings[this.timeOfDay];

  ngOnInit() {
    this.updateGreetings();
  }

  private updateGreetings() {
    if (window.innerWidth < 1280) {
      this.isMobile = true;

      setTimeout(() => {
        this.isMobile = false;
      }, 1200);
    }
  }
}
