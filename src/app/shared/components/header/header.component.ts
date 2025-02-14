import { Component } from "@angular/core";
import { UserComponent } from "./user/user.component";

@Component({
  selector: "app-header",
  imports: [UserComponent],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
})
export class HeaderComponent {}
