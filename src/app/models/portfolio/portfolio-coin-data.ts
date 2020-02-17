import { Price } from "../price";
import { PortfolioCoinItem } from "./portfolio-coin-item";

export class PortfolioCoinData extends PortfolioCoinItem {
  growth: number;
  val: number;
  price: Price;
  quantity: number;

  constructor() {
    super();
    this.growth = 0;
  }
}
