import {
  Component,
  OnInit,
  Input,
  Inject,
  ViewChild,
  EventEmitter,
  Output
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { from } from "rxjs";
import { Router } from "@angular/router";
import {
  LOCAL_STORAGE,
  StorageService,
  SESSION_STORAGE
} from "ngx-webstorage-service";
import { ElementRef, Renderer2 } from "@angular/core";
import { User } from "src/app/models/user";
import { UserInfoService } from "src/app/services/user.info.service";
import { ToastService } from "../../services/toast-service";
import { environment } from "../../../environments/environment";
import { AuthService } from "src/app/services/auth.service";
import CryptoJS from "crypto-js";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  user: User;

  // tslint:disable-next-line: max-line-length
  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private authService: AuthService,
    public toastService: ToastService
  ) {
    this.user = new User();
    this.toastService = toastService;
  }

  ngOnInit() {}

  login() {
    let hashedPassword = CryptoJS.SHA256(this.user.password).toString(
      CryptoJS.enc.Hex
    );
    this.http
      .post(`${environment.baseUrl}:8082/login`, {
        username: this.user.username,
        password: hashedPassword
      })
      .subscribe(
        (result: any) => {
          const userFromDb = result.data;
          this.storage.set("currentUser", JSON.stringify({ user: userFromDb }));
          this.authService.loginEvent(userFromDb);
          this.router.navigateByUrl("/settings");
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
