export class CoinInfo {
  eurPrice: number;
  eurMarketCap: number;
  eurATH: number;
  marketCapRank: number;
  name: string;
  queryId: string;

  constructor() {
    this.eurPrice = 0;
    this.eurMarketCap = 0;
    this.name = "";
    this.queryId = "";
  }
}
