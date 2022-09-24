import { Injectable, Inject } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { User } from "../models/user";
import { HttpClient } from "@angular/common/http";
import { ToastService } from "./toast-service";
import { SESSION_STORAGE, StorageService } from "ngx-webstorage-service";
import { CoinInfo } from "../models/coin-info";
import { Article } from "../models/article";
import { Link } from "../models/link";
import { LinkSection } from "../models/link-section";
import { _ } from "underscore";
import { environment } from "src/environments/environment";
import { Portfolio } from "../models/portfolio/portfolio";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(
    private http: HttpClient,
    public toastService: ToastService,
    @Inject(SESSION_STORAGE) private sessionStorage: StorageService
  ) {}

  // Observable string sources
  private userLoggedSource = new Subject<User>();

  // Observable string streams
  userLogged$ = this.userLoggedSource.asObservable();

  // Service message commands
  loginEvent(user: User) {
    this.userLoggedSource.next(user);
  }

  refreshToken(user: User) {
    return this.http.post(`${environment.baseUrl}:8082/get_token`, user);
  }
}
