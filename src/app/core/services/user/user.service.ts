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
   * Deletes the guest user and all associated data from Firestore.
   *
   * This method should only be called when the user is signing out. It will
   * delete all documents in the `users` collection with the display name of
   * "Guest" and all associated tasks and contacts. This will prevent the guest
   * user from being able to log back in and access their data.
   * @returns A promise that resolves when the deletion is complete.
   */
  async deleteGuestUserAndData(): Promise<void> {
    await runInInjectionContext(this.injector, async () => {
      const usersRef = collection(this.firestore, "users");
      const guestQuery = query(usersRef, where("displayName", "==", "Guest"));

      const guestSnapshots = await getDocs(guestQuery);

      for (const userDoc of guestSnapshots.docs) {
        this.userDocs(userDoc);
      }
    });
  }

  /**
   * Deletes all tasks and contacts associated with a user document.
   *
   * @param userDoc - The user document to delete associated tasks and contacts from.
   * @returns A promise that resolves when all tasks and contacts are deleted.
   */
  async userDocs(userDoc: any) {
    const userId = userDoc.id;
    const tasksSnapshot = await runInInjectionContext(this.injector, () =>
      getDocs(collection(this.firestore, `users/${userId}/tasks`)),
    );

    const taskDeletes = tasksSnapshot.docs.map((doc) => deleteDoc(doc.ref));
    const contactsSnapshot = await runInInjectionContext(this.injector, () =>
      getDocs(collection(this.firestore, `users/${userId}/contacts`)),
    );

    const contactDeletes = contactsSnapshot.docs.map((doc) =>
      deleteDoc(doc.ref),
    );

    await Promise.all([...taskDeletes, ...contactDeletes]);

    await deleteDoc(doc(this.firestore, "users", userId));
  }
}
