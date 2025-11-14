export default function Testimonials() {
  const testimonials = [
    {
      name: "Dr. Eleanor Hughes",
      role: "Head of Quality Assurance, BioCore Labs",
      quote:
        "CleanAudits transformed how we manage inspections. Our compliance readiness improved dramatically within months.",
    },
    {
      name: "James Patel",
      role: "Regulatory Affairs Manager, PharmaNext",
      quote:
        "The system’s analytics and tracking tools made FDA audit preparation seamless. A true game changer for GMP operations.",
    },
    {
      name: "Sophie Zhang",
      role: "Clinical Operations Director, Genetech UK",
      quote:
        "CleanAudits bridges the gap between data and decisions. It’s intuitive, secure, and pharma-grade reliable.",
    },
  ];

  return (
    <section className="bg-background py-20 px-8 text-center transition-colors duration-300">
      <h2 className="text-3xl font-semibold text-primary mb-12">
        What Industry Experts Say
      </h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="bg-surface p-8 rounded-xl shadow-subtle border border-border hover:border-accent hover:shadow-lg transition-all duration-300"
          >
            <p className="italic text-text-secondary mb-6">“{t.quote}”</p>
            <h4 className="font-medium text-accent">{t.name}</h4>
            <p className="text-sm text-text-secondary/80">{t.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
