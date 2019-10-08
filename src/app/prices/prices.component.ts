import { Component, OnInit, Input } from '@angular/core';
import { Http } from '@angular/http';
import {_} from 'underscore';
import { Article } from '../models/article';
import { CoinMarketInfo } from '../models/coin-market-info';

@Component({
  selector: 'app-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.scss'],
})
export class PricesComponent implements OnInit {

  coins: CoinMarketInfo[];
  selectedCoin: CoinMarketInfo;
  isUpdating: boolean;
  response: string;

  constructor(private http:Http) {
  }

  ngOnInit() {
    this.getCoinList();
  }

  refreshInfo() {
    this.isUpdating = true;
  }

  onCoinSelect(coin) {
    this.getCoinInfo(coin.queryId);
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
      this.isUpdating = false;
    });
  }

}
