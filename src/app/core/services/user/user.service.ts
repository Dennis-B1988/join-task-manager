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

  async deleteGuestDocument() {
    const userRef = collection(this.firestore, "users");

    const userQuery = query(userRef, where("displayName", "==", "Guest"));
    runInInjectionContext(this.injector, async () => {
      const querySnapshot = await getDocs(userQuery);

      querySnapshot.forEach(async (document) => {
        await deleteDoc(doc(this.firestore, "users", document.id));
        console.log("Document deleted:", document.id);
      });
    });
  }
}
