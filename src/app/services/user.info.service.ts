import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { User } from "../models/user";

@Injectable()
export class UserInfoService {
  // Observable string sources
  private userLoggedSource = new Subject<User>();

  // Observable string streams
  userLogged$ = this.userLoggedSource.asObservable();

  // Service message commands
  loginEvent(user: User) {
    this.userLoggedSource.next(user);
  }
}
