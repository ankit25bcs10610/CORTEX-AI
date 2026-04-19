export function SectionCard({ title, subtitle, right, children }) {
  return (
    <section className="card p-4 md:p-5">
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {subtitle ? <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p> : null}
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}
