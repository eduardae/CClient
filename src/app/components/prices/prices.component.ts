import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Inject
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { _ } from "underscore";
import { Moment } from "moment";
import { Article } from "../../models/article";
import { CoinInfo } from "../../models/coin-info";
import { MarketData } from "../../models/historical-market-data";
import { Tick } from "../../models/tick";
import * as moment from "moment";
import { Label, BaseChartDirective } from "ng2-charts";
import { ChartDataSets, ChartOptions } from "chart.js";
import { SelectedDateOption } from "../../models/utils/select-date-option";
import { CurrencyInfo } from "../../models/currency-info";
import { CommunityData } from "../../models/community-data";
import { DevelopmentData } from "../../models/development-data";
import { isBuffer } from "util";
import { AppSettingsService } from "src/app/services/app.settings.service";
import { Subscription } from "rxjs";
import { SESSION_STORAGE, StorageService } from "ngx-webstorage-service";
import { environment } from "src/environments/environment";
import { CoinInfoService } from "src/app/services/coin.info.service";

@Component({
  selector: "app-prices",
  templateUrl: "./prices.component.html",
  styleUrls: ["./prices.component.scss"]
})
export class PricesComponent implements OnInit {
  coins: CoinInfo[];
  selectedCoin: CoinInfo;
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
  timeFrameSelectOptions: SelectedDateOption[];
  timeFrame: SelectedDateOption;
  lineChartData: ChartDataSets[] = [{ data: [], label: "Price (t)" }];
  lineChartOptions: ChartOptions;
  lineChartLegend = true;
  lineChartType = "line";
  showAdditionalInfo: boolean;
  @ViewChild("scrollRef", { static: false }) scrollRef: ElementRef;

  @ViewChild(BaseChartDirective, { static: false }) chart: BaseChartDirective;

  constructor(
    private http: HttpClient,
    private appSettingsService: AppSettingsService,
    @Inject(SESSION_STORAGE) private sessionStorage: StorageService,
    private coinInfoService: CoinInfoService
  ) {
    this.currencyChangeSubscription = appSettingsService.currencyChange$.subscribe(
      currency => {
        this.currency = currency;
        this.onCoinSelect(this.selectedCoin);
      }
    );
  }

  ngOnInit() {
    this.coinInfoService.getCustomCoinsList().subscribe(result => {
      this.coins = result.data;
      if (this.sessionStorage.get("selectedCurrency")) {
        this.currency = JSON.parse(this.sessionStorage.get("selectedCurrency"))[
          "currency"
        ];
      } else {
        this.currency = { label: "EUR", value: "eur", symbol: "&euro;" };
      }

      this.historicalMarketData = new MarketData();
      this.marketData = new MarketData();

      this.labels = [];
      this.prices = [];
      this.lineChartOptions = {
        responsive: true,
        legend: {
          labels: { fontColor: "white" }
        },
        maintainAspectRatio: false
      };
      this.selectedCoin = this.coins[0];
      this.onCoinSelect(this.selectedCoin);
    });
    let one_day = new SelectedDateOption("1 day", 2);
    let three_days = new SelectedDateOption("3 days", 3);
    let week = new SelectedDateOption("1 week", 7);
    let two_weeks = new SelectedDateOption("2 weeks", 14);
    let month = new SelectedDateOption("1 month", 31);
    let three_months = new SelectedDateOption("3 months", 93);
    let year = new SelectedDateOption("1 year", 365);
    let all = new SelectedDateOption("Max", 0);
    this.timeFrameSelectOptions = [];
    this.timeFrameSelectOptions.push(one_day);
    this.timeFrame = one_day;
    this.timeFrameSelectOptions.push(three_days);
    this.timeFrameSelectOptions.push(week);
    this.timeFrameSelectOptions.push(two_weeks);
    this.timeFrameSelectOptions.push(month);
    this.timeFrameSelectOptions.push(three_months);
    this.timeFrameSelectOptions.push(year);
    this.timeFrameSelectOptions.push(all);
  }

  refreshInfo() {
    this.isUpdating = true;
  }

  onCoinSelect(coin) {
    this.getCoinInfo(coin);
    this.getCoinMarketChart(
      coin.id,
      this.currency.label,
      this.timeFrame ? this.timeFrame.days : null
    );
  }

  onTimeFrameChange(timeFrame) {
    this.timeFrame = timeFrame;
    this.getCoinMarketChart(
      this.selectedCoin.id,
      this.currency.label,
      timeFrame.days
    );
  }

  triggerAdditionalInfo() {
    this.showAdditionalInfo = !this.showAdditionalInfo;
    if (this.showAdditionalInfo) {
      setTimeout(() => {
        window.scrollTo(
          0,
          this.scrollRef.nativeElement.offsetTop +
            (this.scrollRef.nativeElement.offsetHeight + 50)
        );
      }, 20);
    }
  }

  getCoinInfo(coin) {
    this.http
      .post(`${environment.baseUrl}:8081/coininfo`, { coin_name: coin.id })
      .subscribe((result: any) => {
        const response = result.data;
        this.selectedCoin = coin;
        this.selectedCoin.price =
          response.market_data.current_price[this.currency.value];
        this.selectedCoin.marketCap =
          response.market_data.market_cap[this.currency.value];
        this.selectedCoin.ATH =
          response.market_data.ath[this.currency.value];
        this.selectedCoin.marketCapRank =
          response.market_data.market_cap_rank;
        this.selectedCoin.volume24H =
          response.market_data.total_volume[this.currency.value];
        this.selectedCoin.liquidityScore = response.liquidity_score;

        // community data
        if (!this.selectedCoin.communityData) {
          this.selectedCoin.communityData = new CommunityData();
        }
        this.selectedCoin.communityData.communityScore =
          response.community_score;
        this.selectedCoin.communityData.publicInterestScore =
          response.public_interest_score;
        this.selectedCoin.communityData.facebookLikes =
          response.community_data.facebook_likes;
        this.selectedCoin.communityData.redditSubscribers =
          response.community_data.reddit_subscribers;
        this.selectedCoin.communityData.twitterFollowers =
          response.community_data.twitter_followers;
        this.selectedCoin.communityData.sentimentVotesUpPercentage =
          response.sentiment_votes_up_percentage;
        this.selectedCoin.communityData.sentimentVotesDownPercentage =
          response.sentiment_votes_down_percentage;

        // development data
        if (!this.selectedCoin.developmentData) {
          this.selectedCoin.developmentData = new DevelopmentData();
        }
        this.selectedCoin.developmentData.developerScore =
          response.developer_score;
        this.selectedCoin.developmentData.stars =
          response.developer_data.stars;
        this.selectedCoin.developmentData.pullRequestContributors =
          response.developer_data.pull_request_contributors;
        this.selectedCoin.developmentData.lastFourWeeksCommits =
          response.developer_data.commit_count_4_weeks;
      });
  }

  getCoinHistory(coinName, currency) {
    this.http
      .post(`${environment.baseUrl}:8081/coininfo/history`, {
        coin_name: coinName,
        vs_currency: currency
      })
      .subscribe((result: any) => {
        const response = result.data;
        if (response) {
          this.labels = [];
          this.prices = [];
          this.historicalMarketData.prices = [];
          for (let i = 0; i < response.prices.length; i++) {
            this.historicalMarketData.prices[i] = new Tick();
            this.historicalMarketData.prices[i].utcTimestamp =
              response.prices[i][0];
            const date = moment.utc(response.prices[i][0]).toDate();
            this.historicalMarketData.prices[i].date_repr = date;
            this.labels.push(moment(date).format("DD-MM-YYYY hh:mm"));
            const price = response.prices[i][1];
            this.historicalMarketData.prices[i].price = price;
            this.prices.push(price);
          }
          this.initChartOpts();
          this.updateChart();
        }
      });
  }

  getCoinMarketChart(coinName, currency, daysPar) {
    let days;
    if (daysPar === 0) {
      days = "max";
    } else {
      days = daysPar;
    }
    this.http
      .post(`${environment.baseUrl}:8081/coininfo/marketchart`, {
        coin_name: coinName,
        vs_currency: currency,
        days: days
      })
      .subscribe((result: any) => {
        const response = result.data;
        if (response) {
          this.labels = [];
          this.prices = [];
          this.marketData.prices = [];
          for (let i = 0; i < response.prices.length; i += 2) {
            this.marketData.prices[i] = new Tick();
            this.marketData.prices[i].utcTimestamp = response.prices[i][0];
            const date = moment.utc(response.prices[i][0]).toDate();
            this.marketData.prices[i].date_repr = date;
            this.labels.push(moment(date).format("DD-MM-YYYY h:mm"));
            const price = response.prices[i][1];
            this.marketData.prices[i].price = price;
            this.prices.push(price);
          }
          this.initChartOpts();
          this.updateChart();
        }
      });
  }

  initChartOpts() {
    this.type = "line";
    this.lineChartData[0].data = this.prices;
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
