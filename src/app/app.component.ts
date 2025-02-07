import { Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AuthService } from "./core/services/auth/auth.service";

@Component({
  selector: "app-root",
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  title = "join-task-manager";

  authService = inject(AuthService);

  // ngOnInit(): void {
  //   // this.authService.user$.subscribe((user) => user);
  //   // console.log(this.authService.currentUserSig());
  // }
}
