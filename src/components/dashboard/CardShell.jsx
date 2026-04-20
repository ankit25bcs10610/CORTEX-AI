import { useState } from "react";

export function CardShell({ title, action, children, className = "" }) {
  return (
    <article
      className={`group h-full rounded-[2.2rem] border border-slate-800/40 bg-gradient-to-br from-[#0a0d14]/90 to-[#0f172a]/95 p-6 md:p-8 transition-all duration-700 hover:border-blue-500/30 hover:shadow-[0_15px_40px_-20px_rgba(59,130,246,0.3)] relative overflow-hidden flex flex-col ${className}`}
    >
      {/* Dynamic Neural Aura */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 blur-[80px] rounded-full -mr-20 -mt-20 pointer-events-none group-hover:bg-blue-500/10 transition-all duration-1000" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/5 blur-[70px] rounded-full -ml-20 -mb-20 pointer-events-none group-hover:bg-indigo-500/10 transition-all duration-1000" />
      
      <div className="mb-6 flex items-center justify-between gap-4 relative z-10">
        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 group-hover:text-blue-400 transition-colors duration-500">{title}</h3>
        <div className="relative z-10">{action}</div>
      </div>
      
      <div className="relative z-10 flex-1 flex flex-col">
        {children}
      </div>
    </article>
  );
}
