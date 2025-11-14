import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="bg-background text-foreground min-h-screen transition-colors duration-300">
      {/* Hero Section */}
      <Hero />

      {/* Features */}
      <section className="bg-background text-foreground border-t border-border">
        <Features />
      </section>

      {/* Testimonials */}
      <section className="bg-background text-foreground">
        <Testimonials />
      </section>

      {/* Call to Action */}
      <section className="bg-primary text-surface">
        <CTA />
      </section>

      {/* Footer */}
      <footer className="bg-surface border-t border-border text-text-secondary">
        <Footer />
      </footer>
    </main>
  );
}
