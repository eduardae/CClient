import { Component, OnInit, Input, Inject } from "@angular/core";
import { Http } from "@angular/http";
import { CoinsSummary } from "../../models/coins-summary";
import { CoinInfo } from "../../models/coin-info";
import { from } from "rxjs";
import { User } from "../../models/user";
import CryptoJS from "crypto-js";
import {
  LOCAL_STORAGE,
  WebStorageService,
  SESSION_STORAGE
} from "angular-webstorage-service";
import { Router } from "@angular/router";
import { UserInfoService } from "../../services/user.info.service";
import { ToastService } from "../../services/toast-service";
import { environment } from "src/environments/environment";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit {
  user: User;
  passwordConfirmation: string;
  termsAccepted: boolean;

  // tslint:disable-next-line: max-line-length
  constructor(
    private http: Http,
    private router: Router,
    @Inject(SESSION_STORAGE) private sessionStorage: WebStorageService,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.user = new User();
  }

  ngOnInit() {}

  register() {
    let hashedPassword = CryptoJS.SHA256(this.user.password).toString(
      CryptoJS.enc.Hex
    );
    this.http
      .post(`${environment.baseUrl}:8082/register`, {
        username: this.user.username,
        password: hashedPassword,
        email: this.user.email
      })
      .subscribe(
        result => {
          this.toastService.show("User uccessfully registered", {
            classname: "bg-success text-light",
            delay: 2000
          });
          this.sessionStorage.set(
            "currentUser",
            JSON.stringify({ user: this.user })
          );
          this.authService.loginEvent(this.user);
          this.router.navigateByUrl("/");
        },
        err => {
          this.toastService.show(err._body, {
            classname: "bg-danger text-light",
            delay: 5000
          });
        }
      );
  }
}
