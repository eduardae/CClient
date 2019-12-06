import { OnInit } from "@angular/core";

export class User implements OnInit {
  email: string;
  username: string;
  name: string;
  surname: string;
  password: string;

  constructor() {
    this.username = "";
    this.email = "";
    this.password = "";
  }

  ngOnInit() {}
}
