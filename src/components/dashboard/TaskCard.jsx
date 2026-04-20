import { useMemo, useState } from "react";
import { CheckCircle2, Clock } from "lucide-react";
import { CardShell } from "./CardShell";

const priorityConfig = {
  High: {
    bg: "bg-rose-500/10 border-rose-500/20 text-rose-200",
    glow: "shadow-[0_0_20px_-8px_rgba(239,68,68,0.3)]",
    dot: "bg-rose-500"
  },
  Medium: {
    bg: "bg-cyan-500/10 border-cyan-500/20 text-cyan-200",
    glow: "shadow-[0_0_20px_-8px_rgba(34,211,238,0.3)]",
    dot: "bg-cyan-500"
  },
  Low: {
    bg: "bg-slate-800/40 border-slate-700/50 text-slate-400",
    glow: "",
    dot: "bg-slate-600"
  }
};

export function TaskCard({ tasks }) {
  const [items, setItems] = useState(tasks);
  const done = useMemo(() => items.filter((t) => t.done).length, [items]);
  const progress = Math.round((done / items.length) * 100);

  return (
    <CardShell 
      title="Tactical Objectives" 
      action={<div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest">{done}/{items.length} Finalized</div>}
    >
      <div className="grid gap-3">
        {items.map((task) => {
          const config = priorityConfig[task.priority] || priorityConfig.Low;
          return (
            <label 
              key={task.id} 
              className={`group/task flex items-center gap-4 p-4 rounded-[1.5rem] border transition-all duration-500 cursor-pointer backdrop-blur-sm ${config.bg} ${config.glow} hover:scale-[1.02] hover:bg-slate-800/40`}
            >
              <div className="relative flex items-center justify-center">
                <input 
                  type="checkbox" 
                  checked={task.done} 
                  onChange={() => setItems((prev) => prev.map((x) => (x.id === task.id ? { ...x, done: !x.done } : x)))} 
                  className="peer absolute opacity-0 w-6 h-6 cursor-pointer"
                />
                <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${task.done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-700 group-hover/task:border-slate-500'}`}>
                  {task.done && <CheckCircle2 size={14} className="text-white" />}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className={`text-sm font-bold tracking-tight transition-all truncate ${task.done ? "line-through text-slate-500" : "text-white"}`}>
                    {task.title}
                  </p>
                  <div className={`px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest`}>
                    {task.priority}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.1em]">
                   <Clock size={10} /> {task.due}
                </div>
              </div>
            </label>
          );
        })}
      </div>
      
      <div className="mt-8">
        <div className="flex items-center justify-between mb-2">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Execution Progress</p>
           <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">{progress}%</p>
        </div>
        <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800/50">
          <div className="h-full rounded-full bg-gradient-to-r from-cyan-600 via-blue-500 to-indigo-600 transition-all duration-1000 shadow-[0_0_15px_-2px_rgba(34,211,238,0.5)]" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </CardShell>
  );
}
