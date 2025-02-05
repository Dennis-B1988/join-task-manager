import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { UserComponent } from "../../../modules/user-page/user/user.component";

@Component({
  selector: "app-header",
  imports: [UserComponent, RouterLink],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
})
export class HeaderComponent {
  userId = "1";
}
