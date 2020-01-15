import { Component, Input, OnInit, OnChanges } from "@angular/core";
import { Http } from "@angular/http";
import { from } from "rxjs";
import { CurrencyPipe } from "@angular/common";
import { CurrencyInfo } from "src/app/models/currency-info";

@Component({
  selector: "price",
  templateUrl: "./price.component.html",
  styleUrls: ["./price.component.scss"],
  providers: [CurrencyPipe]
})
export class PriceComponent implements OnInit, OnChanges {
  @Input() price: number;
  @Input() currency: CurrencyInfo;
  @Input() precision: number;
  displayedPrice: string;

  constructor(private currencyPipe: CurrencyPipe) {}

  ngOnInit() {
    this.displayPrice();
  }

  ngOnChanges() {
    this.displayPrice();
  }

  displayPrice() {
    let displayedCurrency = this.currency.symbol;

    this.displayedPrice = this.currencyPipe.transform(
      this.price,
      this.currency.label,
      "symbol",
      `1.${this.precision}-${this.precision}`
    );
    //const priceOut =  this.price.toFixed(this.precision);
    //this.displayedPrice = `${displayedCurrency} ${priceOut}`;
    /*if (this.price && this.precision) {
      const priceOut = this.price.toFixed(this.precision);
      this.displayedPrice = `${displayedCurrency} ${priceOut}`;
    } else {
      this.displayedPrice = "";
    }*/
  }
}
