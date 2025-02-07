import { inject, Injectable } from "@angular/core";
import { Auth, createUserWithEmailAndPassword } from "@angular/fire/auth";
import { collection, doc, Firestore, setDoc } from "@angular/fire/firestore";
import { User } from "../../models/user.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  user = new User();
  auth: Auth = inject(Auth);
  firestore: Firestore = inject(Firestore);
  // user$ = user(this.firebaseAuth);
  // currentUserSig = signal<User | null | undefined>(null);

  async createUser() {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        this.user.email,
        this.user.password,
      );
      const uid = userCredential.user.uid;
      const usersCollection = collection(this.firestore, "users");
      const userDocRef = doc(usersCollection, uid);
      await setDoc(userDocRef, {
        name: this.user.name,
        mail: this.user.email,
        id: uid,
      });
      console.log("User created and stored in Firestore:", userCredential.user);
    } catch (error: any) {
      console.error("Error creating user:", error);
    }
  }

  // signUp(email: string, username: string, password: string): Observable<void> {
  //   const promise = createUserWithEmailAndPassword(
  //     this.firebaseAuth,
  //     email,
  //     password,
  //   ).then((response) =>
  //     updateProfile(response.user, { displayName: username }),
  //   );

  //   return from(promise);
  // }

  // logIn(email: string, password: string): Observable<void> {
  //   const promise = createUserWithEmailAndPassword(
  //     this.firebaseAuth,
  //     email,
  //     password,
  //   ).then((response) => this.currentUserSig.set(response.user));

  //   console.log(this.currentUserSig());
  //   return from(promise);
  // }
}
