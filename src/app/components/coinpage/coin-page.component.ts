import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Inject,
} from "@angular/core";
import { Http } from "@angular/http";
import { _ } from "underscore";
import { Moment } from "moment";
import { Article } from "../../models/article";
import { CoinInfo } from "../../models/coin-info";
import { MarketData } from "../../models/historical-market-data";
import { Tick } from "../../models/tick";
import * as moment from "moment";
import { Label, BaseChartDirective } from "ng2-charts";
import { ActivatedRoute } from "@angular/router";
import { ChartDataSets, ChartOptions } from "chart.js";
import { SelectedDateOption } from "../../models/utils/select-date-option";
import { CurrencyInfo } from "../../models/currency-info";
import { CommunityData } from "../../models/community-data";
import { DevelopmentData } from "../../models/development-data";
import { isBuffer } from "util";
import { AppSettingsService } from "src/app/services/app.settings.service";
import { Subscription, Observable } from "rxjs";
import { SESSION_STORAGE, WebStorageService } from "angular-webstorage-service";
import { environment } from "../../../environments/environment";
import { CoinInfoService } from "src/app/services/coin.info.service";

@Component({
  selector: "app-coin-page",
  templateUrl: "./coin-page.component.html",
  styleUrls: ["./coin-page.component.scss"],
})
export class CoinPageComponent implements OnInit {
  selectedCoin: CoinInfo;
  historicalMarketData: MarketData;
  articles: Article[];
  articlesLoaded: boolean;
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
  listMode: boolean = true;
  @ViewChild("scrollRef", { static: false }) scrollRef: ElementRef;

  @ViewChild(BaseChartDirective, { static: false }) chart: BaseChartDirective;

  constructor(
    private http: Http,
    private appSettingsService: AppSettingsService,
    private route: ActivatedRoute,
    private coinInfoService: CoinInfoService,
    @Inject(SESSION_STORAGE) private sessionStorage: WebStorageService
  ) {
    this.currencyChangeSubscription = appSettingsService.currencyChange$.subscribe(
      (currency) => {
        this.currency = currency;
        this.onCoinSelect(this.selectedCoin);
      }
    );
  }

  ngOnInit() {
    this.getCoinList().then((result) => {
      let coins = result;
      if (this.sessionStorage.get("selectedCurrency")) {
        this.currency = JSON.parse(this.sessionStorage.get("selectedCurrency"))[
          "currency"
        ];
      } else {
        this.currency = { label: "EUR", value: "eur", symbol: "&euro;" };
      }

      let coinIdPar = this.route.snapshot.params.coinId;
      coins.forEach((element) => {
        if (element.id === coinIdPar) {
          this.selectedCoin = element;
          this.onCoinSelect(this.selectedCoin);
          this.getNews(this.selectedCoin);
        }
      });
      this.historicalMarketData = new MarketData();
      this.marketData = new MarketData();

      this.labels = [];
      this.prices = [];
      this.lineChartOptions = {
        responsive: true,
        legend: {
          labels: { fontColor: "white" },
        },
        maintainAspectRatio: false,
      };
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

  toggleListMode(listMode: boolean) {
    this.listMode = listMode;
  }

  /*getCoinList(): Observable<any> {
    return this.coinInfoService.getCoinsList();
  }*/

  getCoinList(): Promise<any> {
    return this.coinInfoService.getCachedCoinlistIfPresent();
  }

  getNews(coin: CoinInfo) {
    this.http.get(`${environment.baseUrl}:8083/bycoin/${coin.id}`).subscribe(
      (result) => {
        const response = result.json();
        console.log(response);
        this.articles = _.sortBy(response, (article) => {
          return new Date(article.publishedAt);
        }).reverse();
        this.articlesLoaded = true;
        /*this.articles.forEach(element => {
        element.title = element.title.substring(0, 100);
      });*/
        this.isUpdating = false;
      },
      (err) => {
        this.articlesLoaded = true;
        this.articles = null;
      }
    );
  }

  getCoinInfo(coin) {
    this.http
      .post(`${environment.baseUrl}:8081/coininfo`, { coin_name: coin.id })
      .subscribe((result) => {
        const response = result.json();
        this.selectedCoin = coin;
        this.selectedCoin.price =
          response.data.market_data.current_price[this.currency.value];
        this.selectedCoin.marketCap =
          response.data.market_data.market_cap[this.currency.value];
        this.selectedCoin.ATH =
          response.data.market_data.ath[this.currency.value];
        this.selectedCoin.marketCapRank =
          response.data.market_data.market_cap_rank;
        this.selectedCoin.volume24H =
          response.data.market_data.total_volume[this.currency.value];
        this.selectedCoin.liquidityScore = response.data.liquidity_score;

        // community data
        if (!this.selectedCoin.communityData) {
          this.selectedCoin.communityData = new CommunityData();
        }
        this.selectedCoin.communityData.communityScore =
          response.data.community_score;
        this.selectedCoin.communityData.publicInterestScore =
          response.data.public_interest_score;
        this.selectedCoin.communityData.facebookLikes =
          response.data.community_data.facebook_likes;
        this.selectedCoin.communityData.redditSubscribers =
          response.data.community_data.reddit_subscribers;
        this.selectedCoin.communityData.twitterFollowers =
          response.data.community_data.twitter_followers;
        this.selectedCoin.communityData.sentimentVotesUpPercentage =
          response.data.sentiment_votes_up_percentage;
        this.selectedCoin.communityData.sentimentVotesDownPercentage =
          response.data.sentiment_votes_down_percentage;

        // development data
        if (!this.selectedCoin.developmentData) {
          this.selectedCoin.developmentData = new DevelopmentData();
        }
        this.selectedCoin.developmentData.developerScore =
          response.data.developer_score;
        this.selectedCoin.developmentData.stars =
          response.data.developer_data.stars;
        this.selectedCoin.developmentData.pullRequestContributors =
          response.data.developer_data.pull_request_contributors;
        this.selectedCoin.developmentData.lastFourWeeksCommits =
          response.data.developer_data.commit_count_4_weeks;
      });
  }

  getCoinHistory(coinName, currency) {
    this.http
      .post(`${environment.baseUrl}:8081/coininfo/history`, {
        coin_name: coinName,
        vs_currency: currency,
      })
      .subscribe((result) => {
        const response = result.json();
        if (response.data) {
          this.labels = [];
          this.prices = [];
          this.historicalMarketData.prices = [];
          for (let i = 0; i < response.data.prices.length; i++) {
            this.historicalMarketData.prices[i] = new Tick();
            this.historicalMarketData.prices[i].utcTimestamp =
              response.data.prices[i][0];
            const date = moment.utc(response.data.prices[i][0]).toDate();
            this.historicalMarketData.prices[i].date_repr = date;
            this.labels.push(moment(date).format("DD-MM-YYYY hh:mm"));
            const price = response.data.prices[i][1];
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
        days: days ? days : 7,
      })
      .subscribe((result) => {
        const response = result.json();
        if (response.data) {
          this.labels = [];
          this.prices = [];
          this.marketData.prices = [];
          for (let i = 0; i < response.data.prices.length; i += 2) {
            this.marketData.prices[i] = new Tick();
            this.marketData.prices[i].utcTimestamp = response.data.prices[i][0];
            const date = moment.utc(response.data.prices[i][0]).toDate();
            this.marketData.prices[i].date_repr = date;
            this.labels.push(moment(date).format("DD-MM-YYYY h:mm"));
            const price = response.data.prices[i][1];
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
          text: "Price",
        },
      },
    };
  }

  updateChart() {
    if (this.chart && this.chart.chart) {
      this.chart.chart.update(); // This re-renders the canvas element.
    }
  }
}
