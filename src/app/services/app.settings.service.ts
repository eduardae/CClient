import { Injectable, Inject } from "@angular/core";
import { Subject } from "rxjs";
import { CurrencyInfo } from "../models/currency-info";
import { StorageService, SESSION_STORAGE } from "ngx-webstorage-service";

@Injectable()
export class AppSettingsService {
  currency: CurrencyInfo;

  constructor(
    @Inject(SESSION_STORAGE) private sessionStorage: StorageService
  ) {
    if (this.sessionStorage.get("selectedCurrency")) {
      this.currency = JSON.parse(this.sessionStorage.get("selectedCurrency"))[
        "currency"
      ];
    } else {
      this.currency = { label: "EUR", value: "eur", symbol: "&euro;" };
    }
  }

  // Observable string sources
  private currencyChangeSource = new Subject<CurrencyInfo>();

  // Observable string streams
  currencyChange$ = this.currencyChangeSource.asObservable();

  // Service message commands
  currencyChange(currency: CurrencyInfo) {
    this.currencyChangeSource.next(currency);
    this.currency = currency;
  }

  getCurrency(): CurrencyInfo {
    return this.currency;
  }
}
