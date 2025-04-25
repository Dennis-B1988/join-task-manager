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

  /**
   * Initializes the component by invoking the updateGreetings method.
   * This method is part of Angular's component lifecycle hooks and is
   * called once the component is initialized. It ensures that the
   * greeting state is updated based on the current window width.
   */
  ngOnInit(): void {
    this.updateGreetings();
  }

  /**
   * Updates the mobile greeting state based on the window's width.
   * If the window is narrower than 1280px, the mobile greeting is shown.
   * After a 1.2 second delay, the mobile greeting is hidden again.
   *
   * This is done to show a mobile-specific greeting only when the user is on a
   * mobile device. The timeout is necessary because the window's width is
   * not immediately available when the component is initialized.
   */
  private updateGreetings(): void {
    if (window.innerWidth < 1280) {
      this.isMobile = true;

      setTimeout(() => {
        this.isMobile = false;
      }, 1200);
    }
  }
}
