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
import { CoinsSummary } from "../models/coins-summary";
import { CoinInfo } from "../models/coin-info";
import { from } from "rxjs";
import { Router } from "@angular/router";
import { User } from "../models/user";
import { LOCAL_STORAGE, WebStorageService } from "angular-webstorage-service";
import { ElementRef, Renderer2 } from "@angular/core";
import { UserInfoService } from "../user.info.service";
import { ToastService } from "../toast/toast-service";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"]
})
export class SettingsComponent implements OnInit {
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

  ngOnInit() {
    if (this.storage.get("currentUser")) {
      this.user = this.storage.get("currentUser").user;
    }
  }

  update() {
    this.http
      .post("http://localhost:8082/update/settings", this.user)
      .subscribe(
        result => {
          this.toastService.show("User settings updated", {
            classname: "bg-success text-light",
            delay: 2000
          });
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
