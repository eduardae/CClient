import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { Http } from "@angular/http";
import { _ } from "underscore";
import { Moment } from "moment";
import { Article } from "../models/article";
import { CoinInfo } from "../models/coin-info";
import { MarketData } from "../models/historical-market-data";
import { Tick } from "../models/tick";
import * as moment from "moment";
import { Label, BaseChartDirective } from "ng2-charts";
import { ChartDataSets, ChartOptions } from "chart.js";
import { SelectedDateOption } from "../models/utils/select-date-option";
import { CurrencyInfo } from "../models/currency-info";

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

  @ViewChild(BaseChartDirective, { static: false }) chart: BaseChartDirective;

  constructor(private http: Http) {}

  ngOnInit() {
    this.getCoinList().then(result => {
      this.coins = result;
      this.currency = { label: "EUR", value: "eur" };
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
    let days2 = new SelectedDateOption("two days", 2);
    let week = new SelectedDateOption("one week", 7);
    let month = new SelectedDateOption("one month", 31);
    let year = new SelectedDateOption("one year", 365);
    this.timeFrameSelectOptions = [];
    this.timeFrameSelectOptions.push(days2);
    this.timeFrame = days2;
    this.timeFrameSelectOptions.push(week);
    this.timeFrameSelectOptions.push(month);
    this.timeFrameSelectOptions.push(year);
  }

  refreshInfo() {
    this.isUpdating = true;
  }

  onCoinSelect(coin) {
    this.getCoinInfo(coin);
    this.getCoinMarketChart(
      coin.queryId,
      this.currency.label,
      this.timeFrame ? this.timeFrame.days : null
    );
  }

  onTimeFrameChange(timeFrame) {
    this.timeFrame = timeFrame;
    this.getCoinMarketChart(
      this.selectedCoin.queryId,
      this.currency.label,
      timeFrame.days
    );
  }

  triggerAdditionalInfo() {
    this.showAdditionalInfo = !this.showAdditionalInfo;
  }

  async getCoinList(): Promise<CoinInfo[]> {
    let result = await this.http
      .get("http://localhost:8081/coinslist")
      .toPromise();
    const response = result.json();
    return response.coins;
  }

  getCoinInfo(coin) {
    this.http
      .post("http://localhost:8081/coininfo", { coin_name: coin.queryId })
      .subscribe(result => {
        const response = result.json();
        this.selectedCoin = coin;
        this.selectedCoin.eurPrice =
          response.data.market_data.current_price.eur;
        this.selectedCoin.eurMarketCap =
          response.data.market_data.market_cap.eur;
        this.selectedCoin.eurATH = response.data.market_data.ath.eur;
        this.selectedCoin.marketCapRank =
          response.data.market_data.market_cap_rank;
        this.selectedCoin.volume24H =
          response.data.market_data.total_volume.eur;
      });
  }

  getCoinHistory(coinName, currency) {
    this.http
      .post("http://localhost:8081/coininfo/history", {
        coin_name: coinName,
        vs_currency: currency
      })
      .subscribe(result => {
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
    this.http
      .post("http://localhost:8081/coininfo/marketchart", {
        coin_name: coinName,
        vs_currency: currency,
        days: daysPar ? daysPar : 7
      })
      .subscribe(result => {
        const response = result.json();
        if (response.data) {
          this.labels = [];
          this.prices = [];
          this.marketData.prices = [];
          for (let i = 0; i < response.data.prices.length; i += 4) {
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
      maintainAspectRatio: false
    };
  }

  updateChart() {
    if (this.chart && this.chart.chart) {
      this.chart.chart.update(); // This re-renders the canvas element.
    }
  }
}
