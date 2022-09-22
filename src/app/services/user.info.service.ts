import { Injectable, Inject } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { User } from "../models/user";
import { ToastService } from "./toast-service";
import { SESSION_STORAGE, WebStorageService } from "angular-webstorage-service";
import { HttpClient } from "@angular/common/http";
import { CoinInfo } from "../models/coin-info";
import { Article } from "../models/article";
import { Link } from "../models/Link";
import { LinkSection } from "../models/link-section";
import { _ } from "underscore";
import { environment } from "src/environments/environment";
import { Portfolio } from "../models/portfolio/portfolio";

@Injectable()
export class UserInfoService {
  constructor(
    private http: HttpClient,
    public toastService: ToastService,
    @Inject(SESSION_STORAGE) private sessionStorage: WebStorageService
  ) {}

  refreshToken(user: User) {
    return this.http.post(`${environment.baseUrl}:8082/get_token`, user);
  }

  updateSettings(user: User) {
    this.http
      .post(`${environment.baseUrl}:8082/update/settings`, user)
      .subscribe(
        (result) => {
          this.toastService.show("User info updated", {
            classname: "bg-success text-light",
            delay: 2000,
          });
          this.sessionStorage.set(
            "currentUser",
            JSON.stringify({ user: user })
          );
        },
        (err) => {
          this.toastService.show(err._body, {
            classname: "bg-danger text-light",
            delay: 3500,
          });
        }
      );
  }

  updateCoins(selectedCoins: CoinInfo[], user: User) {
    let newBookmarks = [];
    for (let coin of selectedCoins) {
      newBookmarks.push(coin.id);
    }
    user.bookmarked_coins = newBookmarks;
    this.http
      .post(`${environment.baseUrl}:8084/user/update/coins`, user)
      .subscribe(
        (result) => {
          this.toastService.show("User bookmarks successfully updated", {
            classname: "bg-success text-light",
            delay: 2000,
          });
          this.sessionStorage.set(
            "currentUser",
            JSON.stringify({ user: user })
          );
        },
        (err) => {
          this.toastService.show(err._body, {
            classname: "bg-danger text-light",
            delay: 3500,
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
      const alreadySavedLinks = _.filter(user.saved_links, function (value) {
        if (value.url === link.url) {
          return value;
        }
      });

      if (alreadySavedLinks.length === 0) {
        user.saved_links.push(link);
        this.http
          .post(`${environment.baseUrl}:8084/user/update/links`, user)
          .subscribe(
            (result) => {
              this.toastService.show("Saved links successfully updated", {
                classname: "bg-success text-light",
                delay: 2000,
              });
              this.sessionStorage.set(
                "currentUser",
                JSON.stringify({ user: user })
              );
            },
            (err) => {
              this.toastService.show(err._body, {
                classname: "bg-danger text-light",
                delay: 3500,
              });
            }
          );
      } else {
        this.toastService.show("Link already bookmarked", {
          classname: "bg-warning text-light",
          delay: 3500,
        });
      }
    }
  }

  updateLinks(user: User) {
    this.http
      .post(`${environment.baseUrl}:8084/user/update/links`, user)
      .subscribe(
        (result) => {
          this.sessionStorage.set(
            "currentUser",
            JSON.stringify({ user: user })
          );
        },
        (err) => {
          this.toastService.show(err._body, {
            classname: "bg-danger text-light",
            delay: 3500,
          });
        }
      );
  }

  sendPasswordResetMail(user: User) {
    this.http
      .post(`${environment.baseUrl}:8086/user/password_reset_mail`, user)
      .subscribe((result) => {
        console.log(result);
      });
  }

  addPortfolio(user: User, portfolio: Portfolio) {
    this.http
      .post(`${environment.baseUrl}:8085/create_portfolio`, user)
      .subscribe(
        (result) => {
          this.toastService.show("Portfolio created correctly", {
            classname: "bg-danger text-light",
            delay: 3500,
          });
        },
        (err) => {
          this.toastService.show(err._body, {
            classname: "bg-danger text-light",
            delay: 3500,
          });
        }
      );
  }

  getPortfolios(user: User): Observable<Portfolio[]> {
    return this.http.post<Portfolio[]>(
      `${environment.baseUrl}:8085/get_portfolios_by_user`,
      user
    );
  }
}
