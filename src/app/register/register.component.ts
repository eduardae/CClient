import { Component, OnInit, Input, Inject } from "@angular/core";
import { Http } from "@angular/http";
import { CoinsSummary } from "../models/coins-summary";
import { CoinInfo } from "../models/coin-info";
import { from } from "rxjs";
import { User } from "../models/user";
import { LOCAL_STORAGE, WebStorageService } from "angular-webstorage-service";
import { Router } from "@angular/router";
import { UserInfoService } from "../user.info.service";
import { ToasterService } from "angular2-toaster";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit {
  user: User;
  passwordConfirmation: string;
  termsAccepted: boolean;
  toasterService: ToasterService;

  // tslint:disable-next-line: max-line-length
  constructor(
    private http: Http,
    private router: Router,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService,
    private userService: UserInfoService,
    toasterService: ToasterService
  ) {
    this.user = new User();
    this.toasterService = toasterService;
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
          this.toasterService.pop(
            "success",
            "User created!",
            "You can now login"
          );
          localStorage.setItem(
            "currentUser",
            JSON.stringify({ user: this.user })
          );
          this.userService.loginEvent(this.user);
          this.router.navigateByUrl("/");
        },
        err => {
          console.log(err);
          this.toasterService.pop("success", "Error!", err);
        }
      );
  }
}
