import { Injectable, Inject } from "@angular/core";
import { Subject, Observable, forkJoin } from "rxjs";
import { User } from "../models/user";
import { ToastService } from "./toast-service";
import { SESSION_STORAGE, StorageService } from "ngx-webstorage-service";
import { HttpClient } from "@angular/common/http";
import { CoinInfo } from "../models/coin-info";
import { Article } from "../models/article";
import { Link } from "../models/link";
import { LinkSection } from "../models/link-section";
import { _ } from "underscore";
import { environment } from "src/environments/environment";
import { Portfolio } from "../models/portfolio/portfolio";

@Injectable({
  providedIn: "root"
})
export class CoinInfoService {
  constructor(
    private http: HttpClient,
    @Inject(SESSION_STORAGE) private sessionStorage: StorageService
  ) {}

  getCoinInfo(coinId: string): Observable<any> {
    return this.http.post<CoinInfo>(`${environment.baseUrl}:8081/coininfo`, {
      coin_name: coinId
    });
  }

  getCoinsList(): Observable<any> {
    return this.http.get(`${environment.baseUrl}:8081/coinslist`);
  }

  getCachedCoinlistIfPresent(): Promise<any> {
    let promise = new Promise((resolve, reject) => {
      if (sessionStorage.getItem("coinsList")) {
        resolve(JSON.parse(this.sessionStorage.get("coinsList")));
      } else {
        this.getCoinsList().subscribe(result => {
          this.sessionStorage.set("coinsList", JSON.stringify(result.data));
          resolve(result.data);
        });
      }
    });
    return promise;
  }

  getCustomCoinsList(): Observable<any> {
    return this.http.get(`${environment.baseUrl}:8081/coinslist/custom`);
  }

  getAllCoinsList(): Observable<any> {
    return this.http.get(`${environment.baseUrl}:8081/coins/list`);
  }

  getCoinMarkets(currency: string): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}:8081/coins/markets?currency=${
        currency ? currency : "EUR"
      }`
    );
  }

  getMultipleCoinsInfo(coins: CoinInfo[]): Observable<any> {
    let calls = [];
    for (const coin of coins) {
      calls.push(
        this.http.post<CoinInfo>(`${environment.baseUrl}:8081/coininfo`, {
          coin_name: coin.id
        })
      );
    }
    return forkJoin(calls);
  }

  getMultipleCoinsInfoByIds(coins: string[]): Observable<any> {
    let calls = [];
    for (const coin of coins) {
      calls.push(
        this.http.post<CoinInfo>(`${environment.baseUrl}:8081/coininfo`, {
          coin_name: coin
        })
      );
    }
    return forkJoin(calls);
  }
}
