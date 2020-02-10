import { Link } from "./Link";

export class User {
  _id: string;
  email: string;
  username: string;
  name: string;
  surname: string;
  password: string;
  token: string;
  // tslint:disable-next-line: variable-name
  bookmarked_coins: string[];
  saved_links: Link[];

  constructor() {
    this._id = null;
    this.username = "";
    this.email = "";
    this.password = "";
    this.bookmarked_coins = [];
    this.saved_links = [];
    this.token = "";
  }
}
