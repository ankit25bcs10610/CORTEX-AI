import { Medal } from "lucide-react";
import { useLifeStore } from "../../app/store";
import { CardShell } from "./CardShell";

export function AchievementsCard() {
  const achievements = useLifeStore((s) => s.gamification?.achievements || []);
  const unlocked = achievements.filter((a) => a.unlocked).length;
  const now = Date.now();

  return (
    <CardShell title="Achievements" action={<span className="text-xs text-slate-300">{unlocked}/{achievements.length} unlocked</span>}>
      <div className="grid grid-cols-1 gap-2">
        {achievements.map((a) => {
          const justUnlocked = a.unlockedAt && now - new Date(a.unlockedAt).getTime() < 120000;
          return (
            <div key={a.id} className={`rounded-xl border p-2 ${a.unlocked ? "border-emerald-400/40 bg-emerald-400/10" : "border-[var(--panel-border)] bg-black/20"} ${justUnlocked ? "achievement-pop" : ""}`}>
              <p className="text-sm text-slate-100 inline-flex items-center gap-2"><Medal size={14} className={a.unlocked ? "text-emerald-300" : "text-slate-500"} /> {a.title}</p>
              <p className="text-xs text-slate-400">{a.description}</p>
            </div>
          );
        })}
      </div>
    </CardShell>
  );
}
