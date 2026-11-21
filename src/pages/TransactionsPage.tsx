import { useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { TransactionTable } from "../features/transactions/TransactionTable";
import { useTransactions } from "../features/transactions/useTransactions";
import { getErrorMessage } from "../utils/errors";

const PAGE_SIZE = 10;

export default function TransactionsPage() {
  const { data, isPending, isError, error, refetch } = useTransactions();
  const [page, setPage] = useState(0);

  const total = data?.length ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const current = Math.min(page, pageCount - 1);
  const rows = data?.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE) ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Transactions</h1>

      <div className="card overflow-hidden">
        {isPending ? (
          <LoadingState label="Loading transactions…" />
        ) : isError ? (
          <div className="p-5"><ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} /></div>
        ) : total === 0 ? (
          <EmptyState
            title="No transactions yet"
            description="Deposits and withdrawals will show up here."
            action={<Link to="/wallet?action=deposit" className="btn-primary">Make a deposit</Link>}
          />
        ) : (
          <>
            <TransactionTable transactions={rows} />
            {pageCount > 1 && (
              <nav aria-label="Pagination" className="flex items-center justify-between border-t border-line px-5 py-3 text-sm">
                <span className="text-muted">Page {current + 1} of {pageCount}</span>
                <div className="flex gap-2">
                  <button type="button" className="btn-ghost px-3 py-1.5" disabled={current === 0} onClick={() => setPage(current - 1)}>
                    Previous
                  </button>
                  <button type="button" className="btn-ghost px-3 py-1.5" disabled={current >= pageCount - 1} onClick={() => setPage(current + 1)}>
                    Next
                  </button>
                </div>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
}
