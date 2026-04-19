import { Trophy, Star, Zap } from "lucide-react";
import { useLifeStore } from "../../app/store";
import { CardShell } from "./CardShell";

export function GamificationCard() {
  const gamification = useLifeStore((s) => s.gamification);
  const xp = gamification?.xp || 0;
  const level = gamification?.level || 1;
  const progress = xp % 100;

  return (
    <CardShell title="Gamification" action={<span className="text-xs text-amber-300 inline-flex items-center gap-1"><Trophy size={13} /> Level {level}</span>}>
      <div className="mb-3">
        <p className="text-3xl font-semibold text-white inline-flex items-center gap-2"><Zap size={18} className="text-[var(--accent-hex)]" /> {xp} XP</p>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden mt-2">
          <div className="h-full bg-[var(--accent)]" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-xs text-slate-400 mt-1">{100 - progress} XP to next level</p>
      </div>

      <div className="space-y-2 mb-3">
        {(gamification?.weeklyChallenges || []).map((c) => (
          <div key={c.id} className="rounded-lg border border-[var(--panel-border)] bg-black/20 p-2">
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>{c.title}</span>
              <span>{Math.min(c.progress, c.target)}/{c.target}</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-[var(--accent)]" style={{ width: `${Math.min(100, (c.progress / c.target) * 100)}%` }} />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Reward +{c.rewardXp} XP {c.completed ? "• Completed" : ""}</p>
          </div>
        ))}
      </div>

      <div>
        <p className="text-xs text-slate-400 mb-1">Recent Rewards</p>
        <div className="space-y-1">
          {(gamification?.rewards || []).slice(0, 3).map((r) => (
            <p key={r.id} className="text-xs text-slate-300 inline-flex items-center gap-1"><Star size={12} className="text-amber-300" /> {r.label}</p>
          ))}
          {!(gamification?.rewards || []).length ? <p className="text-xs text-slate-500">Complete actions to earn XP rewards.</p> : null}
        </div>
      </div>
    </CardShell>
  );
}
