interface MarketData
{
  high:number;
  low:number;
  open:number;
  price_change_percentage_24h:number;
  current:number;
  lastUpdated:string;
}

export interface CryptoDataFailedResponse
{
  success:boolean;
  code:number;
  message:string;
}

export interface CryptoDataResponse extends CryptoDataFailedResponse
{
  description:string;
  imageUrl:string;
  marketRank:number;
  creationDate:string;
  marketData:MarketData;
}