import type { MarketChart, MarketQuote, MarketSearchResult } from "../types/market";
import api from "./axios";

export const marketApi = {
  async getQuote(symbol: string): Promise<MarketQuote> {
    const { data } = await api.get<MarketQuote>("/api/market/quote", { params: { symbol } });
    return data;
  },
  async getChart(symbol: string, interval: string, range: string): Promise<MarketChart> {
    const { data } = await api.get<MarketChart>("/api/market/candles", {
      params: { symbol, interval, range },
    });
    return data;
  },
  async search(query: string): Promise<MarketSearchResult[]> {
    const { data } = await api.get<MarketSearchResult[]>("/api/market/search", { params: { q: query } });
    return data;
  },
};
