export type TransactionType = "DEPOSIT" | "WITHDRAWAL" | "BUY" | "SELL";

export interface Transaction {
  id: number;
  walletId: number;
  type: TransactionType;
  amount: number;
  stockSymbol?: string | null;
  createdAt: string;
}
