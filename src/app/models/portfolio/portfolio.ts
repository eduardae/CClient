import { Price } from "../price";
import { Purchase } from "../purchase";
import { PortfolioCoinData } from "./portfolio-coin-data";
import { PortfolioSummary } from "./portfolio-summary";

export class Portfolio {
  _id: string;
  label: string;
  startingCoinValues: Map<string, Purchase>;
  currentCoinValues: Map<string, PortfolioCoinData>;
  userId: string;
  startDate: Date;
  summary: PortfolioSummary;

  constructor() {
    this.userId = null;
    this.startingCoinValues = new Map();
  }
}
