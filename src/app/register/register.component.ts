import { Component, OnInit, Input, Inject } from "@angular/core";
import { Http } from "@angular/http";
import { CoinsSummary } from "../models/coins-summary";
import { CoinInfo } from "../models/coin-info";
import { from } from "rxjs";
import { User } from "../models/user";
import { LOCAL_STORAGE, WebStorageService } from "angular-webstorage-service";
import { Router } from "@angular/router";
import { UserInfoService } from "../user.info.service";
import { ToastService } from "../toast/toast-service";

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
    @Inject(LOCAL_STORAGE) private storage: WebStorageService,
    private userService: UserInfoService,
    private toastService: ToastService
  ) {
    this.user = new User();
  }

  ngOnInit() {}

  register() {
    this.http
      .post("http://localhost:8082/register", {
        username: this.user.username,
        password: this.user.password,
        email: this.user.email
      })
      .subscribe(
        result => {
          this.toastService.show("User uccessfully registered", {
            classname: "bg-success text-light",
            delay: 2000
          });
          localStorage.setItem(
            "currentUser",
            JSON.stringify({ user: this.user })
          );
          this.userService.loginEvent(this.user);
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
