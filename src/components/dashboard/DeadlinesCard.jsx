import { AlertCircle, Calendar, ShieldAlert } from "lucide-react";
import { CardShell } from "./CardShell";

const riskConfig = {
  high: {
    bg: "bg-rose-500/10 border-rose-500/20 text-rose-200",
    glow: "shadow-[0_0_20px_-8px_rgba(239,68,68,0.3)]",
    icon: "text-rose-500"
  },
  medium: {
    bg: "bg-amber-500/10 border-amber-500/20 text-amber-200",
    glow: "shadow-[0_0_20px_-8px_rgba(245,158,11,0.3)]",
    icon: "text-amber-500"
  },
  low: {
    bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-200",
    glow: "shadow-[0_0_20px_-8px_rgba(16,185,129,0.3)]",
    icon: "text-emerald-500"
  }
};

export function DeadlinesCard({ deadlines }) {
  return (
    <CardShell 
       title="Tactical Alerts" 
       action={<div className="p-1 px-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 pulse-subtle"><ShieldAlert size={12} /> Priority 01</div>}
    >
      <div className="grid gap-3">
        {deadlines.map((d) => {
          const config = riskConfig[d.risk?.toLowerCase()] || riskConfig.low;
          return (
            <div key={d.id} className={`p-4 rounded-[1.5rem] border transition-all duration-500 backdrop-blur-md hover:scale-[1.02] ${config.bg} ${config.glow}`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold tracking-tight">{d.title}</h4>
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-[0.2em] ${config.icon}`}>
                   {d.risk}
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                 <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <Calendar size={10} /> {d.date}
                 </div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-60 italic">{d.type}</p>
              </div>
            </div>
          );
        })}
      </div>
    </CardShell>
  );
}
