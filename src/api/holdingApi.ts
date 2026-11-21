import type { Holding, PortfolioSummary } from "../types/holding";
import api from "./axios";

export const holdingApi = {
  async getMyPortfolio(): Promise<Holding[]> {
    const { data } = await api.get<Holding[]>("/api/portfolio/me");
    return data;
  },
  async getSummary(): Promise<PortfolioSummary> {
    const { data } = await api.get<PortfolioSummary>("/api/portfolio/me/summary");
    return data;
  },
};
