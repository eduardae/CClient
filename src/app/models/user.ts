import { OnInit } from "@angular/core";

export class User implements OnInit {
  email: string;
  username: string;
  name: string;
  surname: string;
  password: string;
  token: string;
  // tslint:disable-next-line: variable-name
  bookmarked_coins: string[];
  saved_links: string[];

  constructor() {
    this.username = "";
    this.email = "";
    this.password = "";
    this.bookmarked_coins = [];
    this.saved_links = [];
    this.token = "";
  }

  ngOnInit() {}
}
