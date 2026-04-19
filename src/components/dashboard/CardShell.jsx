import { useState } from "react";

export function CardShell({ title, action, children, className = "" }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article
      onClick={() => setExpanded((v) => !v)}
      className={`group rounded-2xl border border-slate-800 bg-[#111827]/70 p-4 md:p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-600 hover:shadow-[0_12px_30px_rgba(2,6,23,0.45)] cursor-pointer ${expanded ? "md:scale-[1.01]" : ""} ${className}`}
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold tracking-wide text-slate-100">{title}</h3>
        {action}
      </div>
      {children}
    </article>
  );
}
