import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { ArrowDownIcon, ArrowUpIcon } from "../components/icons";
import { LoadingState } from "../components/LoadingState";
import { dailyFlow, summarize } from "../features/dashboard/summarize";
import { TransactionAmount, TransactionTypeBadge } from "../features/transactions/TransactionTable";
import { useTransactions } from "../features/transactions/useTransactions";
import { useWallet } from "../features/wallet/useWallet";
import { usePortfolioSummary } from "../features/trading/useTrading";
import { formatCurrency } from "../utils/currency";
import { formatDateTime } from "../utils/date";
import { getErrorMessage } from "../utils/errors";

// Recharts is the heaviest dependency, so it loads only when the dashboard is opened.
const CashFlowChart = lazy(() => import("../features/dashboard/CashFlowChart"));

export default function DashboardPage() {
  const { user } = useAuth();
  const wallet = useWallet();
  const transactions = useTransactions();
  const portfolioSummary = usePortfolioSummary();

  const rows = transactions.data ?? [];
  const totals = summarize(rows);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
        {user ? `Welcome back, ${user.username}` : "Welcome back"}
      </h1>

      <section aria-label="Wallet balance" className="rounded-2xl bg-ink p-6 text-white sm:p-8">
        <p className="text-sm text-white/70">Available balance</p>
        {wallet.isPending ? (
          <div className="mt-3 h-12 w-56 animate-pulse rounded-lg bg-white/10" aria-label="Loading balance" role="status" />
        ) : wallet.isError ? (
          <div role="alert" className="mt-3">
            <p className="text-white/80">{getErrorMessage(wallet.error)}</p>
            <button type="button" className="mt-2 text-sm font-semibold text-gain-bright underline" onClick={() => wallet.refetch()}>
              Try again
            </button>
          </div>
        ) : (
          <p className="money mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl" data-testid="balance">
            {formatCurrency(wallet.data.balance)}
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/wallet?action=deposit" className="btn bg-gain-bright text-ink hover:bg-gain-bright/90">
            <ArrowDownIcon width={18} height={18} /> Deposit
          </Link>
          <Link to="/wallet?action=withdraw" className="btn border border-white/25 text-white hover:bg-white/10">
            <ArrowUpIcon width={18} height={18} /> Withdraw
          </Link>
          <Link to="/transactions" className="btn text-white/80 hover:text-white">
            View transactions
          </Link>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <p className="text-sm text-muted">Total deposits</p>
          <p className="money mt-1 text-2xl font-bold text-gain">{transactions.isSuccess ? formatCurrency(totals.deposits) : "—"}</p>
        </div>

        {portfolioSummary.isSuccess && (
          <section className="card p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Portfolio performance</h2>
                <p className="text-sm text-muted">Current value compared with your invested amount.</p>
              </div>
              <Link to="/portfolio" className="text-sm font-semibold text-gain hover:underline">View portfolio</Link>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div><p className="text-sm text-muted">Current value</p><p className="money mt-1 text-xl font-bold">{formatCurrency(portfolioSummary.data.currentValue)}</p></div>
              <div><p className="text-sm text-muted">Invested</p><p className="money mt-1 text-xl font-bold">{formatCurrency(portfolioSummary.data.totalInvested)}</p></div>
              <div><p className="text-sm text-muted">Profit / loss</p><p className={`money mt-1 text-xl font-bold ${portfolioSummary.data.profitLoss >= 0 ? "text-gain" : "text-loss"}`}>{portfolioSummary.data.profitLoss >= 0 ? "+" : ""}{formatCurrency(portfolioSummary.data.profitLoss)} ({portfolioSummary.data.profitLossPercentage.toFixed(2)}%)</p></div>
            </div>
          </section>
        )}
        <div className="card p-5">
          <p className="text-sm text-muted">Total withdrawals</p>
          <p className="money mt-1 text-2xl font-bold text-loss">{transactions.isSuccess ? formatCurrency(totals.withdrawals) : "—"}</p>
        </div>
      </div>

      {transactions.isPending ? (
        <div className="card"><LoadingState label="Loading activity…" /></div>
      ) : transactions.isError ? (
        <ErrorState message={getErrorMessage(transactions.error)} onRetry={() => transactions.refetch()} />
      ) : (
        <>
          <section className="card p-5 sm:p-6">
            <h2 className="text-lg font-bold">Last 7 days</h2>
            <p className="mb-4 text-sm text-muted">Money in and out, by day.</p>
            <Suspense fallback={<LoadingState label="Loading chart…" />}>
              <CashFlowChart data={dailyFlow(rows)} />
            </Suspense>
          </section>

          <section className="card">
            <div className="flex items-center justify-between px-5 pt-5 sm:px-6">
              <h2 className="text-lg font-bold">Recent transactions</h2>
              <Link to="/transactions" className="text-sm font-semibold text-gain hover:underline">See all</Link>
            </div>
            {rows.length === 0 ? (
              <EmptyState
                title="No transactions yet"
                description="Deposit money to see your activity here."
                action={<Link to="/wallet?action=deposit" className="btn-primary">Make a deposit</Link>}
              />
            ) : (
              <ul className="mt-2 divide-y divide-line">
                {rows.slice(0, 5).map((t) => (
                  <li key={t.id} className="flex items-center justify-between gap-3 px-5 py-3.5 sm:px-6">
                    <div>
                      <TransactionTypeBadge type={t.type} />
                      <p className="mt-1 text-xs text-muted">{formatDateTime(t.createdAt)}</p>
                    </div>
                    <TransactionAmount transaction={t} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
