import { DestroyRef, effect, inject, Injectable, signal } from "@angular/core";
import {
  addDoc,
  collection,
  doc,
  Firestore,
  onSnapshot,
  Unsubscribe,
} from "@angular/fire/firestore";
import { Contact } from "../../../../core/models/contact.model";
import { AuthService } from "../../../../core/services/auth/auth.service";
import { UnsubscripeService } from "../../../../core/services/unsubscripe/unsubscripe.service";

@Injectable({
  providedIn: "root",
})
export class ContactsService {
  private authService = inject(AuthService);
  private firestore = inject(Firestore);
  private unsubscripeService = inject(UnsubscripeService);

  contacts = signal<any[]>([]);
  assignedToTask = signal<any[]>([]);

  constructor() {
    effect(() => {
      const userId = this.authService.userId();
      if (userId) {
        this.loadContacts(userId);
      }
    });
  }

  loadContacts(userId: string) {
    const contactsCollection = collection(
      this.firestore,
      `users/${userId}/contacts`,
    );

    const unsubscribe = onSnapshot(contactsCollection, (snapshot) => {
      const contactsData = snapshot.docs
        .map((doc) => {
          return {
            id: doc.id,
            ...(doc.data() as Contact),
          };
        })
        .sort((a: any, b: any) => a.displayName.localeCompare(b.displayName));

      this.contacts.set(contactsData);

      console.log("Contacts loaded:", contactsData);
    });

    this.unsubscripeService.add(unsubscribe);
  }

  async createContact(contact: any) {
    const userId = this.authService.userId();
    if (!userId) return;

    const contactsCollection = collection(
      this.firestore,
      `users/${userId}/contacts`,
    );

    await addDoc(contactsCollection, contact);
    console.log("Contact created:", contact);
  }

  addContactToTask(contact: any) {
    this.assignedToTask.set([...this.assignedToTask(), contact]);
    console.log(this.assignedToTask());
  }

  removeContactFromTask(contact: any) {
    this.assignedToTask.set(this.assignedToTask().filter((c) => c !== contact));
    console.log(this.assignedToTask());
  }
}
