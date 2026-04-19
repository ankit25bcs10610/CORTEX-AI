import { Flame, Target, TrendingUp, ChevronRight } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { CardShell } from "./CardShell";
import { Link } from "react-router-dom";

export function GrowthCard({ habits, goals }) {
  // Calculate habit completion trend
  const habitData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => ({
    day: d,
    completed: habits.reduce((acc, h) => acc + (h.week?.[i] ? 1 : 0), 0)
  }));

  const totalPossible = habits.length * 7;
  const totalCompleted = habitData.reduce((acc, d) => acc + d.completed, 0);
  const momentum = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

  return (
    <CardShell 
      title="Growth & Progress" 
      action={
        <Link to="/growth" className="p-1 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white">
          <ChevronRight size={18} />
        </Link>
      }
    >
      <div className="flex flex-col h-full gap-5">
        {/* Momentum Metric */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 border border-indigo-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <TrendingUp size={18} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Weekly Momentum</p>
              <p className="text-lg font-bold text-white">{momentum}%</p>
            </div>
          </div>
          <div className="h-10 w-24">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={habitData}>
                <Bar dataKey="completed" radius={[2, 2, 0, 0]}>
                  {habitData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.completed > 0 ? "#818cf8" : "#1e293b"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1">
          {/* Habits Pulse */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Flame size={12} className="text-orange-500" />
                Active Streaks
              </h3>
            </div>
            <div className="space-y-2">
              {habits.slice(0, 3).map((habit) => (
                <div key={habit.id} className="group relative overflow-hidden rounded-xl bg-slate-900/50 border border-slate-800/80 p-2.5 transition-all hover:border-orange-500/30">
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-xs font-medium text-slate-200">{habit.name}</span>
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 text-[10px] font-bold border border-orange-500/20">
                      🔥 {habit.streak}d
                    </div>
                  </div>
                  {/* Subtle progress background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>

          {/* Goals Vision */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Target size={12} className="text-cyan-400" />
              Vision Goals
            </h3>
            <div className="space-y-4">
              {goals.slice(0, 2).map((goal) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium text-slate-200 truncate">{goal.title}</p>
                    <span className="text-[10px] text-cyan-400 font-bold">{goal.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800/80 overflow-hidden border border-slate-700/30">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 transition-all duration-1000 ease-out" 
                      style={{ width: `${goal.progress}%` }} 
                    />
                  </div>
                  <p className="text-[9px] text-slate-500 flex justify-between">
                    <span>Target: {goal.deadline}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity italic">Keep shipping!</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </CardShell>
  );
}
