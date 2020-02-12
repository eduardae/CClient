import { Injectable, Inject } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { User } from "../models/user";
import { Http } from "@angular/http";
import { ToastService } from "./toast-service";
import { SESSION_STORAGE, WebStorageService } from "angular-webstorage-service";
import { HttpClient } from "@angular/common/http";
import { CoinInfo } from "../models/coin-info";
import { Article } from "../models/article";
import { Link } from "../models/Link";
import { LinkSection } from "../models/link-section";
import { _ } from "underscore";
import { environment } from "src/environments/environment";
import { Portfolio } from "../models/portfolio";
import { Purchase } from "../models/purchase";
import { PortfolioCoinData } from "../models/portfolio-coin-data";

@Injectable()
export class PortfolioService {
  constructor(
    private http: HttpClient,
    public toastService: ToastService,
    @Inject(SESSION_STORAGE) private sessionStorage: WebStorageService
  ) {}

  refreshPortfolioCurrentValues() {}

  getAccruedValue(portfolio: Portfolio, currency: string): number {
    let tot = 0;
    let coinKeys = Object.keys(portfolio.startingCoinValues);
    if (portfolio.currentCoinValues) {
      for (let coin of coinKeys) {
        if (portfolio.currentCoinValues[coin]) {
          tot += portfolio.currentCoinValues[coin].price[currency];
        }
      }
    }

    return tot;
  }
}
