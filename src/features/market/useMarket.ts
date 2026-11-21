import { useQuery } from "@tanstack/react-query";
import { marketApi } from "../../api/marketApi";

export function useMarketQuote(symbol: string) {
  return useQuery({
    queryKey: ["market", "quote", symbol],
    queryFn: () => marketApi.getQuote(symbol),
    refetchInterval: 5000,
    staleTime: 4000,
  });
}

export function useMarketChart(symbol: string, interval: string, range: string) {
  return useQuery({
    queryKey: ["market", "chart", symbol, interval, range],
    queryFn: () => marketApi.getChart(symbol, interval, range),
    staleTime: 30_000,
  });
}

export function useMarketSearch(query: string) {
  return useQuery({
    queryKey: ["market", "search", query],
    queryFn: () => marketApi.search(query),
    enabled: query.trim().length >= 2,
    staleTime: 10 * 60_000,
  });
}
