import {
  DestroyRef,
  inject,
  Injectable,
  OnChanges,
  signal,
} from "@angular/core";
import {
  Auth,
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
  signInAnonymously,
  signInWithEmailAndPassword,
  updateProfile,
  User,
} from "@angular/fire/auth";
import {
  addDoc,
  collection,
  doc,
  Firestore,
  setDoc,
} from "@angular/fire/firestore";
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
  isLoading = signal(false);

  constructor(
    private auth: Auth,
    private firestore: Firestore,
  ) {
    // const savedUser = localStorage.getItem("user");
    // const rememberMe = localStorage.getItem("rememberMe");
    // if (savedUser && (this.router.url !== "/" || rememberMe)) {
    //   const parsedUser = JSON.parse(savedUser);
    //   this.user.set(parsedUser);
    //   this.userId.set(parsedUser.uid);
    // } else {
    //   this.user.set(null);
    //   this.userId.set("");
    // }

    // setPersistence(this.auth, browserLocalPersistence);

    const subscribe = this.auth.onAuthStateChanged((user) => {
      if (user?.displayName != null) {
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
    this.userId.set(user.uid);

    // localStorage.setItem("user", JSON.stringify(customUser));
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
        tasks: [{}],
      });
      // const tasksCollectionRef = collection(
      //   this.firestore,
      //   "users",
      //   user.uid,
      //   "tasks",
      // );
      // const placeholderTaskRef = doc(tasksCollectionRef, "placeholder");
      // await setDoc(placeholderTaskRef, {});
    } catch (error: any) {
      console.error("Error creating user:", error);
    }
  }

  async logIn(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        this.isLoading.set(true);
        setTimeout(() => {
          this.router.navigate(["/user", user.uid, "summary"]);
          this.isLoading.set(false);
        }, 500);
      })
      .catch((error) => {
        console.error("Error during login:", error);
      });
  }

  async guestLogIn() {
    await signInWithEmailAndPassword(this.auth, "Guest@join.com", "qwer1234")
      .then((userCredential) => {
        const user = userCredential.user;
        setTimeout(() => {
          this.router.navigate(["/user", user.uid, "summary"]);
        }, 500);
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
        this.router.navigate(["/"]);
        if (localStorage.getItem("rememberMe")) {
          return;
        } else {
          localStorage.removeItem("user");
        }
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
