import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";

@Component({
  selector: "app-user-page",
  imports: [RouterOutlet, SharedModule],
  templateUrl: "./user-page.component.html",
  styleUrl: "./user-page.component.scss",
})
export class UserPageComponent {}
