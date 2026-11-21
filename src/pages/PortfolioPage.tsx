import { Link } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { useOrders, usePortfolio, usePortfolioSummary } from "../features/trading/useTrading";
import { formatCurrency } from "../utils/currency";
import { formatDateTime } from "../utils/date";
import { getErrorMessage } from "../utils/errors";

export default function PortfolioPage() {
  const portfolio = usePortfolio();
  const summary = usePortfolioSummary();
  const orders = useOrders();
  const profitClass = (value: number) => value >= 0 ? "text-gain" : "text-loss";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Portfolio</h1>
        <p className="mt-1 text-muted">Your current holdings and executed orders.</p>
      </div>
      {summary.isPending ? (
        <div className="card"><LoadingState label="Loading portfolio summary…" /></div>
      ) : summary.isError ? (
        <ErrorState message={getErrorMessage(summary.error)} onRetry={() => summary.refetch()} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card p-5"><p className="text-sm text-muted">Total invested</p><p className="money mt-1 text-2xl font-bold">{formatCurrency(summary.data.totalInvested)}</p></div>
          <div className="card p-5"><p className="text-sm text-muted">Current value</p><p className="money mt-1 text-2xl font-bold">{formatCurrency(summary.data.currentValue)}</p></div>
          <div className="card p-5"><p className="text-sm text-muted">Profit / loss</p><p className={`money mt-1 text-2xl font-bold ${profitClass(summary.data.profitLoss)}`}>{summary.data.profitLoss >= 0 ? "+" : ""}{formatCurrency(summary.data.profitLoss)}</p></div>
          <div className="card p-5"><p className="text-sm text-muted">Return</p><p className={`mt-1 text-2xl font-bold ${profitClass(summary.data.profitLossPercentage)}`}>{summary.data.profitLossPercentage >= 0 ? "+" : ""}{summary.data.profitLossPercentage.toFixed(2)}%</p></div>
        </div>
      )}
      <section className="card overflow-hidden">
        <h2 className="border-b border-line px-5 py-4 text-lg font-bold">Holdings</h2>
        {portfolio.isPending ? <LoadingState label="Loading portfolio…" /> :
          portfolio.isError ? <div className="p-5"><ErrorState message={getErrorMessage(portfolio.error)} onRetry={() => portfolio.refetch()} /></div> :
          portfolio.data.length === 0 ? <EmptyState title="No holdings yet" description="Buy a stock from the Market page to build your portfolio." /> :
          <div className="overflow-x-auto"><table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-canvas text-xs uppercase tracking-wide text-muted"><tr>
              <th className="px-5 py-3">Stock</th><th className="px-5 py-3 text-right">Quantity</th>
              <th className="px-5 py-3 text-right">Average price</th><th className="px-5 py-3 text-right">Current price</th>
              <th className="px-5 py-3 text-right">Market value</th><th className="px-5 py-3 text-right">Profit / loss</th>
            </tr></thead>
            <tbody className="divide-y divide-line">{portfolio.data.map((holding) => <tr key={holding.id}>
              <td className="px-5 py-4">
                <Link
                  to={`/market?symbol=${encodeURIComponent(holding.symbol)}`}
                  className="font-bold text-gain hover:underline"
                >
                  {holding.symbol}
                </Link>
                <p className="text-xs text-muted">{holding.companyName}</p>
              </td>
              <td className="px-5 py-4 text-right">{holding.quantity}</td>
              <td className="money px-5 py-4 text-right">{formatCurrency(holding.averageBuyPrice)}</td>
              <td className="money px-5 py-4 text-right">{formatCurrency(holding.currentPrice)}</td>
              <td className="money px-5 py-4 text-right font-semibold">{formatCurrency(holding.marketValue)}</td>
              <td className={`money px-5 py-4 text-right font-semibold ${profitClass(holding.unrealizedProfitLoss)}`}>{holding.unrealizedProfitLoss >= 0 ? "+" : ""}{formatCurrency(holding.unrealizedProfitLoss)}<span className="ml-1 text-xs">({holding.unrealizedProfitLossPercentage.toFixed(2)}%)</span></td>
            </tr>)}</tbody>
          </table></div>}
      </section>
      <section className="card overflow-hidden">
        <h2 className="border-b border-line px-5 py-4 text-lg font-bold">Order history</h2>
        {orders.isPending ? <LoadingState label="Loading orders…" /> :
          orders.isError ? <div className="p-5"><ErrorState message={getErrorMessage(orders.error)} onRetry={() => orders.refetch()} /></div> :
          orders.data.length === 0 ? <EmptyState title="No orders yet" description="Your buy and sell orders will appear here." /> :
          <div className="overflow-x-auto"><table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-canvas text-xs uppercase tracking-wide text-muted"><tr>
              <th className="px-5 py-3">Date</th><th className="px-5 py-3">Order</th><th className="px-5 py-3 text-right">Quantity</th><th className="px-5 py-3 text-right">Total</th>
            </tr></thead>
            <tbody className="divide-y divide-line">{orders.data.map((order) => <tr key={order.id}>
              <td className="px-5 py-4 text-muted">{formatDateTime(order.createdAt)}</td>
              <td className="px-5 py-4"><span className={order.type === "BUY" ? "font-bold text-gain" : "font-bold text-loss"}>{order.type}</span><p className="text-xs text-muted">{order.symbol}</p></td>
              <td className="px-5 py-4 text-right">{order.quantity} @ {formatCurrency(order.executionPrice)}</td>
              <td className="money px-5 py-4 text-right font-semibold">{formatCurrency(order.totalAmount)}</td>
            </tr>)}</tbody>
          </table></div>}
      </section>
    </div>
  );
}
