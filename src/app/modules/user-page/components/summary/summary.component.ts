import { Component } from "@angular/core";
import { SummaryTaskFormComponent } from "./summary-task-form/summary-task-form.component";

@Component({
  selector: "app-summary",
  imports: [SummaryTaskFormComponent],
  templateUrl: "./summary.component.html",
  styleUrl: "./summary.component.scss",
})
export class SummaryComponent {
  name: string = "User Name";
}
