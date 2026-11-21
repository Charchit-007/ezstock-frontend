interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="rounded-xl border border-loss/30 bg-loss-soft px-5 py-6 text-center">
      <p className="font-semibold text-loss">We couldn't load this</p>
      <p className="mt-1 text-sm text-ink">{message}</p>
      {onRetry && (
        <button type="button" className="btn-ghost mt-4" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
