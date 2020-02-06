import { Injectable, Inject } from "@angular/core";
import { Subject } from "rxjs";
import { User } from "../models/user";
import { Http } from "@angular/http";
import { ToastService } from "./toast-service";
import { SESSION_STORAGE, WebStorageService } from "angular-webstorage-service";
import { HttpClient } from "@angular/common/http";
import { CoinInfo } from "../models/coin-info";
import { Article } from "../models/article";
import { Link } from "../models/Link";
import { LinkSection } from "../models/link-section";
import { _ } from "underscore";

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

  addArticleToLinks(article: Article, user: User, section: LinkSection) {
    let link = new Link();
    link.title = article.title;
    link.section = section;
    link.url = article.url;
    if (!user.saved_links) {
      user.saved_links = [];
      user.saved_links.push(link);
    } else {
      const alreadySavedLinks = _.filter(user.saved_links, function(value) {
        if (value.url === link.url) {
          return value;
        }
      });

      if (alreadySavedLinks.length === 0) {
        user.saved_links.push(link);
        this.http
          .post("http://localhost:8084/user/update/links", user)
          .subscribe(
            result => {
              this.toastService.show("Saved links successfully updated", {
                classname: "bg-success text-light",
                delay: 2000
              });
              this.sessionStorage.set(
                "currentUser",
                JSON.stringify({ user: user })
              );
            },
            err => {
              this.toastService.show(err._body, {
                classname: "bg-danger text-light",
                delay: 3500
              });
            }
          );
      } else {
        this.toastService.show("Link already bookmarked", {
          classname: "bg-warning text-light",
          delay: 3500
        });
      }
    }
  }

  updateLinks(user: User) {
    this.http.post("http://localhost:8084/user/update/links", user).subscribe(
      result => {
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
