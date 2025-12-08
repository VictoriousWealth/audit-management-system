import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-[85vh] flex flex-col items-center justify-center text-center text-surface transition-colors duration-300">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-background/90 via-foreground/60 to-transparent z-10"></div>

      {/* Background image */}
      <Image
        src="/building.jpg"
        alt="CleanAudits Gene Therapy Centre"
        fill
        className="object-cover brightness-75"
        priority
      />

      {/* --- HERO TEXT --- */}
      <div className="relative z-20 max-w-3xl px-4 border-1 border-accent rounded-2xl p-20 bg-secondary/30">
        <h1 className="text-5xl font-semibold text-background mb-6">
          <span>Auditing made easier with </span>
          <span className="text-accent">Clean</span>
          <span className="text-primary">Audits</span>
        </h1>

        <p className="text-lg mb-8 text-background/90">
          Digitally transform compliance and audit management — built for GMP,
          pharmaceutical excellence, precision, and transparency.
        </p>

        <Link
          href="/demo"
          className="inline-block border-3 border-accent text-background bg-primary font-black px-6 py-3 rounded-lg transition-all duration-300 hover:text-accent"
        >
          Request a Demo
        </Link>
        <Link
          href="/explore-features"
          className="inline-block border-3 border-accent text-background bg-primary font-black px-6 py-3 rounded-lg transition-all duration-300 ml-6 hover:text-accent"
        >
          Explore Features
        </Link> 
        {/* TODO: an interactive high level overview of the platform's features highlighting the benefits*/}
      </div>
    </section>
  );
}
