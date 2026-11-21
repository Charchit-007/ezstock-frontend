const currency = import.meta.env.VITE_CURRENCY ?? "INR";
const locale = import.meta.env.VITE_LOCALE ?? "en-IN";

const formatter = new Intl.NumberFormat(locale, {
  style: "currency",
  currency,
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

export function formatCurrency(value: number): string {
  return formatter.format(value);
}
