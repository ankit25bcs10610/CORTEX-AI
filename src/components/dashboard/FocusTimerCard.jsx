import { useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { CardShell } from "./CardShell";

const WORK_SECONDS = 25 * 60;

function fmt(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function FocusTimerCard() {
  const [seconds, setSeconds] = useState(WORK_SECONDS);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return undefined;
    const t = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setRunning(false);
          return WORK_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(t);
  }, [running]);

  const pct = useMemo(() => Math.round(((WORK_SECONDS - seconds) / WORK_SECONDS) * 100), [seconds]);

  return (
    <CardShell title="Focus Timer" action={<span className="text-xs text-slate-400">Pomodoro 25m</span>}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-4xl font-semibold tracking-tight">{fmt(seconds)}</p>
        <span className="badge">{pct}%</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
        <div className="h-full bg-[var(--accent)] transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex gap-2">
        <button onClick={() => setRunning((v) => !v)} className="flex-1 rounded-lg border border-[var(--accent-soft)] bg-[var(--accent-bg)] py-2 text-sm inline-flex items-center justify-center gap-2">
          {running ? <Pause size={14} /> : <Play size={14} />}
          {running ? "Pause" : "Start"}
        </button>
        <button onClick={() => { setRunning(false); setSeconds(WORK_SECONDS); }} className="rounded-lg border border-slate-700 px-3 py-2 text-slate-300 hover:text-white">
          <RotateCcw size={14} />
        </button>
      </div>
    </CardShell>
  );
}
