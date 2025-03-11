import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { UserComponent } from "./user/user.component";

@Component({
  selector: "app-header",
  imports: [UserComponent, RouterLink],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
})
export class HeaderComponent {}
