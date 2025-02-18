import { User as FirebaseUser } from "@angular/fire/auth";

export class CustomUser implements Partial<FirebaseUser> {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  password?: string;
  uid?: string;
  tasks?: any[];

  constructor(user?: FirebaseUser) {
    // this.firstName = user?.displayName ?? "";
    this.firstName = "";
    this.lastName = "";
    this.displayName = `${this.firstName} ${this.lastName}`;
    this.email = user?.email ?? "";
    this.uid = user?.uid ?? "";
    this.tasks = [];
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
