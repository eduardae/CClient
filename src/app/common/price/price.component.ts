import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { from } from 'rxjs';

@Component({
  selector: 'price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss'],
})
export class PriceComponent implements OnInit{

  @Input() price: number;
  @Input() currency: string;
  @Input() precision: number;
  displayedPrice: string;

  constructor() {
  }

  ngOnInit() {
    let displayedCurrency;
    switch(this.currency) {
      case 'EUR':
        displayedCurrency = '&euro;';
        break;
    }
    const priceOut = this.price.toFixed(this.precision);
    this.displayedPrice =  `${displayedCurrency} ${priceOut}`;
  }

}
