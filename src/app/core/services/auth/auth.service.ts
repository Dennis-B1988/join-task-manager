import {
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
  signal,
} from "@angular/core";
import {
  Auth,
  linkWithCredential,
  updateProfile,
  User,
} from "@angular/fire/auth";
import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "@angular/fire/firestore";
import { Router } from "@angular/router";
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  signInAnonymously,
  signInWithEmailAndPassword,
} from "@firebase/auth";
import { dummyTasks } from "../../models/dummy_guest_data.model";
import { CustomUser } from "../../models/user.model";
import { UnsubscribeService } from "../unsubscribe/unsubscribe.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private router: Router = inject(Router);
  private UnsubscribeService = inject(UnsubscribeService);
  private injector = inject(EnvironmentInjector);
  private dummyTasks = dummyTasks;

  user = signal<CustomUser | null>(null);
  userId = signal<string>("");

  wrongEmail = signal<boolean>(false);
  emailUnavailable = signal<boolean>(false);
  wrongPassword = signal<boolean>(false);
  weakPassword = signal<boolean>(false);
  passwordsDontMatch = signal<boolean>(false);

  upgradeMenu = signal<boolean>(false);

  loadingUser = signal<boolean>(false);

  constructor(
    private auth: Auth,
    private firestore: Firestore,
  ) {
    this.auth.onAuthStateChanged((user) => {
      if (!user) {
        this.loadingUser.set(false);
        this.router.navigate(["/"]);
        this.user.set(null);
        this.userId.set("");
        return;
      }

      this.setUser(user).then(() => {
        if (this.router.url === "/") {
          this.router.navigate(["/summary"]);
        }
      });
    });
  }

  private async setUser(user: User): Promise<void> {
    await user.reload();

    runInInjectionContext(this.injector, async () => {
      const [userDocSnap, tasksSnapshot, contactsSnapshot] = await Promise.all([
        getDoc(doc(this.firestore, "users", user.uid)),
        getDocs(collection(this.firestore, `users/${user.uid}/tasks`)),
        getDocs(collection(this.firestore, `users/${user.uid}/contacts`)),
      ]);

      const userData = userDocSnap.exists() ? userDocSnap.data() : {};

      const tasks = tasksSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const contacts = contactsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const customUser = new CustomUser(user, { ...userData, tasks, contacts });
      this.user.set(customUser);
      this.userId.set(user.uid);
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
    this.loadingUser.set(true);
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

      setTimeout(() => {
        this.wrongEmail.set(false);
        this.wrongPassword.set(false);
      }, 2000);
    } finally {
      this.loadingUser.set(false);
    }
  }

  async signInAsGuest(): Promise<void> {
    this.loadingUser.set(true);
    try {
      const userCredential = await signInAnonymously(this.auth);
      const user = userCredential.user;

      await updateProfile(user, { displayName: "Guest" });

      const userDocRef = doc(this.firestore, "users", user.uid);
      await setDoc(userDocRef, {
        displayName: "Guest",
        isGuest: true,
      });
      const contactsRef = collection(
        this.firestore,
        `users/${user.uid}/contacts`,
      );
      await addDoc(contactsRef, {
        displayName: "Guest",
        email: "",
        isSelf: true,
      });

      await this.setUser(user);

      await this.createDummyContacts(user.uid);
      await this.createDummyTasks(user.uid);
    } catch (error) {
      console.error("Error signing in anonymously:", error);
    } finally {
      this.loadingUser.set(false);
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

        const userDocRef = doc(this.firestore, "users", user.uid);
        await setDoc(userDocRef, {
          displayName: "Guest",
          isGuest: true,
        });

        runInInjectionContext(this.injector, async () => {
          await this.upgradeUserData(result.user, displayName, email);
          await this.upgradeContact(result.user, displayName, email);
        });

        await this.setUser(result.user);

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
        }
      }
    } else {
      console.warn("No anonymous user to upgrade.");
    }
  }

  private async upgradeUserData(
    user: User,
    displayName: string,
    email: string,
  ) {
    const userDocRef = doc(this.firestore, "users", user.uid);
    await updateDoc(userDocRef, {
      displayName: displayName,
      email: email,
      isGuest: false,
    });
  }

  private async upgradeContact(user: User, displayName: string, email: string) {
    const contactsRef = collection(
      this.firestore,
      `users/${user.uid}/contacts`,
    );
    const guestQuery = query(contactsRef, where("isSelf", "==", true));

    const snapshot = await getDocs(guestQuery);
    snapshot.forEach(async (docSnap) => {
      await updateDoc(docSnap.ref, {
        displayName: displayName,
        email: email,
      });
    });
  }

  // private async fetchTasks(userId: string): Promise<any[]> {
  //   const tasksCollection = collection(this.firestore, `users/${userId}/tasks`);

  //   return runInInjectionContext(this.injector, async () => {
  //     const tasksSnapshot = await getDocs(tasksCollection);
  //     return tasksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  //   });
  // }

  // private async fetchContacts(userId: string): Promise<any[]> {
  //   const contactsCollection = collection(
  //     this.firestore,
  //     `users/${userId}/contacts`,
  //   );
  //   return runInInjectionContext(this.injector, async () => {
  //     const contactsSnapshot = await getDocs(contactsCollection);

  //     return contactsSnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //   });
  // }

  private async createDummyContacts(userId: string): Promise<void> {
    const contacts = [
      {
        displayName: "Alice Smith",
        email: "alice@example.com",
        phone: "123-456-7890",
      },
      {
        displayName: "Bob Johnson",
        email: "bob@example.com",
        phone: "987-654-3210",
      },
      {
        displayName: "Charlie Brown",
        email: "charlie@example.com",
        phone: "555-555-5555",
      },
      {
        displayName: "David Davis",
        email: "david@example.com",
        phone: "111-222-3333",
      },
    ];

    const contactsRef = collection(this.firestore, `users/${userId}/contacts`);
    for (const contact of contacts) {
      await addDoc(contactsRef, contact);
    }
  }

  private async createDummyTasks(userId: string): Promise<void> {
    const tasksRef = collection(this.firestore, `users/${userId}/tasks`);
    for (const task of this.dummyTasks) {
      await addDoc(tasksRef, task);
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

  ngOnDestroy() {
    this.UnsubscribeService.unsubscribeAll();
  }
}
