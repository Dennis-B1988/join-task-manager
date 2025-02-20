import { Injectable } from "@angular/core";
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
  constructor(private firestore: Firestore) {}

  async deleteGuestDocument() {
    const userRef = collection(this.firestore, "users");

    const userQuery = query(userRef, where("displayName", "==", "Anon")); // Change to Guest later
    const querySnapshot = await getDocs(userQuery);

    querySnapshot.forEach(async (document) => {
      await deleteDoc(doc(this.firestore, "users", document.id));
      console.log("Document deleted:", document.id);
    });

    console.log("Guest document deleted.");
  }
}
