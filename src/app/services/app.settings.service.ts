import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { CurrencyInfo } from "../models/currency-info";

@Injectable()
export class AppSettingsService {
  // Observable string sources
  private currencyChangeSource = new Subject<CurrencyInfo>();

  // Observable string streams
  currencyChange$ = this.currencyChangeSource.asObservable();

  // Service message commands
  currencyChange(currency: CurrencyInfo) {
    this.currencyChangeSource.next(currency);
  }
}
