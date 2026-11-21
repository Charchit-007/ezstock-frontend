export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-12 text-muted">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-gain" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
