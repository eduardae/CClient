import { Price } from "../price";

export class PortfolioCoinItem {
  price: Price;
  quantity: number;

  constructor() {
    this.price = new Price();
    this.quantity = 0;
  }
}
