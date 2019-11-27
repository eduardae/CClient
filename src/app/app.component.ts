import { Component, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { Http } from "@angular/http";
import { User } from "./models/user";
import { LOCAL_STORAGE, WebStorageService } from "angular-webstorage-service";
import { UserInfoService } from "./user.info.service";
import { Subscription } from "rxjs";
import { ToasterService } from "angular2-toaster";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  providers: [UserInfoService]
})
export class AppComponent {
  title = "cclient";
  user: User;
  storageCopy: WebStorageService;
  subscription: Subscription;

  constructor(
    private http: Http,
    private router: Router,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService,
    private userService: UserInfoService
  ) {
    this.storageCopy = storage;
    if (storage.get("currentUser")) {
      this.user = storage.get("currentUser").user;
    }
    this.subscription = userService.userLogged$.subscribe(user => {
      this.user = user;
      localStorage.setItem("currentUser", JSON.stringify({ user: this.user }));
    });
  }

  logout() {
    this.storage.set("currentUser", null);
    this.user = null;
  }

  ngOnInit() {
    if (this.storageCopy.get("currentUser")) {
      this.user = this.storageCopy.get("currentUser").user;
    }
  }
}
