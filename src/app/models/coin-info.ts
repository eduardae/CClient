import { CommunityData } from "./community-data";
import { DevelopmentData } from "./development-data";

export class CoinInfo {
  eurPrice: number;
  eurMarketCap: number;
  volume24H: number;
  eurATH: number;
  marketCapRank: number;
  name: string;
  queryId: string;
  liquidityScore: number;
  communityData: CommunityData;
  developmentData: DevelopmentData;
  selected: boolean;

  constructor() {
    this.eurPrice = 0;
    this.eurMarketCap = 0;
    this.name = "";
    this.queryId = "";
    this.communityData = new CommunityData();
    this.developmentData = new DevelopmentData();
  }
}
