import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CardShell } from "./CardShell";

export function WeeklyTrendCard({ trend }) {
  return (
    <CardShell title="Weekly Trend" action={<span className="text-xs text-slate-400">Momentum</span>}>
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trend}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <YAxis hide domain={[60, 90]} />
            <Tooltip cursor={{ stroke: "rgba(148,163,184,0.3)" }} />
            <Line type="monotone" dataKey="score" stroke="var(--accent-hex)" strokeWidth={2.5} dot={{ r: 3, fill: "var(--accent-hex)" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardShell>
  );
}
