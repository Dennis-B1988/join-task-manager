export class User {
  displayName: string;
  email: string;
  password?: string;

  constructor(obj?: any) {
    this.displayName = obj?.displayName || "";
    this.email = obj?.email || "";
    this.password = obj?.password || undefined;
  }

  public toJSON() {
    return {
      displayName: this.displayName,
      email: this.email,
      password: this.password,
    };
  }
}
