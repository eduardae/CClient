export class Portfolio {
  startingCoinValues: Record<string, number>;
  userId: string;

  constructor() {
    this.userId = null;
    this.startingCoinValues = {};
  }
}
