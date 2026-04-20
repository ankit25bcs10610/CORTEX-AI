import { useMemo } from "react";
import { 
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, 
  BarChart, Bar, CartesianGrid, Cell, RadialBarChart, RadialBar
} from "recharts";
import { 
  TrendingUp, Zap, Target, Binary, 
  ChevronRight, ArrowUpRight, Shield 
} from "lucide-react";
import { useLifeStore } from "../../app/store";
import { CardShell } from "../../components/dashboard/CardShell";

export function AnalyticsPage() {
  const { tasks, habits, goals, learning } = useLifeStore();

  const trend = useMemo(() => {
    const base = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return base.map((d, i) => ({
      day: d,
      score: Math.min(100, 55 + i * 5 + Math.round((tasks.filter((t) => t.status === "Completed").length || 0) / 2)),
      output: Math.round(Math.random() * 20 + 40)
    }));
  }, [tasks]);

  const distribution = useMemo(
    () => [
      { name: "Tasks", value: tasks.filter((t) => t.status === "Completed").length, color: "#22d3ee" },
      { name: "Habits", value: habits.reduce((acc, h) => acc + (h.completions?.length || 0), 0), color: "#818cf8" },
      { name: "Goals", value: goals.filter((g) => g.status === "Completed").length, color: "#c084fc" },
      { name: "Learning", value: learning.filter((l) => l.status === "Completed").length, color: "#fb7185" }
    ],
    [tasks, habits, goals, learning]
  );

  const efficiencyData = [{ name: "Efficiency", value: 84, fill: "#22d3ee" }];

  return (
    <div className="space-y-8 pb-16">
      {/* Tactical Intelligence HUD Header */}
      <header className="relative overflow-hidden rounded-[2.5rem] bg-[#0a0d14] border border-cyan-500/20 p-8 md:p-14 shadow-[0_0_80px_-20px_rgba(34,211,238,0.2)]">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 blur-[150px] rounded-full -mr-48 -mt-48 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full -ml-32 -mb-32 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div>
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
              <Binary size={14} className="animate-pulse" /> Neural Diagnostic Mode
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white mb-4 tracking-tighter uppercase leading-[0.85]">Intelligence <span className="text-cyan-500">Analytics</span></h1>
            <p className="text-slate-400 text-lg max-w-2xl font-medium leading-relaxed italic opacity-80 decoration-cyan-500/30">Deconstructing patterns. Quantifying momentum. Optimizing core execution velocity.</p>
          </div>
        </div>
      </header>

      {/* Tactical Metric Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Execution Velocity", val: "84.2", unit: "pts/d", icon: Zap, color: "text-cyan-400", bg: "bg-cyan-500/10" },
          { label: "Diagnostic Accuracy", val: "99.4", unit: "%", icon: Target, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Neural Consistency", val: "12", unit: "days", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Output Integrity", val: "842", unit: "units", icon: Shield, color: "text-rose-400", bg: "bg-rose-500/10" },
        ].map((m, i) => (
          <div key={i} className="p-6 rounded-[2rem] border border-slate-800/60 bg-slate-900/40 backdrop-blur-md relative overflow-hidden group hover:border-slate-700 transition-all">
             <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity ${m.color}`}><m.icon size={48} /></div>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">{m.label}</p>
             <div className="flex items-baseline gap-2">
                <p className="text-3xl font-black text-white tracking-tighter">{m.val}</p>
                <p className={`text-[10px] font-black uppercase tracking-widest ${m.color}`}>{m.unit}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Productivity Velocity Visualization */}
        <div className="lg:col-span-8 h-full">
          <CardShell 
            title="Intelligence Velocity Trend" 
            action={<div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest">Momentum +12%</div>}
          >
            <div className="h-80 -ml-4 -mr-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                  <YAxis hide domain={[40, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "1.5rem", boxShadow: "0 20px 50px -12px rgba(0,0,0,0.5)" }} 
                    itemStyle={{ color: "#22d3ee", fontWeight: 900, textTransform: "uppercase", fontSize: "10px" }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#22d3ee" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorTrend)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardShell>
        </div>

        {/* Neural Core Consistency Gauge */}
        <div className="lg:col-span-4 h-full">
          <CardShell 
             title="Neural Core Efficiency" 
             action={<div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest">Real-time</div>}
          >
            <div className="h-80 relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  innerRadius="80%" 
                  outerRadius="100%" 
                  barSize={16} 
                  data={efficiencyData} 
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
                <p className="text-6xl font-black text-white tracking-tighter italic">84</p>
                <div className="flex items-center gap-1.5 mt-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Efficiency Rating</p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-6 border-t border-slate-800/50 flex justify-between items-center px-2">
               <div>
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Status</p>
                  <p className="text-xs font-black text-cyan-400 uppercase tracking-tight">Focus Stable</p>
               </div>
               <div className="text-right">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Peak Core</p>
                  <p className="text-xs font-black text-white uppercase tracking-tight">92% Level</p>
               </div>
            </div>
          </CardShell>
        </div>

        {/* Cross-Domain Execution Mix */}
        <div className="lg:col-span-12 h-full mt-4">
          <CardShell title="Sector Output Distribution" action={<div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Weighted Ops: {distribution.reduce((acc, d) => acc + d.value, 0)}</div>}>
             <div className="h-64 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distribution} margin={{ bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.3} />
                    <XAxis 
                       dataKey="name" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fill: "#475569", fontSize: 10, fontWeight: 900 }} 
                       dy={10}
                    />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#475569", fontSize: 10, fontWeight: 900 }} />
                    <Tooltip 
                       cursor={{ fill: "rgba(255,255,255,0.03)" }}
                       contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "1.5rem" }} 
                       itemStyle={{ fontWeight: 900, textTransform: "uppercase", fontSize: "10px" }}
                    />
                    <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={60}>
                       {distribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                       ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </CardShell>
        </div>
      </div>
    </div>
  );
}
