import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../api/queryKeys";
import { walletApi } from "../../api/walletApi";

export function useWallet() {
  return useQuery({ queryKey: queryKeys.wallet, queryFn: () => walletApi.getMyWallet() });
}

function useWalletMutation(fn: (amount: number) => Promise<unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (amount: number) => fn(amount),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.wallet }),
        queryClient.invalidateQueries({ queryKey: queryKeys.transactions }),
      ]);
    },
  });
}

export const useDeposit = () => useWalletMutation(walletApi.deposit);
export const useWithdraw = () => useWalletMutation(walletApi.withdraw);
