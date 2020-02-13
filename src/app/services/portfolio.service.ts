import { Injectable, Inject, Component } from "@angular/core";
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
import { Portfolio } from "../models/portfolio/portfolio";
import { Purchase } from "../models/purchase";
import { PortfolioCoinData } from "../models/portfolio/portfolio-coin-data";
import { PortfolioSummary } from "../models/portfolio/portfolio-summary";
import { CoinInfoService } from "./coin.info.service";
import { Price } from "../models/price";

@Injectable()
export class PortfolioService {
  constructor(
    private http: HttpClient,
    public toastService: ToastService,
    @Inject(CoinInfoService) private coinInfoService: CoinInfoService,
    @Inject(SESSION_STORAGE) private sessionStorage: WebStorageService
  ) {}

  refreshPortfolioCurrentValues() {}

  getSummary(
    portfolio: Portfolio,
    currency: string
  ): Promise<PortfolioSummary> {
    let promise = new Promise<PortfolioSummary>((resolve, reject) => {
      let summaryData: PortfolioSummary = new PortfolioSummary();
      let startingVal: number = 0;
      let currentVal: number = 0;
      let coinKeys = Object.keys(portfolio.startingCoinValues);
      this.coinInfoService.getMultipleCoinsInfoByIds(coinKeys).subscribe(
        coinMarketResults => {
          coinKeys.forEach(key => {
            startingVal +=
              portfolio.startingCoinValues[key].price[currency] *
              portfolio.startingCoinValues[key].quantity;
          });
          portfolio.currentCoinValues = new Map<string, PortfolioCoinData>();
          coinMarketResults.forEach(result => {
            const coinData = result.data;
            const marketDataPrice = coinData.market_data.current_price;
            const coinPrice = new Price();
            coinPrice[currency] = marketDataPrice[currency];
            const portfolioCoinData = new PortfolioCoinData();
            portfolioCoinData.price = coinPrice;
            portfolioCoinData.quantity =
              portfolio.startingCoinValues[coinData.id].quantity;
            currentVal +=
              portfolioCoinData.price[currency] * portfolioCoinData.quantity;
            portfolio.currentCoinValues[currency] = portfolioCoinData;
          });
          summaryData.currentVal = currentVal;
          summaryData.startingVal = startingVal;
          summaryData.groupedGrowth = (currentVal - startingVal) / startingVal;
          resolve(summaryData);
        },
        err => {
          reject(err);
        }
      );
    });
    return promise;
  }

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
