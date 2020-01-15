import { Component, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { Http } from "@angular/http";
import { User } from "./models/user";
import { LOCAL_STORAGE, WebStorageService } from "angular-webstorage-service";
import { UserInfoService } from "./services/user.info.service";
import { Subscription } from "rxjs";
import { ToastService } from "./services/toast-service";
import { AppSettingsService } from "./services/app.settings.service";
import { CurrencyInfo } from "./models/currency-info";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  providers: [UserInfoService, AppSettingsService]
})
export class AppComponent {
  title = "cclient";
  user: User;
  currency: CurrencyInfo;
  supportedCurrencies: CurrencyInfo[] = [];
  storageCopy: WebStorageService;
  subscription: Subscription;
  constructor(
    private http: Http,
    private router: Router,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService,
    private userService: UserInfoService,
    private appSettingsService: AppSettingsService,
    private toastService: ToastService
  ) {
    this.storageCopy = storage;
    if (storage.get("currentUser")) {
      this.user = storage.get("currentUser").user;
    }
    this.currency = { label: "EUR", value: "eur", symbol: "&euro;" };
    this.supportedCurrencies.push(this.currency);
    let usd = { label: "USD", value: "usd", symbol: "&euro;" };
    this.supportedCurrencies.push(usd);
    this.subscription = userService.userLogged$.subscribe(user => {
      this.user = user;
      localStorage.setItem("currentUser", JSON.stringify({ user: this.user }));
    });
  }

  currencyChange(currency) {
    this.appSettingsService.currencyChange(currency);
  }

  logout() {
    this.storage.set("currentUser", null);
    this.user = null;
    this.toastService.show("Logged out", {
      classname: "bg-success text-light",
      delay: 2000
    });
  }

  ngOnInit() {
    if (this.storageCopy.get("currentUser")) {
      this.user = this.storageCopy.get("currentUser").user;
    }
  }
}
