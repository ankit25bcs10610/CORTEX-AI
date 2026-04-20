import { ArrowUpRight, BookOpen, Layers } from "lucide-react";
import { CardShell } from "./CardShell";

export function LearningCard({ learning }) {
  return (
    <CardShell 
      title="Knowledge Architecture" 
      action={<div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest">{learning.length} Active Tracks</div>}
    >
      <div className="grid gap-4">
        {learning.map((item) => (
          <div key={item.id} className="p-5 rounded-[1.8rem] border border-slate-800/80 bg-slate-950/40 relative group overflow-hidden transition-all hover:border-cyan-500/30">
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/20 group-hover:bg-cyan-500/60 transition-all" />
            
            <div className="flex items-start justify-between gap-4 relative z-10">
              <div>
                <h4 className="text-sm font-bold text-slate-100 mb-1">{item.topic}</h4>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                   <span className="text-cyan-400">{item.type}</span>
                   <span className="text-slate-800">•</span>
                   <span>Next: {item.next}</span>
                </div>
              </div>
              <p className="text-xs font-black text-cyan-200 uppercase tracking-tighter">{item.progress}%</p>
            </div>
            
            <div className="mt-4 h-1.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800/50">
              <div 
                className="h-full bg-gradient-to-r from-cyan-600 to-blue-500 rounded-full transition-all duration-1000" 
                style={{ width: `${item.progress}%` }} 
              />
            </div>
          </div>
        ))}
      </div>
      
      <button className="mt-6 w-full rounded-[1.5rem] bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-4 transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl">
        SYNCHRONIZE VAULT <Layers size={18} />
      </button>
    </CardShell>
  );
}
