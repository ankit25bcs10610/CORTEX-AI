import { useMemo, useState } from "react";
import { CardShell } from "./CardShell";

const level = {
  High: "bg-rose-400/20 text-rose-200 border-rose-400/30",
  Medium: "bg-amber-400/20 text-amber-200 border-amber-400/30",
  Low: "bg-emerald-400/20 text-emerald-200 border-emerald-400/30"
};

export function TaskCard({ tasks }) {
  const [items, setItems] = useState(tasks);
  const done = useMemo(() => items.filter((t) => t.done).length, [items]);
  const progress = Math.round((done / items.length) * 100);

  return (
    <CardShell title="Today's Tasks" action={<span className="text-xs text-slate-400">{done}/{items.length} done</span>}>
      <div className="space-y-2">
        {items.map((task) => (
          <label key={task.id} className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-2.5">
            <input type="checkbox" checked={task.done} onChange={() => setItems((prev) => prev.map((x) => (x.id === task.id ? { ...x, done: !x.done } : x)))} className="mt-1 accent-cyan-400" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className={`text-sm truncate ${task.done ? "line-through text-slate-500" : "text-slate-200"}`}>{task.title}</p>
                <span className={`text-[10px] border rounded-full px-2 py-0.5 ${level[task.priority]}`}>{task.priority}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Due {task.due}</p>
            </div>
          </label>
        ))}
      </div>
      <div className="mt-4">
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </CardShell>
  );
}
