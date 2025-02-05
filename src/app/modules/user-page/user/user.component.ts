import { Component, computed, input } from "@angular/core";
import { User } from "../../../core/models/user.model";

@Component({
  selector: "app-user",
  imports: [],
  templateUrl: "./user.component.html",
  styleUrl: "./user.component.scss",
})
export class UserComponent {
  // user = input.required<User>();
  // imagePath = computed(() => "users/" + this.user().avatar);
}
