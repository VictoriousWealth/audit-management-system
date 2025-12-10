import Link from "next/link";

const featureGroups = [
  {
    title: "Gemba Walks",
    description: "Guide auditors on structured walk-throughs with location-aware prompts and instant evidence capture.",
    points: [
      "Mobile-friendly paths with timed stops and photos/notes per station",
      "Smart reminders to close observations before moving on",
      "Share live progress with stakeholders without breaking the walk",
    ],
  },
  {
    title: "Smart Reports",
    description: "Generate decision-ready reports the moment an audit ends.",
    points: [
      "Auto-build narratives from findings, risks, and evidence",
      "Role-based views for auditors, QA, and leadership",
      "Publisher controls for redactions and staged releases",
    ],
  },
  {
    title: "Audit Checklists",
    description: "Reusable, versioned checklists keep teams aligned across audits.",
    points: [
      "Template library with change history and ownership",
      "Conditional logic for hybrid/remote audits",
      "Inline guidance to keep findings consistent",
    ],
  },
  {
    title: "Front Room",
    description: "Host and share files with auditors in a controlled, time-boxed space.",
    points: [
      "One-click evidence bundles with watermarking and expirations",
      "Live Q&A threads per request to reduce email sprawl",
      "Real-time status on what’s delivered and what’s pending",
    ],
  },
  {
    title: "Back Room",
    description: "Prepare quietly while the front room runs smoothly.",
    points: [
      "Staging area for draft documents before release",
      "Internal-only chat and assignments for rapid triage",
      "Pre-approved responses to accelerate handoffs",
    ],
  },
  {
    title: "Traceable Workflows",
    description: "Every action is linked to an owner, timestamp, and evidence.",
    points: [
      "End-to-end audit timeline from planning to closure",
      "Searchable activity log with exportable trails",
      "Controls for segregation of duties and approvals",
    ],
  },
  {
    title: "CAPA Management",
    description: "Turn findings into actions with full accountability.",
    points: [
      "Smart assignment with due dates and impact scoring",
      "Verification steps with sign-off and supporting proof",
      "Automated follow-ups for overdue items",
    ],
  },
  {
    title: "Audit Completion",
    description: "Finish strong with structured checklists and flexible notes.",
    points: [
      "Closure checklists for evidence, signatures, and distribution",
      "Free-text narrative alongside structured fields",
      "Hybrid modes to support onsite + remote teams",
    ],
  },
];

export default function ExploreFeaturesPage() {
  return (
    <div className="bg-background text-foreground px-6 py-16 md:py-20 w-full">
      <div className="max-w-6xl mx-auto space-y-12">
        <section className="text-center space-y-4">
          <p className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            Explore the platform
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold">
            Audit excellence from walk-through to CAPA closure
          </h1>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            See how CleanAudits supports every stage—gemba walks, smart reports,
            front/back room collaboration, traceable workflows, and confident
            audit completion in hybrid environments.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          {featureGroups.map((group) => (
            <article
              key={group.title}
              className="rounded-2xl border border-border bg-surface/60 shadow-subtle p-6 space-y-3 hover:border-accent/70 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-semibold text-primary">
                  {group.title}
                </h2>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-accent/10 text-accent">
                  Built-in
                </span>
              </div>
              <p className="text-text-secondary leading-relaxed">
                {group.description}
              </p>
              <ul className="space-y-2 text-sm text-foreground/90">
                {group.points.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-accent" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-border bg-primary text-surface p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold">Ready to explore?</h3>
            <p className="text-surface/80">
              Walk through the full experience—from the front room handoff to
              CAPA closure—in a guided session with our team.
            </p>
          </div>
          <div className="flex gap-3 flex-col items-center"> 
            <Link
              href="/demo"
              className="inline-block border-3 border-accent text-background bg-primary font-black rounded-lg transition-all duration-300 p-2 w-max"
            >
              Request a Demo
            </Link>
            <Link
              href="/contact"
              className="inline-block border-3 border-accent text-background bg-primary font-black rounded-lg transition-all duration-300 p-2 w-max"
            >
              Schedule a Consultation
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
