import { OnInit } from '@angular/core';
import { CoinMarketInfo } from './coin-market-info';

export class CoinsSummary implements OnInit {
  btc: CoinMarketInfo;
  ether: CoinMarketInfo;
  cardano: CoinMarketInfo;
  litecoin: CoinMarketInfo;
  chainlink: CoinMarketInfo;
  xrp: CoinMarketInfo;
  tether: CoinMarketInfo;
  tezos: CoinMarketInfo;

  constructor() {
    this.btc = new CoinMarketInfo();
    this.ether = new CoinMarketInfo();
    this.cardano = new CoinMarketInfo();
    this.litecoin = new CoinMarketInfo();
    this.chainlink = new CoinMarketInfo();
    this.xrp = new CoinMarketInfo();
    this.tether = new CoinMarketInfo();
    this.tezos = new CoinMarketInfo();
  }

  ngOnInit() {
  }

}
