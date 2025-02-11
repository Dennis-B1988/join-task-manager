import { inject, Injectable, signal } from "@angular/core";
import {
  Auth,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signInWithEmailAndPassword,
  updateProfile,
} from "@angular/fire/auth";
import { doc, Firestore, setDoc } from "@angular/fire/firestore";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  // private auth: Auth = inject(Auth);
  // private firestore: Firestore = inject(Firestore);
  // private auth: Auth;
  // private firestore: Firestore;
  private router: Router = inject(Router);
  // user = new User();
  uid = signal("");

  constructor(
    private auth: Auth,
    private firestore: Firestore,
  ) {}

  async createUser(displayName: string, email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password,
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName });

      const userDocRef = doc(this.firestore, "users", user.uid);
      await setDoc(userDocRef, {
        displayName: displayName,
        email: email,
        uid: user.uid,
      });
      console.log("User created and stored in Firestore:", user);
    } catch (error: any) {
      console.error("Error creating user:", error);
    }
  }

  logIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // console.log("User logged in:", user);

        // const userDocRef = doc(this.firestore, "users", user.uid);
        // const userDoc = await getDoc(userDocRef);
        this.uid.set(user.uid);

        return user.uid;
      })
      .catch((error) => {
        console.error("Error during login:", error);
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Error code:", errorCode);
        console.log("Error message:", errorMessage);
      });
  }

  guestLogIn() {
    signInAnonymously(this.auth)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User logged in:", user);
        this.uid.set(user.uid);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  signOut() {
    this.auth
      .signOut()
      .then(() => {
        this.uid.set("");
        this.router.navigate(["/"]);
      })
      .catch((error) => {
        console.error("Error during sign out:", error);
      });
  }
}
