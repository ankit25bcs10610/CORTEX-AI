import { Flame, Target, TrendingUp, ChevronRight, Zap } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Cell } from "recharts";
import { CardShell } from "./CardShell";
import { Link } from "react-router-dom";

export function GrowthCard({ habits, goals }) {
  const habitData = ["M", "T", "W", "T", "F", "S", "S"].map((d, i) => ({
    day: d,
    completed: habits.reduce((acc, h) => acc + (h.week?.[i] ? 1 : 0), 0)
  }));

  const totalPossible = habits.length * 7;
  const totalCompleted = habitData.reduce((acc, d) => acc + d.completed, 0);
  const momentum = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

  return (
    <CardShell 
      title="Strategic Progression" 
      action={
        <Link to="/growth" className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl hover:bg-blue-500/20 transition-all text-blue-400">
          <ChevronRight size={18} />
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Momentum Metric Engine */}
        <div className="relative overflow-hidden p-6 rounded-[1.8rem] bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent border border-blue-500/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full -mr-16 -mt-16 pointer-events-none" />
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]">
                <TrendingUp size={22} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Momentum Engine</p>
                <div className="flex items-baseline gap-1">
                   <p className="text-3xl font-black text-white italic">{momentum}%</p>
                   <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">+12%</span>
                </div>
              </div>
            </div>
            <div className="h-14 w-28 -mr-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={habitData}>
                  <Bar dataKey="completed" radius={[4, 4, 0, 0]}>
                    {habitData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.completed > 0 ? "#22d3ee" : "#1e293b"} fillOpacity={entry.completed > 0 ? 0.8 : 0.3} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Active Streaks Module */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
               <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400"><Flame size={14} /></div>
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Neural Streaks</h4>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {habits.slice(0, 3).map((habit) => (
                <div key={habit.id} className="group flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/40 border border-slate-900 transition-all hover:border-orange-500/30">
                  <div className="flex items-center gap-3">
                     <div className="w-1.5 h-6 rounded-full bg-orange-500/20 group-hover:bg-orange-500/60 transition-colors" />
                     <span className="text-sm font-bold text-slate-200">{habit.name}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-[10px] font-black border border-orange-500/20">
                    <Zap size={10} /> {habit.streak} DAY STREAK
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vision Objectives */}
          <div className="space-y-4 pt-2 border-t border-slate-800/50">
            <div className="flex items-center gap-2 mb-2">
               <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400"><Target size={14} /></div>
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Core Vision Alignment</h4>
            </div>
            <div className="space-y-5">
              {goals.slice(0, 2).map((goal) => (
                <div key={goal.id} className="space-y-2.5">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs font-black text-slate-300 uppercase tracking-tight truncate">{goal.title}</p>
                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">{goal.progress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-900 p-0.5">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_15px_-3px_rgba(34,211,238,0.4)] transition-all duration-1000" 
                      style={{ width: `${goal.progress}%` }} 
                    />
                  </div>
                  <div className="flex justify-between items-center opacity-40">
                     <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Horizon: {goal.deadline}</p>
                     <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Priority 01</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </CardShell>
  );
}
