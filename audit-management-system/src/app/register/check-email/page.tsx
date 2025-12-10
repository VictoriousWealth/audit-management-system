import Link from "next/link";

export default function CheckEmailPage() {
  return (
    <main className="w-full bg-background text-foreground flex items-center justify-center px-6 py-16">
      <div className="max-w-md w-full bg-surface p-10 rounded-xl shadow-subtle border border-border text-center">
        <div className="flex justify-center mb-6">
          <div className="flex items-center justify-center w-24 h-24 rounded-full bg-success text-white shadow-subtle border-3 border-success">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              className="w-12 h-12"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-semibold mb-4">
          Check your email to confirm your account!
        </h1>
        <p className="text-base text-muted-foreground mb-8">
          We have sent a confirmation link to your inbox. Follow the steps to
          activate your account and start using CleanAudits.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-surface font-medium hover:bg-accent hover:text-background transition"
        >
          Go to Sign In
        </Link>
      </div>
    </main>
  );
}
