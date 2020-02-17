import { Injectable, Inject } from "@angular/core";
import { Subject, Observable, forkJoin } from "rxjs";
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

@Injectable({
  providedIn: "root"
})
export class CoinInfoService {
  constructor(
    private http: HttpClient,
    @Inject(SESSION_STORAGE) private sessionStorage: WebStorageService
  ) {}

  getCoinInfo(coinId: string): Observable<any> {
    return this.http.post<CoinInfo>(`${environment.baseUrl}:8081/coininfo`, {
      coin_name: coinId
    });
  }

  getMultipleCoinsInfo(coins: CoinInfo[]): Observable<any> {
    let calls = [];
    for (const coin of coins) {
      calls.push(
        this.http.post<CoinInfo>(`${environment.baseUrl}:8081/coininfo`, {
          coin_name: coin.queryId
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
