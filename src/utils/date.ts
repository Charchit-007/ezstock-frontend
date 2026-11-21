const locale = import.meta.env.VITE_LOCALE ?? "en-IN";

const dateTime = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" });
const dayLabel = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" });

export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : dateTime.format(date);
}

export function formatDay(date: Date): string {
  return dayLabel.format(date);
}

/** Local-calendar key such as 2026-11-14, used for grouping. */
export function dayKey(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${m}-${d}`;
}
