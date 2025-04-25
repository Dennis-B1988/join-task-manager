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
import { dummyContacts, dummyTasks } from "../../models/dummy_guest_data.model";
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
  private dummyContacts = dummyContacts;

  user = signal<CustomUser | null>(null);
  userId = signal<string>("");

  wrongEmail = signal<boolean>(false);
  emailUnavailable = signal<boolean>(false);
  wrongPassword = signal<boolean>(false);
  weakPassword = signal<boolean>(false);
  passwordsDontMatch = signal<boolean>(false);

  upgradeMenu = signal<boolean>(false);

  loadingUser = signal<boolean>(false);

  /**
   * Constructs a new instance of the AuthService.
   *
   * This constructor sets up an authentication state listener to monitor changes
   * in the user's authentication status. If the user is not authenticated, it
   * redirects to the root path and resets the user and userId properties.
   * If the user is authenticated, it reloads the user's data from Firestore
   * and navigates to the summary page if the current URL is the root path.
   *
   * @param auth - The Firebase Auth service used for authentication state changes.
   * @param firestore - The Firestore service used for interacting with the database.
   */
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

  /**
   * Sets the user property of the AuthService to a new user by reloading their
   * data from Firestore and creating a new CustomUser instance with the data.
   *
   * @param user - The user whose data to load.
   * @returns A Promise that resolves when the user is set.
   */
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

  /**
   * Creates a new user with the specified display name, email, and password.
   * Stores the user's data in Firestore and creates a new contact document
   * with the user's own information.
   *
   * @param displayName - The display name of the user.
   * @param email - The email address of the user.
   * @param password - The password of the user.
   * @returns A Promise that resolves when the user is created.
   */
  async createUser(
    displayName: string,
    email: string,
    password: string,
  ): Promise<void> {
    this.loadingUser.set(true);

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
    } finally {
      this.loadingUser.set(false);
    }
  }

  /**
   * Logs in a user with the specified email and password.
   *
   * @param email - The email address of the user to log in.
   * @param password - The password for the user to log in.
   * @returns A Promise that resolves when the log-in is complete.
   */
  async logIn(email: string, password: string): Promise<void> {
    this.resetErrorMessages();
    this.loadingUser.set(true);

    try {
      const { user } = await signInWithEmailAndPassword(
        this.auth,
        email,
        password,
      );
      await this.setUser(user);
    } catch (error: any) {
      this.handleError(error);
    } finally {
      this.loadingUser.set(false);
    }
  }

  /**
   * Resets all error messages in the AuthService to false.
   * This is called after every log-in or sign-up attempt to clear any
   * previously set error messages.
   */
  resetErrorMessages(): void {
    this.wrongEmail.set(false);
    this.emailUnavailable.set(false);
    this.wrongPassword.set(false);
    this.weakPassword.set(false);
    this.passwordsDontMatch.set(false);
  }

  /**
   * Handles an error that occurred while logging in a user.
   *
   * @param error - The error that occurred while logging in the user.
   * @returns Nothing.
   *
   * This method logs the error to the console, sets the proper error message
   * state variables to true, and then sets all error messages to false after
   * 2 seconds to clear the error message.
   */
  private handleError(error: any): void {
    console.error("Login error:", error);
    if (error.code === "auth/invalid-email") this.wrongEmail.set(true);
    if (
      error.code === "auth/missing-password" ||
      error.code === "auth/invalid-credential"
    ) {
      this.wrongPassword.set(true);
    }

    setTimeout(this.resetErrorMessages.bind(this), 2000);
  }

  /**
   * Signs in as a guest user, creating a new user document with the name
   * "Guest" and creating dummy contacts and tasks for the user.
   *
   * @returns A promise that resolves when the sign-in is complete.
   */
  async signInAsGuest(): Promise<void> {
    this.loadingUser.set(true);

    try {
      const userCredential = await signInAnonymously(this.auth);
      const user = userCredential.user;

      await updateProfile(user, { displayName: "Guest" });

      const userDocRef = doc(this.firestore, "users", user.uid);
      await setDoc(userDocRef, { displayName: "Guest", isGuest: true });

      const contactsCollectionRef = collection(
        this.firestore,
        `users/${user.uid}/contacts`,
      );
      await addDoc(contactsCollectionRef, {
        displayName: "Guest",
        email: "",
        isSelf: true,
      });

      await this.setUser(user);

      await this.createDummyContacts(user.uid);
      await this.createDummyTasks(user.uid);
    } finally {
      this.loadingUser.set(false);
    }
  }

  /**
   * Upgrades an anonymous user to a full user by linking their
   * anonymous account to an email/password account.
   *
   * @param displayName - The display name of the user.
   * @param email - The email address to use for the new account.
   * @param password - The password to use for the new account.
   * @returns A Promise that resolves when the upgrade is complete.
   */
  async upgradeAnonymousUser(
    displayName: string,
    email: string,
    password: string,
  ): Promise<void> {
    const currentUser = this.auth.currentUser;

    if (currentUser && currentUser.isAnonymous) {
      const emailCredential = EmailAuthProvider.credential(email, password);
      try {
        const linkedUser = await linkWithCredential(
          currentUser,
          emailCredential,
        );

        await updateProfile(linkedUser.user, { displayName });

        const userDocumentRef = doc(
          this.firestore,
          "users",
          linkedUser.user.uid,
        );
        await setDoc(userDocumentRef, {
          displayName,
          isGuest: false,
        });

        await runInInjectionContext(this.injector, async () => {
          await this.upgradeUserData(linkedUser.user, displayName, email);
          await this.upgradeContact(linkedUser.user, displayName, email);
        });

        await this.setUser(linkedUser.user);
        this.upgradeMenu.set(false);
        this.emailUnavailable.set(false);
      } catch (error: any) {
        if (error?.code === "auth/email-already-in-use") {
          this.emailUnavailable.set(true);
        }
      }
    } else {
      console.warn("No anonymous user to upgrade.");
    }
  }

  /**
   * Updates the user data in Firestore when an anonymous user upgrades
   * their account. This function is called internally by the AuthService
   * and should not be used directly.
   *
   * @param user The Firebase User object
   * @param displayName The new display name of the user
   * @param email The new email address of the user
   */
  private async upgradeUserData(
    user: User,
    displayName: string,
    email: string,
  ): Promise<void> {
    const userDocRef = doc(this.firestore, "users", user.uid);
    await updateDoc(userDocRef, {
      displayName: displayName,
      email: email,
      isGuest: false,
    });
  }

  /**
   * Updates the contact information of a user in Firestore.
   *
   * This function queries the user's contacts to find the contact document
   * marked as "isSelf", indicating that the contact represents the user themselves.
   * It then updates the contact's `displayName` and `email` fields with the provided
   * values.
   *
   * @param user - The user whose contact information is to be updated.
   * @param displayName - The new display name to set for the user's contact.
   * @param email - The new email to set for the user's contact.
   * @returns A Promise that resolves when the contact information update is complete.
   */
  private async upgradeContact(
    user: User,
    displayName: string,
    email: string,
  ): Promise<void> {
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

  /**
   * Creates dummy contacts for a user in Firestore.
   *
   * @param userId - The ID of the user to create dummy contacts for.
   * @returns A Promise that resolves when the dummy contacts creation is complete.
   */
  private async createDummyContacts(userId: string): Promise<void> {
    const contactsRef = collection(this.firestore, `users/${userId}/contacts`);
    for (const contact of this.dummyContacts) {
      await addDoc(contactsRef, contact);
    }
  }

  /**
   * Creates dummy tasks for a user in Firestore.
   *
   * @param userId - The ID of the user for whom to create dummy tasks.
   * @returns A Promise that resolves when all dummy tasks are created.
   */
  private async createDummyTasks(userId: string): Promise<void> {
    const tasksRef = collection(this.firestore, `users/${userId}/tasks`);
    for (const task of this.dummyTasks) {
      await addDoc(tasksRef, task);
    }
  }

  /**
   * Signs out the current user and navigates to the home page.
   *
   * 1. Resets the user signal to null.
   * 2. Resets the userId signal to an empty string.
   * 3. Calls the AngularFire signOut method.
   * 4. If the sign out is successful, navigates to the home page.
   * 5. If there is an error during sign out, logs the error to the console.
   */
  signOut(): void {
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
   * Unsubscribes all subscriptions created by the AuthService when the
   * component is destroyed.
   */
  ngOnDestroy(): void {
    this.UnsubscribeService.unsubscribeAll();
  }
}
