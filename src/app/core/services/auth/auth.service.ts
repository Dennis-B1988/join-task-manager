import { DestroyRef, inject, Injectable, signal } from "@angular/core";
import {
  Auth,
  createUserWithEmailAndPassword,
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
  userId = signal<string>("");

  wrongEmail = signal<boolean>(false);
  wrongPassword = signal<boolean>(false);

  constructor(
    private auth: Auth,
    private firestore: Firestore,
  ) {
    const subscribe = this.auth.onAuthStateChanged(async (user) => {
      if (user) {
        await this.setUser(user);

        if (this.router.url === "/") {
          this.router.navigate(["/summary"]);
        }

        console.log("User logged in:", user.displayName);
        console.log("User Mail:", user.email);
      } else {
        console.log("User logged out");
        this.user.set(null);
        this.userId.set("");
      }

      this.destroyRef.onDestroy(() => subscribe());
    });
  }

  private async setUser(user: User) {
    await user.reload();
    const customUser = new CustomUser(user);
    this.user.set(customUser);
    this.userId.set(user.uid);
    console.log("User set:", this.user());
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
        // uid: user.uid,
        tasks: [],
      });
    } catch (error: any) {
      console.error("Error creating user:", error);
    }
  }

  async logIn(email: string, password: string): Promise<void> {
    this.wrongEmail.set(false);
    this.wrongPassword.set(false);
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password,
      );
      const user = userCredential.user;
      // setTimeout(() => {
      //   this.router.navigate(["/summary"]);
      // }, 500);
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.code === "auth/invalid-email") this.wrongEmail.set(true);
      if (error.code === "auth/missing-password") this.wrongPassword.set(true);
      if (error.code === "auth/invalid-credential")
        this.wrongPassword.set(true);
    }
  }

  async guestLogIn(): Promise<void> {
    try {
      const credentials = await signInWithEmailAndPassword(
        this.auth,
        "guest@join.com",
        "qwer1234",
      );
      const user = credentials.user;
      // await this.setUser(user);
      // setTimeout(() => {
      //   this.router.navigate(["/summary"]);
      // }, 500);
    } catch (error) {
      console.error("Login error:", error);
    }
  }

  signOut() {
    this.user.set(null);
    this.userId.set("");

    this.auth
      .signOut()
      .then(() => {
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
