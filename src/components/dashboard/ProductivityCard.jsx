import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { CardShell } from "./CardShell";

export function ProductivityCard({ productivity }) {
  const data = [{ name: "score", value: productivity.score }];

  return (
    <CardShell 
      title="Productivity Score" 
      action={<div className="flex items-center gap-1 text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">+{productivity.weeklyDelta}% vs prev</div>}
    >
      <div className="h-48 relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart 
            innerRadius="80%" 
            outerRadius="100%" 
            barSize={12} 
            data={data} 
            startAngle={90} 
            endAngle={-270}
          >
            <RadialBar
              background={{ fill: "#0f172a" }}
              dataKey="value"
              cornerRadius={20}
              fill="#22d3ee"
              animationDuration={1500}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-5xl font-black text-white tracking-tighter shadow-blue-500/20">{productivity.score}</p>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Consistency</p>
        </div>
      </div>
    </CardShell>
  );
}
