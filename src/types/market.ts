export interface MarketQuote {
  symbol: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  timestamp: number;
}

export interface MarketCandle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketMeta {
  symbol: string;
  currency: string;
  exchange: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  timestamp: number;
}

export interface MarketChart {
  meta: MarketMeta;
  candles: MarketCandle[];
}

export interface MarketSearchResult {
  symbol: string;
  shortName: string;
  longName: string;
  exchange: string;
  quoteType: string;
}
