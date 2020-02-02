import { Injectable, Inject } from "@angular/core";
import { Subject } from "rxjs";
import { User } from "../models/user";
import { Http } from "@angular/http";
import { ToastService } from "./toast-service";
import { SESSION_STORAGE, WebStorageService } from "angular-webstorage-service";
import { HttpClient } from "@angular/common/http";
import { CoinInfo } from "../models/coin-info";

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

  constructor(
    private http: HttpClient,
    public toastService: ToastService,
    @Inject(SESSION_STORAGE) private sessionStorage: WebStorageService
  ) {}

  updateSettings(user: User) {
    this.http.post("http://localhost:8082/update/settings", user).subscribe(
      result => {
        this.toastService.show("User settings updated", {
          classname: "bg-success text-light",
          delay: 2000
        });
        this.sessionStorage.set("currentUser", JSON.stringify({ user: user }));
      },
      err => {
        this.toastService.show(err._body, {
          classname: "bg-danger text-light",
          delay: 3500
        });
      }
    );
  }

  updateCoins(selectedCoins: CoinInfo[], user: User) {
    let newBookmarks = [];
    for (let coin of selectedCoins) {
      newBookmarks.push(coin.queryId);
    }
    user.bookmarked_coins = newBookmarks;
    this.http.post("http://localhost:8084/user/update/coins", user).subscribe(
      result => {
        this.toastService.show("User bookmarks successfully updated", {
          classname: "bg-success text-light",
          delay: 2000
        });
        this.sessionStorage.set("currentUser", JSON.stringify({ user: user }));
      },
      err => {
        this.toastService.show(err._body, {
          classname: "bg-danger text-light",
          delay: 3500
        });
      }
    );
  }
}
