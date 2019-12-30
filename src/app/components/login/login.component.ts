import {
  Component,
  OnInit,
  Input,
  Inject,
  ViewChild,
  EventEmitter,
  Output
} from "@angular/core";
import { Http, RequestOptions } from "@angular/http";
import { from } from "rxjs";
import { Router } from "@angular/router";
import { LOCAL_STORAGE, WebStorageService } from "angular-webstorage-service";
import { ElementRef, Renderer2 } from "@angular/core";
import { User } from "src/app/models/user";
import { UserInfoService } from "src/app/services/user.info.service";
import { ToastService } from "../../services/toast-service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  user: User;

  // tslint:disable-next-line: max-line-length
  constructor(
    private http: Http,
    private router: Router,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService,
    private userService: UserInfoService,
    public toastService: ToastService
  ) {
    this.user = new User();
    this.toastService = toastService;
  }

  ngOnInit() {}

  login() {
    this.http
      .post("http://localhost:8082/auth", {
        username: this.user.username,
        password: this.user.password
      })
      .subscribe(
        result => {
          this.toastService.show("Successfully logged", {
            classname: "bg-success text-light",
            delay: 2000
          });
          const userFromDb = result.json();
          localStorage.setItem(
            "currentUser",
            JSON.stringify({ user: userFromDb })
          );
          this.userService.loginEvent(userFromDb);
          this.router.navigateByUrl("/");
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
