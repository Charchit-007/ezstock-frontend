export interface Holding {
  id: number;
  symbol: string;
  companyName: string;
  quantity: number;
  averageBuyPrice: number;
  currentPrice: number;
  marketValue: number;
  investedAmount: number;
  unrealizedProfitLoss: number;
  unrealizedProfitLossPercentage: number;
}

export interface PortfolioSummary {
  totalInvested: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
}
