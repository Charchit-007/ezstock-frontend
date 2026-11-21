import type { TradeOrder } from "../types/order";
import api from "./axios";

interface TradeRequest {
  symbol: string;
  quantity: number;
}

export const orderApi = {
  async getMyOrders(): Promise<TradeOrder[]> {
    const { data } = await api.get<TradeOrder[]>("/api/orders/me");
    return data;
  },
  async buy(payload: TradeRequest): Promise<TradeOrder> {
    const { data } = await api.post<TradeOrder>("/api/orders/buy", payload);
    return data;
  },
  async sell(payload: TradeRequest): Promise<TradeOrder> {
    const { data } = await api.post<TradeOrder>("/api/orders/sell", payload);
    return data;
  },
};
