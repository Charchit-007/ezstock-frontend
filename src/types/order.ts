export type OrderType = "BUY" | "SELL";

export interface TradeOrder {
  id: number;
  symbol: string;
  companyName: string;
  type: OrderType;
  quantity: number;
  executionPrice: number;
  totalAmount: number;
  createdAt: string;
}
