import { Price } from "./price";

export class Purchase {
  price: Price;
  quantity: number;
  currency: string;

  constructor() {
    this.price = new Price();
    this.quantity = 0;
  }
}
