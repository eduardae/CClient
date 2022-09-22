import { OnInit, Directive } from '@angular/core';
import { CoinInfo } from './coin-info';

@Directive()
export class CoinsSummary implements OnInit {
  btc: CoinInfo;
  ether: CoinInfo;
  cardano: CoinInfo;
  litecoin: CoinInfo;
  chainlink: CoinInfo;
  xrp: CoinInfo;
  tether: CoinInfo;
  tezos: CoinInfo;

  constructor() {
    this.btc = new CoinInfo();
    this.ether = new CoinInfo();
    this.cardano = new CoinInfo();
    this.litecoin = new CoinInfo();
    this.chainlink = new CoinInfo();
    this.xrp = new CoinInfo();
    this.tether = new CoinInfo();
    this.tezos = new CoinInfo();
  }

  ngOnInit() {
  }

}
