import { Component, Input, OnInit, OnChanges } from "@angular/core";
import { HttpClient } from "@angular/common/http";
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
  @Input() tooltipTxt: string;
  @Input() iconId: string;
  @Input() iconUrl: string;
  @Input() price: number;
  @Input() currency: CurrencyInfo;
  @Input() precision: number;
  @Input() nameWeight: number;
  @Input() iconSizeMultiplier: number;
  @Input() quantity: number;
  displayedPrice: string;

  constructor(private currencyPipe: CurrencyPipe) {}

  ngOnInit() {}

  ngOnChanges() {}
}
