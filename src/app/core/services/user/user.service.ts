import {
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
} from "@angular/core";
import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  query,
  where,
} from "@angular/fire/firestore";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private injector = inject(EnvironmentInjector);

  constructor(private firestore: Firestore) {}

  /**
   * Deletes the guest user and all associated data (tasks and contacts)
   * from Firestore. This is used when the user signs out.
   */
  async deleteGuestUserAndData() {
    await runInInjectionContext(this.injector, async () => {
      const usersRef = collection(this.firestore, "users");
      const guestQuery = query(usersRef, where("displayName", "==", "Guest"));

      const guestSnapshots = await getDocs(guestQuery);

      for (const userDoc of guestSnapshots.docs) {
        const userId = userDoc.id;
        const tasksSnapshot = await runInInjectionContext(this.injector, () =>
          getDocs(collection(this.firestore, `users/${userId}/tasks`)),
        );

        const taskDeletes = tasksSnapshot.docs.map((doc) => deleteDoc(doc.ref));
        const contactsSnapshot = await runInInjectionContext(
          this.injector,
          () => getDocs(collection(this.firestore, `users/${userId}/contacts`)),
        );

        const contactDeletes = contactsSnapshot.docs.map((doc) =>
          deleteDoc(doc.ref),
        );

        await Promise.all([...taskDeletes, ...contactDeletes]);

        await deleteDoc(doc(this.firestore, "users", userId));
      }
    });
  }
}
