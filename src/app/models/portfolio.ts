import { Price } from "./price";
import { Purchase } from "./purchase";
import { PortfolioCoinData } from "./portfolio-coin-data";

export class Portfolio {
  startingCoinValues: Map<string, Purchase>;
  currentCoinValues: Map<string, PortfolioCoinData>;
  userId: string;
  startDate: Date;
  totalInitialVal: Price;
  accruedValue: number;

  constructor() {
    this.userId = null;
    this.startingCoinValues = new Map();
  }
}
