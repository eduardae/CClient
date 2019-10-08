import { OnInit } from '@angular/core';

export class CoinMarketInfo implements OnInit {
  eurPrice: number;
  name: string;
  queryId: string;

  constructor() {
    this.eurPrice = 0;
    this.name = '';
    this.queryId = '';
   }

  ngOnInit() {

  }

}
