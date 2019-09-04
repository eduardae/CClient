import { OnInit } from '@angular/core';

export class CoinMarketInfo implements OnInit {
  eurPrice: number;
  name: string;

  constructor() {
    this.eurPrice = 0;
    this.name = '';
   }

  ngOnInit() {

  }

}
