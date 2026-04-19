import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

const allActions = [
  "Create high-priority task",
  "Start 25m focus session",
  "Review missed habits",
  "Generate AI daily plan",
  "Open weekly insight",
  "Add new learning topic"
];

export function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const actions = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return allActions;
    return allActions.filter((a) => a.toLowerCase().includes(q));
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm p-4">
      <div className="mx-auto mt-20 max-w-xl rounded-2xl border border-slate-700 bg-[#0f1422] shadow-2xl overflow-hidden">
        <div className="p-3 border-b border-slate-800 flex items-center gap-2">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command..."
            className="w-full bg-transparent outline-none text-sm text-slate-100"
          />
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={16} /></button>
        </div>
        <div className="max-h-72 overflow-y-auto p-2">
          {actions.map((action) => (
            <button key={action} onClick={onClose} className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800/80 transition">
              {action}
            </button>
          ))}
          {!actions.length ? <p className="px-3 py-2 text-sm text-slate-500">No command found.</p> : null}
        </div>
      </div>
    </div>
  );
}
