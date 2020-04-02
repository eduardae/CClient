import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Inject
} from "@angular/core";
import { Http } from "@angular/http";
import { _ } from "underscore";
import { ActivatedRoute } from "@angular/router";
import { Moment } from "moment";
import { Article } from "../../models/article";
import { CoinInfo } from "../../models/coin-info";
import { MarketData } from "../../models/historical-market-data";
import { Tick } from "../../models/tick";
import * as moment from "moment";
import { Label, BaseChartDirective, MultiDataSet } from "ng2-charts";
import { ChartDataSets, ChartOptions } from "chart.js";
import { SelectedDateOption } from "../../models/utils/select-date-option";
import { CurrencyInfo } from "../../models/currency-info";
import { CommunityData } from "../../models/community-data";
import { DevelopmentData } from "../../models/development-data";
import { isBuffer } from "util";
import { AppSettingsService } from "src/app/services/app.settings.service";
import { Subscription, Observable } from "rxjs";
import { SESSION_STORAGE, WebStorageService } from "angular-webstorage-service";
import { environment } from "src/environments/environment";
import { PortfolioService } from "src/app/services/portfolio.service";
import { Portfolio } from "src/app/models/portfolio/portfolio";
import { PortfolioCoinData } from "src/app/models/portfolio/portfolio-coin-data";
import { HttpClient } from "@angular/common/http";
import { CoinInfoService } from "src/app/services/coin.info.service";

@Component({
  selector: "app-portfolio-page",
  templateUrl: "./portfolio.page.component.html",
  styleUrls: ["./portfolio.page.component.scss"],
  providers: []
})
export class PortfolioPageComponent implements OnInit {
  coins: CoinInfo[];
  historicalMarketData: MarketData;
  marketData: MarketData;
  isUpdating: boolean;
  response: string;
  currency: CurrencyInfo;
  currencyChangeSubscription: Subscription;
  type: string;
  data: object;
  options: object;
  labels: Label[];
  prices: number[];

  public currentDoughnutChartLabels: Label[] = [];
  public startingDoughnutChartLabels: Label[] = [];

  public currentDoughnutChartData: MultiDataSet = [];
  public startingDoughnutChartData: MultiDataSet = [];

  public doughnutChartType = "doughnut";
  lineChartLegend = true;

  portfolio: Portfolio;
  @ViewChild("scrollRef", { static: false }) scrollRef: ElementRef;

  @ViewChild(BaseChartDirective, { static: false }) chart: BaseChartDirective;

  constructor(
    private http: Http,
    private route: ActivatedRoute,
    private appSettingsService: AppSettingsService,
    private portfolioService: PortfolioService,
    private coinInfoService: CoinInfoService,
    @Inject(SESSION_STORAGE) private sessionStorage: WebStorageService
  ) {
    this.currencyChangeSubscription = appSettingsService.currencyChange$.subscribe(
      currency => {
        this.currency = currency;
      }
    );
  }

  ngOnInit() {
    if (this.sessionStorage.get("selectedCurrency")) {
      this.currency = JSON.parse(this.sessionStorage.get("selectedCurrency"))[
        "currency"
      ];
    } else {
      this.currency = { label: "EUR", value: "eur", symbol: "&euro;" };
    }

    this.portfolio = this.portfolioService.getCurrentPortfolio();
    if (!this.portfolio) {
      this.portfolioService
        .getPortfolioById(this.route.snapshot.paramMap.get("id"))
        .subscribe(result => {
          this.portfolio = result;
          this.portfolioService
            .getSummary(this.portfolio, this.currency.value)
            .then(result => {
              this.portfolio.summary = result;
              this.initPortfolioData();
              this.portfolio = this.portfolioService.populateGrowthByCoin(
                this.portfolio,
                this.currency.value
              );
            });
        });
    } else {
      this.initPortfolioData();
      this.portfolio = this.portfolioService.populateGrowthByCoin(
        this.portfolio,
        this.currency.value
      );
    }
  }

  initPortfolioData() {
    const currentDataset = [];
    const startingDataset = [];
    this.portfolio.currentCoinValues.forEach(
      (coinData: PortfolioCoinData, key: string) => {
        this.currentDoughnutChartLabels.push(key);
        const val = coinData.quantity * coinData.price[this.currency.value];
        currentDataset.push(val);
      }
    );
    for (const [key, coinData] of Object.entries(
      this.portfolio.startingCoinValues
    )) {
      this.startingDoughnutChartLabels.push(key);
      const val = coinData.quantity * coinData.price[this.currency.value];
      startingDataset.push(val);
    }

    this.startingDoughnutChartData = [startingDataset];
    this.currentDoughnutChartData = [currentDataset];
  }

  getCoinList(): Observable<any> {
    return this.coinInfoService.getCustomCoinsList();
  }

  initChartOpts() {
    this.type = "doughnut";
    this.options = {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: true,
        labels: {
          text: "Price"
        }
      }
    };
  }

  updateChart() {
    if (this.chart && this.chart.chart) {
      this.chart.chart.update(); // This re-renders the canvas element.
    }
  }
}
