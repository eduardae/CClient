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
import { CoinsSummary } from "../../models/coins-summary";
import { CoinInfo } from "../../models/coin-info";
import { from } from "rxjs";
import { Router } from "@angular/router";
import { User } from "../../models/user";
import {
  LOCAL_STORAGE,
  WebStorageService,
  SESSION_STORAGE
} from "angular-webstorage-service";
import { ElementRef, Renderer2 } from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { UserInfoService } from "src/app/services/user.info.service";
import { ToastService } from "../../services/toast-service";

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
    @Inject(SESSION_STORAGE) private storage: WebStorageService,
    private userService: UserInfoService,
    public toastService: ToastService,
    private modalService: NgbModal
  ) {
    this.toastService = toastService;
  }

  ngOnInit() {
    if (this.storage.get("currentUser")) {
      this.user = JSON.parse(this.storage.get("currentUser")).user;
    }
    if (!this.user) {
      this.router.navigateByUrl("/");
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
          this.storage.set("currentUser", JSON.stringify({ user: this.user }));
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
