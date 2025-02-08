export class User {
  displayName: string;
  email: string;
  password: string;

  constructor(obj?: any) {
    this.displayName = obj?.name || "";
    this.email = obj?.email || "";
    this.password = obj?.password || "";
  }

  public toJSON() {
    return {
      name: this.displayName,
      mail: this.email,
      password: this.password,
    };
  }
}
