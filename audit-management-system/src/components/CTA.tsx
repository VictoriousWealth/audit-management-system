import Link from "next/link";

export default function CTA() {
  return (
    <section className="bg-primary text-surface py-16 text-center transition-colors duration-300">
      <h2 className="text-3xl font-semibold mb-4">
        Ready to Modernize Your Audits?
      </h2>

      <p className="mb-6 text-lg text-surface/90">
        Empower your compliance teams with a secure, digital audit management system.
      </p>

      <Link
        href="/contact"
        className="inline-block border-3 border-accent bg-background text-primary font-black px-6 py-3 rounded-lg hover:scale-120 hover:bg-primary hover:text-background duration-150"
      >
        Schedule a Consultation
      </Link>
    </section>
  );
}
