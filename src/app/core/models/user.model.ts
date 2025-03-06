import { User as FirebaseUser } from "@angular/fire/auth";

export class CustomUser implements Partial<FirebaseUser> {
  displayName: string;
  email: string;
  password?: string;
  uid?: string;
  tasks?: any[] = [];
  contacts?: any[] = [];

  constructor(user?: FirebaseUser, userData?: any) {
    this.displayName = user?.displayName ?? "";
    this.email = user?.email ?? "";
    this.uid = user?.uid ?? "";
    this.tasks = userData?.tasks ?? [];
    this.contacts = userData?.contacts ?? [];
  }

  // constructor(obj?: any) {
  //   this.displayName = obj?.displayName ?? "";
  //   this.email = obj?.email ?? "";
  //   this.password = obj?.password || undefined;
  // }

  // public toJSON() {
  //   return {
  //     displayName: this.displayName,
  //     email: this.email,
  //     password: this.password,
  //   };
  // }
}
