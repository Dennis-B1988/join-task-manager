// export interface User {
//   name: string;
//   email: string;
//   password: string;
// }

export class User {
  // id: string;
  displayName: string;
  email: string;
  password: string;

  constructor(obj?: any) {
    // this.id = obj?.id || "";
    this.displayName = obj?.name || "";
    this.email = obj?.email || "";
    this.password = obj?.password || "";
  }

  public toJSON() {
    return {
      // id: this.id,
      name: this.displayName,
      mail: this.email,
      password: this.password,
    };
  }
}
