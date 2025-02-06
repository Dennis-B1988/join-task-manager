import { Component, inject, input, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LandingPageComponent } from "../../landing-page.component";

@Component({
  selector: "app-sign-up",
  imports: [FormsModule],
  templateUrl: "./sign-up.component.html",
  styleUrl: "./sign-up.component.scss",
})
export class SignUpComponent {
  signUp = inject(LandingPageComponent);

  name = signal<string>("");
  email = signal<string>("");
  password = signal<string>("");
  confirmPassword = signal<string>("");
  policy = signal<boolean>(false);

  checkPolicy() {
    this.policy.set(!this.policy());
  }

  onSubmit() {
    console.log(
      this.name(),
      this.email(),
      this.password(),
      this.confirmPassword(),
    );
  }

  backToLogIn() {
    this.signUp.signUp.set(false);
  }
}
