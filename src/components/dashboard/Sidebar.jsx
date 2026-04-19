import {
  LayoutDashboard,
  CheckSquare,
  Flame,
  Target,
  BookOpen,
  Sparkles,
  Settings,
  UserCircle2,
  ChartNoAxesCombined,
  CalendarClock,
  BellRing,
  PlugZap,
  DatabaseBackup
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../app/auth/AuthContext";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/growth", label: "Growth", icon: Target },
  { to: "/learning", label: "Learning", icon: BookOpen },
  { to: "/schedule", label: "Schedule Hub", icon: CalendarClock },
  { to: "/coach", label: "AI Planner + Coach", icon: Sparkles },
  { to: "/integrations", label: "Integrations", icon: PlugZap },
  { to: "/backup", label: "Backup", icon: DatabaseBackup },
  { to: "/analytics", label: "Analytics", icon: ChartNoAxesCombined }
];

export function Sidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();

  return (
    <aside className="w-full md:w-72 md:min-h-screen bg-[#0a0d14]/90 border-r border-slate-800/80 p-4 md:p-5 flex md:flex-col gap-4 md:gap-8 backdrop-blur-xl">
      <div className="hidden md:block">
        <div className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 px-3 py-2 border border-cyan-400/30">
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
          <h1 className="text-lg font-semibold tracking-tight">Cortex-AI</h1>
        </div>
      </div>

      <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
        {links.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm whitespace-nowrap transition-all duration-200 ${
                active
                  ? "bg-slate-800 border-cyan-400/40 text-white shadow-[0_0_0_1px_rgba(34,211,238,0.2)]"
                  : "border-transparent text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Icon size={16} className="transition-transform group-hover:scale-110" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="hidden md:flex mt-auto flex-col gap-2 rounded-2xl bg-slate-900/70 border border-slate-800 p-3">
        <div className="flex items-center gap-2 text-slate-200 text-sm">
          <UserCircle2 size={16} />
          <span>{user?.email || "User"}</span>
        </div>
        <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800 transition">
          <Settings size={15} />
          <span className="text-sm">Settings</span>
        </button>
        <button onClick={signOut} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-red-300 hover:text-red-200 hover:bg-red-500/10 transition">
          <span className="text-sm">Log out</span>
        </button>
      </div>
    </aside>
  );
}
