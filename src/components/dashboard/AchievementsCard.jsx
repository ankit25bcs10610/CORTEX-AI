import { Medal, Trophy, Award } from "lucide-react";
import { useLifeStore } from "../../app/store";
import { CardShell } from "./CardShell";

export function AchievementsCard() {
  const achievements = useLifeStore((s) => s.gamification?.achievements || []);
  const unlocked = achievements.filter((a) => a.unlocked).length;

  return (
    <CardShell 
       title="Legacy Medallions" 
       action={<div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest"><Award size={12} /> {unlocked}/{achievements.length} FEATS UNLOCKED</div>}
    >
      <div className="grid grid-cols-2 gap-3">
        {achievements.map((a) => (
          <div key={a.id} className={`p-4 rounded-[1.8rem] border transition-all duration-500 flex flex-col items-center justify-center text-center gap-3 group/medallion ${
            a.unlocked 
              ? "bg-emerald-500/10 border-emerald-500/30 shadow-[0_10px_30px_-10px_rgba(16,185,129,0.2)]" 
              : "bg-slate-950/40 border-slate-900 opacity-60"
          }`}>
            <div className={`p-3 rounded-2xl transition-all duration-700 ${
              a.unlocked 
                ? "bg-emerald-500 text-white shadow-[0_0_20px_-5px_rgba(16,185,129,0.6)] group-hover/medallion:scale-110" 
                : "bg-slate-900 text-slate-700"
            }`}>
              <Medal size={24} />
            </div>
            <div>
              <p className={`text-[10px] font-black uppercase tracking-tight mb-1 ${a.unlocked ? "text-white" : "text-slate-600"}`}>{a.title}</p>
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-tight">{a.description}</p>
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  );
}
