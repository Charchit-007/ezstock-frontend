import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { holdingApi } from "../../api/holdingApi";
import { orderApi } from "../../api/orderApi";
import { queryKeys } from "../../api/queryKeys";

export function usePortfolio() {
  return useQuery({ queryKey: queryKeys.portfolio, queryFn: holdingApi.getMyPortfolio });
}

export function usePortfolioSummary() {
  return useQuery({ queryKey: [...queryKeys.portfolio, "summary"], queryFn: holdingApi.getSummary });
}

export function useOrders() {
  return useQuery({ queryKey: queryKeys.orders, queryFn: orderApi.getMyOrders });
}

export function useTrade(type: "BUY" | "SELL") {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { symbol: string; quantity: number }) =>
      type === "BUY" ? orderApi.buy(payload) : orderApi.sell(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.wallet }),
        queryClient.invalidateQueries({ queryKey: queryKeys.portfolio }),
        queryClient.invalidateQueries({ queryKey: queryKeys.orders }),
        queryClient.invalidateQueries({ queryKey: queryKeys.transactions }),
      ]);
    },
  });
}
