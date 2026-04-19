import { useEffect, useState } from "react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Topbar } from "../components/dashboard/Topbar";
import { CommandPalette } from "../components/dashboard/CommandPalette";
import { useLifeStore } from "../app/store";

export function AppShell({ children }) {
  const [view, setView] = useState("daily");
  const [theme, setTheme] = useState(() => localStorage.getItem("cortex-ai-theme") || "aurora");
  const [commandOpen, setCommandOpen] = useState(false);
  const generateRecurringTasksToday = useLifeStore((s) => s.generateRecurringTasksToday);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    localStorage.setItem("cortex-ai-theme", theme);
  }, [theme]);

  useEffect(() => {
    generateRecurringTasksToday();
  }, [generateRecurringTasksToday]);

  return (
    <div className={`theme-${theme}`}>
      <div className="min-h-screen md:flex app-bg text-slate-100 transition-colors duration-300">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-7">
          <h2 className="text-3xl font-semibold text-white mb-1">Welcome to Cortex-AI</h2>
          <Topbar
            name="Ankit"
            view={view}
            setView={setView}
            theme={theme}
            setTheme={setTheme}
            onOpenCommand={() => setCommandOpen(true)}
          />
          {typeof children === "function" ? children({ view }) : children}
        </main>
        <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
      </div>
    </div>
  );
}
