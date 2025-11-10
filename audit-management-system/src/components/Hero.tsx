import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-[85vh] flex flex-col items-center justify-center text-center text-white">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>

      {/* Background image */}
      <Image
        src="/building.jpg"
        alt="Clean Audits Gene Therapy Centre"
        fill
        className="object-cover brightness-50"
        priority
      />

      {/* --- HERO TEXT --- */}
      <div className="relative z-20 max-w-3xl px-4">
        <h1 className="text-5xl font-bold mb-6">
          Elevate Pharma Audits with Clean Audits
        </h1>
        <p className="text-lg mb-8 text-gray-200">
          Digitally transform compliance and audit management — built for
          pharmaceutical excellence, precision, and transparency.
        </p>
        <Link
          href="/demo"
          className="bg-teal text-white font-semibold px-6 py-3 rounded hover:border-white hover:border-4 transition"
        >
          Request a Demo
        </Link>
      </div>
    </section>
  );
}
