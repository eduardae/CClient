import { OnInit } from "@angular/core";

export class User implements OnInit {
  email: string;
  username: string;
  name: string;
  surname: string;
  password: string;
  // tslint:disable-next-line: variable-name
  bookmarked_coins: string[];

  constructor() {
    this.username = "";
    this.email = "";
    this.password = "";
    this.bookmarked_coins = [];
  }

  ngOnInit() {}
}
