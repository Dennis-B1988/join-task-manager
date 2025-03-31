import {
  effect,
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
  signal,
} from "@angular/core";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  onSnapshot,
  setDoc,
} from "@angular/fire/firestore";
import { Contact } from "../../../../core/models/contact.model";
import { AuthService } from "../../../../core/services/auth/auth.service";
import { UnsubscribeService } from "../../../../core/services/unsubscribe/unsubscribe.service";

@Injectable({
  providedIn: "root",
})
export class ContactsService {
  private authService = inject(AuthService);
  private firestore = inject(Firestore);
  private UnsubscribeService = inject(UnsubscribeService);
  private injector = inject(EnvironmentInjector);

  contacts = signal<Contact[]>([]);
  assignedToTask = signal<any[]>([]);
  showContact = signal<Contact | null>(null);
  addContact = signal<boolean>(false);
  editContact = signal<boolean>(false);

  constructor() {
    effect(() => {
      const userId = this.authService.userId();
      if (userId) {
        this.loadContacts(userId);
      }
    });

    setTimeout(() => {
      console.log("Contacts:", this.contacts());
      console.log("Assigned to task:", this.assignedToTask());
    }, 5000);
  }

  loadContacts(userId: string) {
    const contactsCollection = collection(
      this.firestore,
      `users/${userId}/contacts`,
    );

    runInInjectionContext(this.injector, async () => {
      const unsubscribe = onSnapshot(contactsCollection, (snapshot) => {
        const contactsData = snapshot.docs
          .map((doc) => {
            return {
              id: doc.id,
              ...(doc.data() as Contact),
              // color: this.generateContactColor(doc.data()["displayName"]),
            };
          })
          .sort((a: any, b: any) => a.displayName.localeCompare(b.displayName));

        this.contacts.set(contactsData);

        console.log("Contacts loaded:", contactsData);
      });

      this.UnsubscribeService.add(unsubscribe);
    });
  }

  async createContact(contact: any) {
    const userId = this.authService.userId();
    if (!userId) return;

    const contactsCollection = collection(
      this.firestore,
      `users/${userId}/contacts`,
    );

    const { id, ...contactData } = contact;

    await addDoc(contactsCollection, contactData);
    console.log("Contact created:", contactData);
  }

  async updateContact(contact: any) {
    const userId = this.authService.userId();
    if (!userId) return;

    const contactsCollection = collection(
      this.firestore,
      `users/${userId}/contacts`,
    );

    const { id, ...contactData } = contact;

    await setDoc(doc(contactsCollection, id), contactData);
    console.log("Contact updated:", contactData);
  }

  async deleteContact(contactId: string) {
    const userId = this.authService.userId();
    if (!userId) return;

    const contactsCollection = collection(
      this.firestore,
      `users/${userId}/contacts`,
    );

    await deleteDoc(doc(contactsCollection, contactId));
    console.log("Contact deleted:", contactId);
  }

  addContactToTask(contact: any) {
    this.assignedToTask.set([...this.assignedToTask(), contact]);
    console.log(this.assignedToTask());
  }

  removeContactFromTask(contact: any) {
    this.assignedToTask.set(this.assignedToTask().filter((c) => c !== contact));
    console.log(this.assignedToTask());
  }

  generateContactColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    const saturation = 100; // More vibrant colors
    const lightness = 50; // Brighter colors

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  getInitials(name: string) {
    if (!name) return "";

    const names = name.trim().split(" ");

    if (names.length === 1) {
      return names[0][0].toUpperCase();
    }
    return names[0][0].toUpperCase() + names[1][0].toUpperCase();
  }
}
