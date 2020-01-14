import { Component, Input, OnInit, OnChanges } from "@angular/core";
import { Http } from "@angular/http";
import { from } from "rxjs";
import { CurrencyPipe } from "@angular/common";
import { CurrencyInfo } from "src/app/models/currency-info";

@Component({
  selector: "horizontal-loader",
  templateUrl: "./horizontal-loader.component.html",
  styleUrls: ["./horizontal-loader.scss"],
  providers: [CurrencyPipe]
})
export class HorizontalLoader implements OnInit, OnChanges {
  constructor() {}

  ngOnInit() {}

  ngOnChanges() {}
}
