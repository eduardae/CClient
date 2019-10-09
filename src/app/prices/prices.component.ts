import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import {_} from 'underscore';
import { Moment } from 'moment';
import { Article } from '../models/article';
import { CoinInfo } from '../models/coin-info';
import { HistoricalMarketData } from '../models/historical-market-data';
import { Tick } from '../models/tick';
import * as moment from 'moment';
import { Label, BaseChartDirective } from 'ng2-charts';
import { ChartDataSets, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.scss'],
})
export class PricesComponent implements OnInit {

  coins: CoinInfo[];
  selectedCoin: CoinInfo;
  historicalMarketData: HistoricalMarketData;
  isUpdating: boolean;
  response: string;
  currency: string;
  type: string;
  data: object;
  options: object;
  labels: Label[];
  prices: number[];
  lineChartData: ChartDataSets[] = [
    { data: [], label: 'Price (t)' },
  ];
  lineChartOptions: ChartOptions;
  lineChartLegend = true;
  lineChartType = 'line';

  @ViewChild(BaseChartDirective, {static: false}) chart: BaseChartDirective;

  constructor(private http:Http) {
  }

  ngOnInit() {
    this.getCoinList();
    this.currency = 'EUR';
    this.selectedCoin = new CoinInfo();
    this.historicalMarketData = new HistoricalMarketData();
    this.labels = [];
    this.prices = [];
    this.lineChartOptions = {
      responsive: true,
    };
    this.onCoinSelect('bitcoin');
  }

  refreshInfo() {
    this.isUpdating = true;
  }

  onCoinSelect(coin) {
    this.getCoinInfo(coin);
    this.getCoinHistory(coin, this.currency);
  }

  getCoinList() {
    this.http
    .get('http://localhost:8081/coinslist').subscribe((result) => {
      const response = result.json();
      console.log(response);
      this.coins = response.coins;
      this.isUpdating = false;
    });
  }

  getCoinInfo(coinName) {
    this.http
    .post('http://localhost:8081/coininfo', {coin_name: coinName}).subscribe((result) => {
      const response = result.json();
      console.log(response);
    });
  }

  getCoinHistory(coinName, currency) {
    this.http
    .post('http://localhost:8081/coininfo/history', {coin_name: coinName, vs_currency: currency}).subscribe((result) => {
      const response = result.json();
      console.log(response);
      if (response.data) {
        this.labels = [];
        this.prices = [];
        this.historicalMarketData.prices = [];
        for (let i = 0; i < response.data.prices.length; i++) {
          this.historicalMarketData.prices[i] = new Tick();
          this.historicalMarketData.prices[i].utcTimestamp = response.data.prices[i][0];
          const date = moment.utc(response.data.prices[i][0]).toDate();
          this.historicalMarketData.prices[i].date_repr = date;
          this.labels.push(moment(date).format('DD-MM-YYYY h:mm'));
          const price = response.data.prices[i][1];
          this.historicalMarketData.prices[i].price = price;
          this.prices.push(price);
        }
        this.initChartOpts();
        this.updateChart();
      }
    });
  }

  initChartOpts() {
    this.type = 'line';
    this.lineChartData[0].data = this.prices;
    this.options = {
      responsive: true,
      maintainAspectRatio: false
    };
  }

  updateChart() {
    this.chart.chart.update(); // This re-renders the canvas element.
}

}
