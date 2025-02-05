import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "../../shared/components/header/header.component";

@Component({
  selector: "app-user-page",
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: "./user-page.component.html",
  styleUrl: "./user-page.component.scss",
})
export class UserPageComponent {}
