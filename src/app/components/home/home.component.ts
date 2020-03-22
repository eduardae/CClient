import { Component, OnInit, Input, Inject } from "@angular/core";
import { Http } from "@angular/http";
import { CoinsSummary } from "../../models/coins-summary";
import { CoinInfo } from "../../models/coin-info";
import { from, Subscription } from "rxjs";
import { _ } from "underscore";
import { CurrencyInfo } from "../../models/currency-info";
import { AppSettingsService } from "src/app/services/app.settings.service";
import { SESSION_STORAGE, WebStorageService } from "angular-webstorage-service";
import { environment } from "../../../environments/environment";
import { CoinInfoService } from "src/app/services/coin.info.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  @Input() cryptoInfos: CoinsSummary;
  coinsList: Array<CoinInfo> = new Array();
  isUpdating: boolean;
  contentLoaded: boolean;
  currency: CurrencyInfo;
  currencyChangeSubscription: Subscription;
  carouselImages: string[];

  constructor(
    private http: Http,
    private appSettingsService: AppSettingsService,
    @Inject(SESSION_STORAGE) private sessionStorage: WebStorageService,
    private coinInfoService: CoinInfoService
  ) {
    this.cryptoInfos = new CoinsSummary();
    this.contentLoaded = false;
    this.currencyChangeSubscription = appSettingsService.currencyChange$.subscribe(
      currency => {
        this.currency = currency;
        this.refreshInfo();
      }
    );
    this.carouselImages = [
      "assets/images/carousel/btc_ether.jpg",
      "assets/images/carousel/blockchain_flow.jpg",
      "assets/images/carousel/abstract_data.jpg"
    ];
  }

  ngOnInit() {
    if (this.sessionStorage.get("selectedCurrency")) {
      this.currency = JSON.parse(this.sessionStorage.get("selectedCurrency"))[
        "currency"
      ];
    } else {
      this.currency = { label: "EUR", value: "eur", symbol: "&euro;" };
    }
    this.getCoinMarkets();
  }

  refreshInfo() {
    this.isUpdating = true;
    this.getCoinMarkets();
  }

  getCoinMarkets() {
    this.coinsList = [];
    this.coinInfoService.getCoinMarkets(this.currency.value).subscribe(
      result => {
        for (let i = 0; i < 12; i++) {
          const coinMarketData = result.data[i];
          let coin = new CoinInfo();
          coin.price = coinMarketData.current_price;
          coin.name = coinMarketData.name;
          coin.id = coinMarketData.id;
          coin.iconUrl = coinMarketData.image;
          this.coinsList.push(coin);
        }
        this.isUpdating = false;
        this.contentLoaded = true;
        console.log(result.data);
      },
      err => {
        console.log(err);
      }
    );
  }
}
