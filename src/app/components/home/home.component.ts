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

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  @Input() cryptoInfos: CoinsSummary;
  isUpdating: boolean;
  contentLoaded: boolean;
  currency: CurrencyInfo;
  currencyChangeSubscription: Subscription;
  carouselImages: string[];

  constructor(
    private http: Http,
    private appSettingsService: AppSettingsService,
    @Inject(SESSION_STORAGE) private sessionStorage: WebStorageService
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
      "assets/images/carousel/bitcoin.jpg"
    ];
  }

  ngOnInit() {
    this.getCryptoMarketInfo();
    if (this.sessionStorage.get("selectedCurrency")) {
      this.currency = JSON.parse(this.sessionStorage.get("selectedCurrency"))[
        "currency"
      ];
    } else {
      this.currency = { label: "EUR", value: "eur", symbol: "&euro;" };
    }
  }

  refreshInfo() {
    this.isUpdating = true;
    this.getCryptoMarketInfo();
  }

  getCryptoMarketInfo() {
    this.http.get(`${environment.baseUrl}:8081`).subscribe(result => {
      const response = result.json();
      if (response.success) {
        const extracted = response.data;
        const btc = _.findWhere(extracted, { id: "bitcoin" });
        const ether = _.findWhere(extracted, { id: "ethereum" });
        const chainlink = _.findWhere(extracted, { id: "chainlink" });
        const cardano = _.findWhere(extracted, { id: "cardano" });
        const tezos = _.findWhere(extracted, { id: "tezos" });
        const litecoin = _.findWhere(extracted, { id: "litecoin" });
        const xrp = _.findWhere(extracted, { id: "ripple" });
        const tether = _.findWhere(extracted, { id: "tether" });

        this.cryptoInfos.btc = this.getCoinMarketInfo(btc);
        this.cryptoInfos.ether = this.getCoinMarketInfo(ether);
        this.cryptoInfos.chainlink = this.getCoinMarketInfo(chainlink);
        this.cryptoInfos.cardano = this.getCoinMarketInfo(cardano);
        this.cryptoInfos.tezos = this.getCoinMarketInfo(tezos);
        this.cryptoInfos.litecoin = this.getCoinMarketInfo(litecoin);
        this.cryptoInfos.xrp = this.getCoinMarketInfo(xrp);
        this.cryptoInfos.tether = this.getCoinMarketInfo(tether);
      }
      this.isUpdating = false;
      this.contentLoaded = true;
    });
  }

  getCoinMarketInfo(coin) {
    const result = new CoinInfo();
    result.price = coin.market_data.current_price[this.currency.value];
    result.name = coin.id;
    return result;
  }
}
