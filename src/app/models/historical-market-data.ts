import { Tick } from './tick';

export class HistoricalMarketData {

  marketCaps: Tick[];
  prices: Tick[];
  totalVolumes: Tick[];


  constructor() {
    this.marketCaps = null;
    this.prices = null;
    this.totalVolumes = null;
   }

}
