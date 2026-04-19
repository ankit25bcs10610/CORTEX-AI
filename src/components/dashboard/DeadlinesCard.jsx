import { AlertTriangle } from "lucide-react";
import { CardShell } from "./CardShell";

const riskClass = {
  high: "text-rose-200 border-rose-400/40 bg-rose-400/10",
  medium: "text-amber-200 border-amber-400/40 bg-amber-400/10",
  low: "text-emerald-200 border-emerald-400/40 bg-emerald-400/10"
};

export function DeadlinesCard({ deadlines }) {
  return (
    <CardShell title="Upcoming Deadlines" action={<AlertTriangle size={14} className="text-amber-300" />}>
      <div className="space-y-2">
        {deadlines.map((d) => (
          <div key={d.id} className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-100">{d.title}</p>
              <span className={`text-[11px] px-2 py-0.5 rounded-full border ${riskClass[d.risk]}`}>{d.risk}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{d.type} • {d.date}</p>
          </div>
        ))}
      </div>
    </CardShell>
  );
}
