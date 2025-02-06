// export interface User {
//   email: string;
//   username: string;
// }

export class UserCollections {
  id: string;
  name: string;
  email: string;
  password: string;

  constructor(obj?: UserCollections) {
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
