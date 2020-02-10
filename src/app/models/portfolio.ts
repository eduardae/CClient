import { Price } from "./price";

export class Portfolio {
  startingCoinValues: Record<string, Price>;
  userId: string;
  startDate: Date;
  totalInitialVal: Price;

  constructor() {
    this.userId = null;
    this.startingCoinValues = {};
  }
}
