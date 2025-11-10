import Link from "next/link";

export default function CTA() {
  return (
    <section className="bg-teal text-white py-16 text-center">
      <h2 className="text-3xl font-bold mb-4">
        Ready to Modernize Your Audits?
      </h2>
      <p className="mb-6 text-lg">
        Empower your compliance teams with a secure, digital audit management system.
      </p>
      <Link
        href="/contact"
        className="bg-white text-teal font-semibold px-6 py-3 rounded hover:bg-offwhite transition"
      >
        Schedule a Consultation
      </Link>
    </section>
  );
}
