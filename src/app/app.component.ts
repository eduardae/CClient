import { Component, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { Http } from "@angular/http";
import { User } from "./models/user";
import {
  LOCAL_STORAGE,
  WebStorageService,
  SESSION_STORAGE
} from "angular-webstorage-service";
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
  subscription: Subscription;
  constructor(
    private http: Http,
    private router: Router,
    @Inject(SESSION_STORAGE) private sessionStorage: WebStorageService,
    private userService: UserInfoService,
    private appSettingsService: AppSettingsService,
    private toastService: ToastService
  ) {
    let eur = { label: "EUR", value: "eur", symbol: "&euro;" };
    this.supportedCurrencies.push(eur);
    let usd = { label: "USD", value: "usd", symbol: "&euro;" };
    this.supportedCurrencies.push(usd);
    if (this.sessionStorage.get("selectedCurrency")) {
      let selected = JSON.parse(this.sessionStorage.get("selectedCurrency"))[
        "currency"
      ];
      this.supportedCurrencies.forEach(currency => {
        if (selected.label === currency.label) {
          this.currency = currency;
        }
      });
      if (this.sessionStorage.get("currentUser")) {
        this.user = JSON.parse(this.sessionStorage.get("currentUser")).user;
      }
    } else {
      this.currency = eur;
    }
    this.subscription = userService.userLogged$.subscribe(user => {
      this.user = user;
      this.sessionStorage.set(
        "currentUser",
        JSON.stringify({ user: this.user })
      );
    });
  }

  currencyChange(currencyVal) {
    this.sessionStorage.set(
      "selectedCurrency",
      JSON.stringify({ currency: currencyVal })
    );
    this.appSettingsService.currencyChange(currencyVal);
  }

  logout() {
    this.sessionStorage.set("currentUser", null);
    this.user = null;
    this.toastService.show("Logged out", {
      classname: "bg-success text-light",
      delay: 2000
    });
    this.router.navigateByUrl("/");
  }

  ngOnInit() {}
}
