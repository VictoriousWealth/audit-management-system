import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="bg-background text-foreground flex items-center justify-center px-6 py-16 transition-colors duration-300 w-full">
      <div className="max-w-2xl bg-surface p-10 rounded-2xl shadow-subtle border border-border hover:shadow-lg hover:border-accent/70 transition-all duration-300 text-center space-y-6 w-md ">
        <p className="text-sm font-semibold tracking-wide text-accent uppercase">
          404 · Not Found
        </p>
        <h1 className="text-4xl font-semibold text-primary">
          We couldn’t find that page
        </h1>
        <p className="text-text-secondary leading-relaxed">
          The link may be broken or the page may have been moved. Let’s get you back to where you need to be.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="border-3 px-5 py-2 pl-7 pr-7 rounded-lg text-sm font-black text-background bg-primary border-primary hover:bg-background hover:text-primary"
          >
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="border-3 hover:bg-background hover:text-accent px-5 py-2 rounded-lg text-sm font-black border-accent hover:border-accent text-background bg-accent transition"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
