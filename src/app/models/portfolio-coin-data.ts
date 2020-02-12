import { Price } from "./price";

export class PortfolioCoinData {
  price: Price;
  quantity: number;
  growth: number;

  constructor() {
    this.price = new Price();
    this.quantity = 0;
    this.growth = 0;
  }
}
