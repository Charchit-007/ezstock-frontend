import type { Transaction } from "../types/transaction";
import api from "./axios";

export const transactionApi = {
  async getMyTransactions(): Promise<Transaction[]> {
    const { data } = await api.get<Transaction[]>("/api/transactions/me");
    return data;
  },
};
