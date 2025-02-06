export class User {
  id: string;
  name: string;
  mail: string;
  password: string;

  constructor(obj?: Partial<User>) {
    this.id = obj?.id || "";
    this.name = obj?.name || "";
    this.mail = obj?.mail || "";
    this.password = obj?.password || "";
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      mail: this.mail,
      password: this.password,
    };
  }
}
