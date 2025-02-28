import { effect, inject, Injectable, signal } from "@angular/core";
import { doc, Firestore, onSnapshot } from "@angular/fire/firestore";
import { AuthService } from "../../../../core/services/auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class ContactsService {
  private authService = inject(AuthService);
  private firestore = inject(Firestore);

  contacts = signal<any[]>([]);

  constructor() {
    effect(() => {
      const id = this.authService.userId();
      if (id) {
        this.loadContacts();
      }
    });
  }

  loadContacts() {
    const userId = this.authService.userId();
    if (!userId) return;

    const userDoc = doc(this.firestore, "users", userId);

    onSnapshot(userDoc, (docSnap) => {
      if (docSnap.exists()) {
        this.contacts.set(docSnap.data()?.["contacts"] || []);
      } else {
        this.contacts.set([]);
      }
    });
  }
}
