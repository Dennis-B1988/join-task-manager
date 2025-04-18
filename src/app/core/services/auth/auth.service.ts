import {
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
  signal,
} from "@angular/core";
import {
  Auth,
  getAuth,
  linkWithCredential,
  updateProfile,
  User,
} from "@angular/fire/auth";
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  signInAnonymously,
  signInWithEmailAndPassword,
} from "@firebase/auth";

import {
  addDoc,
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

  isLoading = signal<boolean>(false);

  wrongEmail = signal<boolean>(false);
  emailUnavailable = signal<boolean>(false);
  wrongPassword = signal<boolean>(false);
  weakPassword = signal<boolean>(false);
  passwordsDontMatch = signal<boolean>(false);

  upgradeMenu = signal<boolean>(false);

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

  resetErrorMessages() {
    this.wrongEmail.set(false);
    this.emailUnavailable.set(false);
    this.wrongPassword.set(false);
    this.weakPassword.set(false);
    this.passwordsDontMatch.set(false);
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
      const contactsRef = collection(
        this.firestore,
        `users/${user.uid}/contacts`,
      );
      await addDoc(contactsRef, {
        displayName: user.displayName ?? "Guest",
        email: user.email ?? "",
      });
    } catch (error: any) {
      console.error("Error creating user:", error);
      // this.emailUnavailableError(error);
      if (error.code === "auth/email-already-in-use")
        this.emailUnavailable.set(true);
      if (error.code === "auth/invalid-email") this.wrongEmail.set(true);
      if (error.code === "auth/missing-password") this.wrongPassword.set(true);
      if (error.code === "auth/weak-password") this.wrongPassword.set(true);
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
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.code === "auth/invalid-email") this.wrongEmail.set(true);
      if (error.code === "auth/missing-password") this.wrongPassword.set(true);
      if (error.code === "auth/invalid-credential")
        this.wrongPassword.set(true);
    }
  }

  async signInAsGuest(): Promise<void> {
    try {
      const userCredential = await signInAnonymously(this.auth);
      const user = userCredential.user;

      await updateProfile(user, { displayName: "Guest" });

      const userDocRef = doc(this.firestore, "users", user.uid);
      await setDoc(userDocRef, {
        displayName: "Guest",
        isGuest: true,
      });

      await this.setUser(user);

      // Create dummy data
      await this.createDummyContacts(user.uid);
      await this.createDummyTasks(user.uid);

      console.log("Guest user signed in and data initialized.");
    } catch (error) {
      console.error("Error signing in anonymously:", error);
    }
  }

  async upgradeAnonymousUser(
    displayName: string,
    email: string,
    password: string,
  ): Promise<void> {
    const user = this.auth.currentUser;

    if (user && user.isAnonymous) {
      const credential = EmailAuthProvider.credential(email, password);
      try {
        const result = await linkWithCredential(user, credential);

        await updateProfile(result.user, {
          displayName: displayName,
        });

        await this.setUser(result.user);

        console.log("Upgraded anonymous user with display name:", displayName);

        this.upgradeMenu.set(false);
        this.emailUnavailable.set(false);
      } catch (error) {
        console.error("Error upgrading anonymous user:", error);
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "auth/email-already-in-use"
        ) {
          this.emailUnavailable.set(true);
          console.log("Email already exists");
        }
      }
    } else {
      console.warn("No anonymous user to upgrade.");
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

  async createDummyContacts(userId: string): Promise<void> {
    const contacts = [
      { displayName: "Alice Smith", email: "alice@example.com" },
      { displayName: "Bob Johnson", email: "bob@example.com" },
    ];

    const contactsRef = collection(this.firestore, `users/${userId}/contacts`);
    for (const contact of contacts) {
      await addDoc(contactsRef, contact);
    }
  }

  async createDummyTasks(userId: string): Promise<void> {
    const tasks = [
      {
        title: "Welcome Task",
        description: "Edit or delete this task to get started.",
        dueDate: this.formatDateToYYYYMMDD(new Date()),
        priority: "Urgent",
        category: "Technical Task",
        status: "To Do",
        assignedTo: [{ displayName: "Alice Smith" }],
        subtask: {
          open: [{ done: false, id: "1", subtaskValue: "Dummy subtask" }],
          done: [],
        },
      },
    ];

    const tasksRef = collection(this.firestore, `users/${userId}/tasks`);
    for (const task of tasks) {
      await addDoc(tasksRef, task);
    }
  }

  private formatDateToYYYYMMDD(date: Date): string {
    const futureDate = new Date(date);
    futureDate.setDate(futureDate.getDate() + 5);

    const year = futureDate.getFullYear();
    const month = (futureDate.getMonth() + 1).toString().padStart(2, "0");
    const day = futureDate.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  private emailUnavailableError(error: any): void {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "auth/email-already-in-use"
    ) {
      this.emailUnavailable.set(true);
      console.log("Email already exists");
    }
  }

  private wrongEmailError(error: any): void {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "auth/invalid-email"
    ) {
      this.wrongEmail.set(true);
      console.log("Wrong email");
    }
  }

  private wrongPasswordError(error: any): void {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "auth/invalid-credential"
    ) {
      this.wrongPassword.set(true);
      console.log("Wrong password");
    }
  }

  ngOnDestroy() {
    this.UnsubscribeService.unsubscribeAll();
  }
}
