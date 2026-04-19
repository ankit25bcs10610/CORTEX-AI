import { Sparkles } from "lucide-react";
import { CardShell } from "./CardShell";

export function AIInsightCard({ ai }) {
  return (
    <CardShell
      title="AI Insights"
      className="bg-gradient-to-br from-cyan-500/15 via-sky-500/10 to-slate-900/90 border-cyan-400/30"
      action={<span className="inline-flex items-center gap-1 text-xs text-cyan-100"><Sparkles size={14} /> Live Coach</span>}
    >
      <div className="space-y-3">
        <div className="rounded-xl border border-cyan-400/20 bg-slate-950/40 p-3">
          <p className="text-xs uppercase tracking-wider text-cyan-200/80 mb-1">Personalized</p>
          <p className="text-sm text-slate-100">{ai.suggestion}</p>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-3">
          <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">Recommendation</p>
          <p className="text-sm text-slate-200">{ai.recommendation}</p>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-3">
          <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">Weekly Insight</p>
          <p className="text-sm text-slate-200">{ai.weekly}</p>
        </div>
      </div>
    </CardShell>
  );
}
