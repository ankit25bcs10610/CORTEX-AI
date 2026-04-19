export function PageIntro({ title, subtitle, chips = [] }) {
  return (
    <section className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)]/70 px-4 py-4 md:px-5 md:py-5 mb-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-white">{title}</h1>
          <p className="text-sm text-slate-300 mt-1">{subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <span key={chip} className="badge border-[var(--panel-border)] text-slate-200">{chip}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
