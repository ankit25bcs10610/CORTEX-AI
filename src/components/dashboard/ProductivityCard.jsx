import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { CardShell } from "./CardShell";

export function ProductivityCard({ productivity }) {
  const data = [{ name: "score", value: productivity.score, fill: "#22d3ee" }];

  return (
    <CardShell title="Productivity Score" action={<span className="text-xs text-emerald-300">+{productivity.weeklyDelta}% vs last week</span>}>
      <div className="h-48 relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart innerRadius="70%" outerRadius="100%" startAngle={90} endAngle={-270} data={data}>
            <RadialBar dataKey="value" cornerRadius={10} background={{ fill: "#1e293b" }} animationDuration={800} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-4xl font-semibold text-white">{productivity.score}</p>
          <p className="text-xs text-slate-400">out of 100</p>
        </div>
      </div>
    </CardShell>
  );
}
