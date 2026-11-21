import { useSearchParams } from "react-router-dom";
import { useConfirm } from "../components/ConfirmDialog";
import { ErrorState } from "../components/ErrorState";
import { useToast } from "../components/Toast";
import { AmountForm } from "../features/wallet/AmountForm";
import { useDeposit, useWallet, useWithdraw } from "../features/wallet/useWallet";
import { formatCurrency } from "../utils/currency";
import { getErrorMessage } from "../utils/errors";

export default function WalletPage() {
  const [params] = useSearchParams();
  const action = params.get("action");
  const wallet = useWallet();
  const deposit = useDeposit();
  const withdraw = useWithdraw();
  const { notify } = useToast();
  const { confirm, dialog } = useConfirm();

  const handleDeposit = async (amount: number) => {
    try {
      await deposit.mutateAsync(amount);
      notify("success", `Deposited ${formatCurrency(amount)}.`);
    } catch (error) {
      notify("error", getErrorMessage(error));
      throw error;
    }
  };

  const handleWithdraw = async (amount: number) => {
    const ok = await confirm({
      title: "Confirm withdrawal",
      message: `Withdraw ${formatCurrency(amount)} from your wallet?`,
      confirmLabel: "Withdraw",
      tone: "danger",
    });
    if (!ok) return false;
    try {
      await withdraw.mutateAsync(amount);
      notify("success", `Withdrew ${formatCurrency(amount)}.`);
    } catch (error) {
      notify("error", getErrorMessage(error));
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Wallet</h1>

      <section aria-label="Current balance" className="card p-6">
        <p className="text-sm text-muted">Current balance</p>
        {wallet.isPending ? (
          <div role="status" aria-label="Loading balance" className="mt-2 h-10 w-48 animate-pulse rounded-lg bg-canvas" />
        ) : wallet.isError ? (
          <div className="mt-3"><ErrorState message={getErrorMessage(wallet.error)} onRetry={() => wallet.refetch()} /></div>
        ) : (
          <p className="money mt-1 text-4xl font-extrabold tracking-tight" data-testid="balance">
            {formatCurrency(wallet.data.balance)}
          </p>
        )}
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <AmountForm
          id="deposit"
          title="Deposit"
          description="Add money to your wallet."
          submitLabel="Deposit"
          pendingLabel="Depositing…"
          tone="primary"
          autoFocus={action === "deposit"}
          onSubmit={handleDeposit}
        />
        <AmountForm
          id="withdraw"
          title="Withdraw"
          description="Move money out of your wallet. You'll confirm before it goes through."
          submitLabel="Withdraw"
          pendingLabel="Withdrawing…"
          tone="danger"
          autoFocus={action === "withdraw"}
          onSubmit={handleWithdraw}
        />
      </div>
      {dialog}
    </div>
  );
}
