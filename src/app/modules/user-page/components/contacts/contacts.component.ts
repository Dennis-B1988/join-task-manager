import { Component, inject } from "@angular/core";
import { ContactsService } from "../../services/contacts/contacts.service";
import { ContactsContainerComponent } from "./contacts-container/contacts-container.component";
import { ContactsInformationComponent } from "./contacts-information/contacts-information.component";

@Component({
  selector: "app-contacts",
  imports: [ContactsContainerComponent, ContactsInformationComponent],
  templateUrl: "./contacts.component.html",
  styleUrl: "./contacts.component.scss",
})
export class ContactsComponent {}
