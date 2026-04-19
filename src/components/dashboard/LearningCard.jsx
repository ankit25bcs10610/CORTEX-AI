import { ArrowUpRight } from "lucide-react";
import { CardShell } from "./CardShell";

export function LearningCard({ learning }) {
  return (
    <CardShell title="Learning Tracker" action={<span className="text-xs text-slate-400">3 active tracks</span>}>
      <div className="space-y-3">
        {learning.map((item) => (
          <div key={item.id} className="rounded-xl border border-slate-800 p-3 bg-slate-900/40">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm text-slate-100">{item.topic}</p>
                <p className="text-xs text-slate-500">{item.type} • Next: {item.next}</p>
              </div>
              <span className="text-xs text-cyan-200">{item.progress}%</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-cyan-400" style={{ width: `${item.progress}%` }} />
            </div>
          </div>
        ))}
      </div>
      <button className="mt-3 w-full rounded-xl border border-cyan-400/40 bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-100 py-2 text-sm transition inline-flex items-center justify-center gap-2">
        Continue Learning <ArrowUpRight size={14} />
      </button>
    </CardShell>
  );
}
