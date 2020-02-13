import { Price } from "./price";
import { PortfolioCoinItem } from "./portfolio-coin-item";

export class Purchase extends PortfolioCoinItem {
  currency: string;

  constructor() {
    super();
  }
}
