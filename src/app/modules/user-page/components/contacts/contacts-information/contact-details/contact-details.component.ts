import { Component, computed, inject } from "@angular/core";
import { NavigationStart, Router } from "@angular/router";
import { filter } from "rxjs";
import { ContactsService } from "../../../../services/contacts/contacts.service";

@Component({
  selector: "app-contact-details",
  imports: [],
  templateUrl: "./contact-details.component.html",
  styleUrl: "./contact-details.component.scss",
})
export class ContactDetailsComponent {
  private contactsService = inject(ContactsService);
  private router = inject(Router);

  showContact = computed(() => this.contactsService.showContact());

  private subscribe = this.router.events
    .pipe(filter((event) => event instanceof NavigationStart))
    .subscribe((event: NavigationStart) => {
      if (!event.url.startsWith("/contacts")) {
        this.contactsService.showContact.set(null);

        console.log("Active contact reset:", this.showContact());
      }
    });

  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }

  getContactColor(name: string): string {
    return this.contactsService.generateContactColor(name);
  }

  getContactInitials(name: string): string {
    return this.contactsService.getInitials(name);
  }
}
