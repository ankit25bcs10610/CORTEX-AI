import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { CardShell } from "./CardShell";

export function WeeklyTrendCard({ trend }) {
  return (
    <CardShell 
      title="Intelligence Velocity" 
      action={<div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-black uppercase tracking-widest">Momentum Stable</div>}
    >
      <div className="h-56 -ml-4 -mr-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trend} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.5} />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#475569", fontSize: 10, fontWeight: 900 }} 
              dy={10}
            />
            <YAxis hide domain={[60, 90]} />
            <Tooltip 
              contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "12px", borderShadow: "20px" }} 
              itemStyle={{ color: "#22d3ee", fontWeight: "bold" }}
            />
            <Area 
              type="monotone" 
              dataKey="score" 
              stroke="#22d3ee" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorTrend)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CardShell>
  );
}
