import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "../../utils/currency";
import type { DailyFlow } from "./summarize";

export default function CashFlowChart({ data }: { data: DailyFlow[] }) {
  return (
    <div className="h-56 w-full" role="img" aria-label="Deposits and withdrawals over the last 7 days">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }} barGap={2}>
          <CartesianGrid vertical={false} stroke="#e2e7ef" />
          <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "#566781", fontSize: 12 }} />
          <YAxis hide />
          <Tooltip
            cursor={{ fill: "#f4f6f9" }}
            formatter={(value, name) => [formatCurrency(Number(value)), name === "deposits" ? "Deposits" : "Withdrawals"]}
          />
          <Bar dataKey="deposits" fill="#0a8f5c" radius={[4, 4, 0, 0]} />
          <Bar dataKey="withdrawals" fill="#c93434" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
