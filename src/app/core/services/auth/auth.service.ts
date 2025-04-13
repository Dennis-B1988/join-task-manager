import {
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
  signal,
} from "@angular/core";
import { Auth, updateProfile, User } from "@angular/fire/auth";
import {
  createUserWithEmailAndPassword,
  signInAnonymously,
  signInWithEmailAndPassword,
} from "@firebase/auth";

import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  setDoc,
} from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { CustomUser } from "../../models/user.model";
import { UnsubscribeService } from "../unsubscribe/unsubscribe.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private router: Router = inject(Router);
  private UnsubscribeService = inject(UnsubscribeService);
  private injector = inject(EnvironmentInjector);

  user = signal<CustomUser | null>(null);
  userId = signal<string>("");

  wrongEmail = signal<boolean>(false);
  wrongPassword = signal<boolean>(false);

  constructor(
    private auth: Auth,
    private firestore: Firestore,
  ) {
    this.auth.onAuthStateChanged(async (user) => {
      if (user) {
        await this.setUser(user);

        if (this.router.url === "/") {
          this.router.navigate(["/summary"]);
        }

        console.log("User logged in:", user.displayName);
        console.log("User Mail:", user.email);
      } else {
        this.router.navigate(["/"]);
        this.user.set(null);
        this.userId.set("");
        console.log("User logged out");
      }
    });

    // this.UnsubscribeService.add(unsubscribe);

    setTimeout(() => {
      console.log("User from auth:", this.user());
    }, 1000);
  }

  private async setUser(user: User): Promise<void> {
    await user.reload();

    const userDocRef = doc(this.firestore, "users", user.uid);

    runInInjectionContext(this.injector, async () => {
      const userDocSnap = await getDoc(userDocRef);

      const userData = userDocSnap.exists() ? userDocSnap.data() : {};

      const tasks = await this.fetchTasks(user.uid);
      const contacts = await this.fetchContacts(user.uid);

      const customUser = new CustomUser(user, { ...userData, tasks, contacts });
      this.user.set(customUser);
      this.userId.set(user.uid);

      console.log("User set:", this.user());
    });
  }

  async createUser(
    displayName: string,
    email: string,
    password: string,
  ): Promise<void> {
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

      await this.setUser(user);
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

      await this.setUser(user);
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

  /**
   * Fetches tasks from the user's Firestore subcollection.
   */
  private async fetchTasks(userId: string): Promise<any[]> {
    const tasksCollection = collection(this.firestore, `users/${userId}/tasks`);

    return runInInjectionContext(this.injector, async () => {
      const tasksSnapshot = await getDocs(tasksCollection);
      return tasksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    });
  }

  /**
   * Fetches contacts from the user's Firestore subcollection.
   */
  private async fetchContacts(userId: string): Promise<any[]> {
    const contactsCollection = collection(
      this.firestore,
      `users/${userId}/contacts`,
    );
    return runInInjectionContext(this.injector, async () => {
      const contactsSnapshot = await getDocs(contactsCollection);

      return contactsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    });
  }

  ngOnDestroy() {
    this.UnsubscribeService.unsubscribeAll();
  }
}
