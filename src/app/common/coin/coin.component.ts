import { Component, Input, OnInit, OnChanges } from "@angular/core";
import { Http } from "@angular/http";
import { from } from "rxjs";
import { CurrencyPipe } from "@angular/common";
import { CurrencyInfo } from "src/app/models/currency-info";

@Component({
  selector: "coin",
  templateUrl: "./coin.component.html",
  styleUrls: ["./coin.component.scss"],
  providers: [CurrencyPipe]
})
export class CoinComponent implements OnInit, OnChanges {
  @Input() name: string;
  @Input() iconId: string;
  @Input() price: number;
  @Input() currency: CurrencyInfo;
  @Input() precision: number;
  displayedPrice: string;

  constructor(private currencyPipe: CurrencyPipe) {}

  ngOnInit() {}

  ngOnChanges() {}
}
