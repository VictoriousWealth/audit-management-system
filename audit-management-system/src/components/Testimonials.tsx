export default function Testimonials() {
  const testimonials = [
    {
      name: "Dr. Eleanor Hughes",
      role: "Head of Quality Assurance, BioCore Labs",
      quote:
        "Clean Audits transformed how we manage inspections. Our compliance readiness improved dramatically within months.",
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
        "Clean Audits bridges the gap between data and decisions. It’s intuitive, secure, and pharma-grade reliable.",
    },
  ];

  return (
    <section className="bg-offwhite py-16 px-8 text-center">
      <h2 className="text-3xl font-bold text-purple mb-10">
        What Industry Experts Say
      </h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {testimonials.map((t, i) => (
          <div key={i} className="bg-white p-8 rounded-lg shadow-md">
            <p className="italic text-gray-700 mb-4">“{t.quote}”</p>
            <h4 className="font-semibold text-teal">{t.name}</h4>
            <p className="text-sm text-gray-500">{t.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

