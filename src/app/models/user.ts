import { OnInit } from '@angular/core';

export class User implements OnInit {
  email: string;
  username: string;
  password: string;

  constructor() {
    this.username = '';
    this.email = '';
    this.password = '';
   }

  ngOnInit() {

  }

}
