import { Trophy, Star, Zap, Award } from "lucide-react";
import { useLifeStore } from "../../app/store";
import { CardShell } from "./CardShell";

export function GamificationCard() {
  const gamification = useLifeStore((s) => s.gamification);
  const xp = gamification?.xp || 0;
  const level = gamification?.level || 1;
  const progress = xp % 100;

  return (
    <CardShell 
       title="Neural Progression" 
       action={<div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest"><Trophy size={12} /> Rank 0{level}</div>}
    >
      <div className="mb-6 relative">
        <div className="flex items-center justify-between mb-3">
           <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500 text-white shadow-[0_0_20px_-5px_rgba(245,158,11,0.5)]">
                 <Zap size={22} fill="currentColor" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-0.5">Total Experience</p>
                 <p className="text-3xl font-black text-white tracking-widest leading-none">{xp} <span className="text-[10px] text-slate-500 font-bold ml-1">XP</span></p>
              </div>
           </div>
        </div>
        
        <div className="space-y-2">
           <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
              <span>Next Level Core</span>
              <span className="text-amber-500">{100 - progress} XP Left</span>
           </div>
           <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-900 group">
             <div 
               className="h-full bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 rounded-full shadow-[0_0_15px_-3px_rgba(245,158,11,0.5)] transition-all duration-1000 group-hover:scale-x-[1.02] origin-left" 
               style={{ width: `${progress}%` }} 
             />
           </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
           <Award size={14} className="text-blue-400" />
           Active Weekly Ops
        </h4>
        <div className="grid gap-2">
          {(gamification?.weeklyChallenges || []).map((c) => (
            <div key={c.id} className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-900 group hover:border-blue-500/30 transition-all">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs font-bold text-slate-300">{c.title}</span>
                <span className="text-[10px] font-black text-blue-400">{Math.min(c.progress, c.target)}/{c.target}</span>
              </div>
              <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${c.completed ? 'bg-emerald-500 shadow-[0_0_10px_-2px_rgba(16,185,129,0.5)]' : 'bg-blue-600'}`} 
                  style={{ width: `${Math.min(100, (c.progress / c.target) * 100)}%` }} 
                />
              </div>
              <div className="mt-2 flex items-center justify-between">
                 <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{c.completed ? "Mission Success" : "Mission Active"}</p>
                 <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Reward +{c.rewardXp} XP</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-800/50">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Intelligence Honors</p>
        <div className="flex flex-wrap gap-2">
          {(gamification?.rewards || []).slice(0, 4).map((r) => (
            <div key={r.id} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800/50 text-[10px] font-bold text-slate-400 hover:text-white transition-colors">
               <Star size={12} className="text-amber-500" /> {r.label}
            </div>
          ))}
          {!(gamification?.rewards || []).length ? <p className="text-xs text-slate-500 italic opacity-50">Capture milestones to earn honors.</p> : null}
        </div>
      </div>
    </CardShell>
  );
}
