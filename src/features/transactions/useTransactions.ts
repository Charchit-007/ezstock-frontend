import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../api/queryKeys";
import { transactionApi } from "../../api/transactionApi";

export function useTransactions() {
  return useQuery({
    queryKey: queryKeys.transactions,
    queryFn: () => transactionApi.getMyTransactions(),
    // Newest first; ids break ties when timestamps match.
    select: (rows) => [...rows].sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id),
  });
}
