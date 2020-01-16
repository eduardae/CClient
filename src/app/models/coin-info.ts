import { CommunityData } from "./community-data";
import { DevelopmentData } from "./development-data";

export class CoinInfo {
  price: number;
  marketCap: number;
  volume24H: number;
  ATH: number;
  marketCapRank: number;
  name: string;
  queryId: string;
  liquidityScore: number;
  communityData: CommunityData;
  developmentData: DevelopmentData;
  selected: boolean;

  constructor() {
    this.price = 0;
    this.marketCap = 0;
    this.name = "";
    this.queryId = "";
    this.communityData = new CommunityData();
    this.developmentData = new DevelopmentData();
  }
}
