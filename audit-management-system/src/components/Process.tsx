const steps = [
  {
    title: "Plan",
    detail: "Select the right template, generate the audit ID, and assign owners before you start walking the floor.",
  },
  {
    title: "Execute",
    detail: "Capture rooms, people, documents, and photos inline. Enforce required fields to avoid gaps.",
  },
  {
    title: "Evaluate",
    detail: "Tag findings with severity, CAPA, recurrence, and categories. Keep risk consistent across teams.",
  },
  {
    title: "Report",
    detail: "Publish PDF or Word immediately with linked evidence, signatures, and distribution notes.",
  },
];

export default function Process() {
  return (
    <section className="py-16 px-6 bg-background text-foreground">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-wide">Operating rhythm</p>
            <h2 className="text-3xl font-semibold mt-1">A calm, auditable flow from start to signed report</h2>
            <p className="text-text-secondary max-w-3xl mt-2">
              CleanAudits keeps every step structured so teams can move fast without losing traceability.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="rounded-2xl border border-border bg-surface/80 shadow-subtle p-4 space-y-2 relative overflow-hidden"
            >
              <span className="absolute right-4 top-3 text-xs font-semibold text-primary/60">
                {index + 1}
              </span>
              <h3 className="text-lg font-semibold text-primary">{step.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{step.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
