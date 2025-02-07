// export interface User {
//   email: string;
//   username: string;
// }

export class User {
  id: string;
  name: string;
  email: string;
  password: string;

  constructor(obj?: any) {
    this.id = obj?.id || "";
    this.name = obj?.name || "";
    this.email = obj?.email || "";
    this.password = obj?.password || "";
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      mail: this.email,
      password: this.password,
    };
  }
}
