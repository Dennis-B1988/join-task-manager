import { DestroyRef, effect, inject, Injectable, signal } from "@angular/core";
import {
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
      const contactsData = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...(doc.data() as Contact),
        };
      });

      this.contacts.set(contactsData);

      console.log("Contacts loaded:", contactsData);
    });

    this.unsubscripeService.add(unsubscribe);
  }

  // createContact(contact: any) {
  //   const userId = this.authService.userId();
  //   if (!userId) return;

  //   const userDoc = doc(this.firestore, "users", userId);

  //   updateDoc(userDoc, { contacts: arrayUnion(contact) });
  // }

  addContactToTask(contact: any) {
    this.assignedToTask.set([...this.assignedToTask(), contact]);
    console.log(this.assignedToTask());
  }

  removeContactFromTask(contact: any) {
    this.assignedToTask.set(this.assignedToTask().filter((c) => c !== contact));
    console.log(this.assignedToTask());
  }
}
