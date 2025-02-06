import { inject, Injectable, signal } from "@angular/core";
import { Auth, createUserWithEmailAndPassword, user } from "@angular/fire/auth";
import { updateProfile, User } from "firebase/auth";
import { from, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  firebaseAuth = inject(Auth);
  user$ = user(this.firebaseAuth);
  currentUserSig = signal<User | null | undefined>(null);

  signUp(email: string, username: string, password: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password,
    ).then((response) =>
      updateProfile(response.user, { displayName: username }),
    );

    return from(promise);
  }

  logIn(email: string, password: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password,
    ).then((response) => this.currentUserSig.set(response.user));

    console.log(this.currentUserSig());
    return from(promise);
  }
}
