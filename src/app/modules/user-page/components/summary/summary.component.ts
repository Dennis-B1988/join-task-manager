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
  firstGreetingMobile = computed(() => this.authService.firstGreetingMobile());

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
   * Updates the greeting state of the component based on the window width.
   *
   * If the window width is less than 1280, it sets the `isMobile` state to true
   * and sets a timeout to set the `isMobile` state to false after 1.2 seconds.
   * This is used to animate the greeting on the summary page. The timeout is
   * cleared when the component is destroyed.
   */
  private updateGreetings(): void {
    if (window.innerWidth < 1280) {
      this.isMobile = true;

      setTimeout(() => {
        this.isMobile = false;
        this.authService.firstGreetingMobile.set(false);
      }, 1200);
    }
  }
}
