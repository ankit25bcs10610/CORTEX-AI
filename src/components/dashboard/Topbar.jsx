import { useEffect, useState } from "react";
import { Bell, Bot, Command, Search } from "lucide-react";

const themes = [
  ["aurora", "Aurora"],
  ["graphite", "Graphite"],
  ["sunset", "Sunset"],
  ["neon", "Neon Sky"],
  ["forest", "Forest"],
  ["rose", "Rose"]
];

function getGreetingEffect() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 22) return "Good Evening";
  return "Good Night";
}

export function Topbar({ name = "Ankit", view, setView, theme, setTheme, onOpenCommand }) {
  const [greeting, setGreeting] = useState(getGreetingEffect());

  useEffect(() => {
    const timer = setInterval(() => {
      setGreeting(getGreetingEffect());
    }, 60000); // Check every minute
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)]/80 backdrop-blur-xl p-4 mb-4 flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between transition-colors duration-300">
      <div className="relative w-full lg:max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          className="w-full rounded-xl border border-[var(--panel-border)] bg-black/20 pl-9 pr-3 py-2 text-sm outline-none focus:border-[var(--accent-soft)]"
          placeholder="Search tasks, goals, habits..."
        />
      </div>

      <div className="flex items-center gap-2 sm:gap-3 justify-between lg:justify-end">
        <div className="hidden sm:flex items-center gap-1 rounded-lg border border-[var(--panel-border)] bg-black/20 p-1">
          {[
            ["daily", "Daily"],
            ["weekly", "Weekly"]
          ].map(([k, label]) => (
            <button
              key={k}
              onClick={() => setView(k)}
              className={`px-3 py-1.5 text-xs rounded-md transition ${view === k ? "bg-[var(--accent-bg)] text-[var(--accent-text)]" : "text-slate-300 hover:text-white"}`}
            >
              {label}
            </button>
          ))}
        </div>

        <select value={theme} onChange={(e) => setTheme(e.target.value)} className="rounded-lg border border-[var(--panel-border)] bg-black/20 px-2 py-1.5 text-xs text-slate-200">
          {themes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <button onClick={onOpenCommand} className="p-2 rounded-lg border border-[var(--panel-border)] text-slate-300 hover:text-white hover:border-slate-500 transition" title="Command Palette">
          <Command size={16} />
        </button>
        <button className="p-2 rounded-lg border border-[var(--panel-border)] text-slate-300 hover:text-white hover:border-slate-500 transition">
          <Bell size={16} />
        </button>
        <button className="p-2 rounded-lg border border-[var(--accent-soft)] text-[var(--accent-text)] bg-[var(--accent-bg)] hover:opacity-90 transition">
          <Bot size={16} />
        </button>
      </div>

      <div className="text-sm text-slate-300 lg:ml-3">{greeting}, <span className="text-white font-medium">{name}</span> 👋</div>
    </header>
  );
}
