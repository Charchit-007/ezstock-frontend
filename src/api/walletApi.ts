import type { AmountRequest, Wallet } from "../types/wallet";
import api from "./axios";

export const walletApi = {
  async getMyWallet(): Promise<Wallet> {
    const { data } = await api.get<Wallet>("/api/wallet/me");
    return data;
  },
  async deposit(amount: number): Promise<Wallet> {
    const body: AmountRequest = { amount };
    const { data } = await api.post<Wallet>("/api/wallet/me/deposit", body);
    return data;
  },
  async withdraw(amount: number): Promise<Wallet> {
    const body: AmountRequest = { amount };
    const { data } = await api.post<Wallet>("/api/wallet/me/withdraw", body);
    return data;
  },
};
