import { DestroyRef, inject, Injectable, signal } from "@angular/core";
import {
  Auth,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
  signInAnonymously,
  signInWithEmailAndPassword,
  updateProfile,
  User,
} from "@angular/fire/auth";
import { doc, Firestore, setDoc } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { CustomUser } from "../../models/user.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private router: Router = inject(Router);
  private destroyRef = inject(DestroyRef);

  user = signal<CustomUser | null>(null);
  userId = signal("");
  // private auth: Auth = inject(Auth);
  // private firestore: Firestore = inject(Firestore);
  // private auth: Auth;
  // private firestore: Firestore;
  // user = new User();

  constructor(
    private auth: Auth,
    private firestore: Firestore,
  ) {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      this.user.set(parsedUser);
      this.userId.set(parsedUser.uid);
    }

    const subscribe = this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.setUser(user);
        this.userId.set(user.uid);
        this.router.navigate(["/user", user.uid, "summary"]);
        console.log("User logged in:", user.displayName);
        console.log("User Mail:", user.email);
      } else {
        this.user.set(null);
        this.userId.set("");
      }

      this.destroyRef.onDestroy(() => subscribe());
    });
  }

  private setUser(user: User) {
    const customUser = new CustomUser(user);
    this.user.set(customUser);
    // this.userId.set(user.uid);

    // const customUser = {
    //   displayName: user.displayName ?? "",
    //   email: user.email ?? "",
    //   uid: user.uid,
    // };

    this.user.set(customUser);
    this.userId.set(user.uid);

    localStorage.setItem("user", JSON.stringify(customUser));
  }

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
    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        // console.log(user);
        // console.log(user.displayName);

        // this.user.set(user);
        // this.uid.set(user.uid);

        // return user.uid;
      })
      .catch((error) => {
        console.error("Error during login:", error);
      });
  }

  guestLogIn() {
    signInWithEmailAndPassword(this.auth, "Guest@join.com", "qwer1234")
      .then((userCredential) => {
        const user = userCredential.user;

        // console.log(user);
        // console.log(user.displayName);
        // // this.user.set(user);
        // // this.uid.set(user.uid);

        // console.log(this.user());
        // console.log(this.user()?.displayName);

        // console.log("User logged in:", user.displayName);
        // return user.uid;
      })
      .catch((error) => {
        console.error("Error during guest login:", error);
      });
  }

  signOut() {
    this.auth
      .signOut()
      .then(() => {
        this.userId.set("");
        localStorage.removeItem("user");
        this.router.navigate(["/"]);
      })
      .catch((error) => {
        console.error("Error during sign out:", error);
      });
  }

  // guestLogInAnonymously() {
  //   signInAnonymously(this.auth)
  //     .then((userCredential) => {
  //       const user = userCredential.user;

  //       const userDocRef = doc(this.firestore, "users", user.uid);
  //       setDoc(userDocRef, {
  //         displayName: "Guest",
  //         uid: user.uid,
  //       });

  //       console.log("User logged in:", user);
  //       this.uid.set(user.uid);
  //     })
  //     .catch((error) => {
  //       console.error("Error during guest login:", error);
  //     });
  // }
}
