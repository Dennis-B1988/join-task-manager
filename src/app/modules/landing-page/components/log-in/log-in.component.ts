import { Component, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-log-in",
  imports: [FormsModule],
  templateUrl: "./log-in.component.html",
  styleUrl: "./log-in.component.scss",
})
export class LogInComponent {
  email = signal<string>("");
  password = signal<string>("");

  onSubmit() {
    console.log(this.email(), this.password());
  }
}
