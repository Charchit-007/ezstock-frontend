import type { Transaction } from "../../types/transaction";
import { formatCurrency } from "../../utils/currency";
import { formatDateTime } from "../../utils/date";

export function TransactionTypeBadge({ type }: { type: Transaction["type"] }) {
  const isCredit = type === "DEPOSIT" || type === "SELL";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        isCredit ? "bg-gain-soft text-gain" : "bg-loss-soft text-loss"
      }`}
    >
      {type === "DEPOSIT" ? "Deposit" : type === "WITHDRAWAL" ? "Withdrawal" : type === "BUY" ? "Buy" : "Sell"}
    </span>
  );
}

export function TransactionAmount({ transaction }: { transaction: Transaction }) {
  const isCredit = transaction.type === "DEPOSIT" || transaction.type === "SELL";
  return (
    <span className={`money font-semibold ${isCredit ? "text-gain" : "text-loss"}`}>
      {isCredit ? "+" : "−"}
      {formatCurrency(transaction.amount)}
    </span>
  );
}

export function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] text-left text-sm">
        <caption className="sr-only">Your transactions, newest first</caption>
        <thead className="border-b border-line text-muted">
          <tr>
            <th scope="col" className="px-5 py-3 font-semibold">Type</th>
            <th scope="col" className="px-5 py-3 text-right font-semibold">Amount</th>
            <th scope="col" className="px-5 py-3 font-semibold">Date</th>
            <th scope="col" className="hidden px-5 py-3 font-semibold sm:table-cell">Transaction ID</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {transactions.map((t) => (
            <tr key={t.id}>
              <td className="px-5 py-3.5">
                <TransactionTypeBadge type={t.type} />
                {t.stockSymbol && <p className="mt-1 text-xs text-muted">{t.stockSymbol}</p>}
              </td>
              <td className="px-5 py-3.5 text-right"><TransactionAmount transaction={t} /></td>
              <td className="px-5 py-3.5 text-muted">{formatDateTime(t.createdAt)}</td>
              <td className="money hidden px-5 py-3.5 text-muted sm:table-cell">#{t.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
