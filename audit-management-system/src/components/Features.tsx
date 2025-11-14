import Image from "next/image";

export default function Features() {
  const features = [
    {
      title: "Automated Tracking",
      desc: "Track every audit, deviation, and CAPA with smart workflow automation.",
      image: "/lab.jpg",
    },
    {
      title: "Regulatory Compliance",
      desc: "Stay aligned with GMP, GCP, and FDA standards through guided workflows.",
      image: "/manufacturing.jpg",
    },
    {
      title: "Training & Insights",
      desc: "Empower your teams with compliance training and real-time analytics.",
      image: "/training.jpg",
    },
  ];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto grid md:grid-cols-3 gap-10 bg-background text-foreground transition-colors duration-300">
      {features.map((feature, i) => (
        <div
          key={i}
          className="relative bg-surface rounded-xl overflow-hidden shadow-subtle border border-border hover:shadow-lg hover:border-accent transition-all duration-300"
        >
          <Image
            src={feature.image}
            alt={feature.title}
            width={600}
            height={400}
            className="object-cover h-48 w-full"
          />

          <div className="p-6">
            <h3 className="text-2xl font-semibold text-primary mb-3">
              {feature.title}
            </h3>
            <p className="text-text-secondary">{feature.desc}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
