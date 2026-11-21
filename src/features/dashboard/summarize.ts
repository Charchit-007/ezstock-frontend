import type { Transaction } from "../../types/transaction";
import { dayKey, formatDay } from "../../utils/date";

export interface Totals {
  deposits: number;
  withdrawals: number;
}

export interface DailyFlow {
  day: string;
  deposits: number;
  withdrawals: number;
}

export function summarize(transactions: Transaction[]): Totals {
  return transactions.reduce<Totals>(
    (acc, t) => {
      if (t.type === "DEPOSIT" || t.type === "SELL") acc.deposits += t.amount;
      else acc.withdrawals += t.amount;
      return acc;
    },
    { deposits: 0, withdrawals: 0 },
  );
}

/** Deposits and withdrawals per calendar day for the last `days` days, oldest first. */
export function dailyFlow(transactions: Transaction[], days = 7, now = new Date()): DailyFlow[] {
  const buckets = new Map<string, DailyFlow>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    buckets.set(dayKey(d), { day: formatDay(d), deposits: 0, withdrawals: 0 });
  }
  for (const t of transactions) {
    const bucket = buckets.get(dayKey(new Date(t.createdAt)));
    if (!bucket) continue;
    if (t.type === "DEPOSIT" || t.type === "SELL") bucket.deposits += t.amount;
    else bucket.withdrawals += t.amount;
  }
  return [...buckets.values()];
}
