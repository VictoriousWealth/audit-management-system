"use client";

export default function DemoSuccessPage() {
  return (
    <div className="w-full bg-background text-foreground flex items-center justify-center px-6 py-16">
      <div className="max-w-2xl w-full bg-surface border border-border rounded-2xl shadow-subtle p-10 text-center">
        <div className="relative h-28 mb-8 flex items-center justify-center overflow-visible">
          <div className="plane-wrapper">
            <div className="trail" />
            <svg
              className="plane"
              viewBox="0 0 24 24"
              role="img"
              aria-label="Paper airplane in flight"
            >
              <path
                d="M2.25 12.25L20.25 4.5c.77-.34 1.54.47 1.2 1.25l-7.46 17c-.33.75-1.43.68-1.65-.1l-2.18-7.73-7.74-2.15c-.8-.22-.88-1.32-.12-1.67Z"
                fill="var(--color-primary)"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-semibold text-primary mb-4">
          Your personalized demo is on the way
        </h1>
        <p className="text-text-secondary leading-relaxed mb-8">
          Thanks for reaching out. Our team is preparing a walkthrough tailored
          to your goals and will contact you shortly to schedule it.
        </p>

        <div className="flex justify-center gap-4">
          <a
            href="/"
            className="px-5 py-2.5 rounded-lg border border-border bg-background hover:border-accent/70 transition-all"
          >
            Back to home
          </a>
          <a
            href="/explore-features"
            className="px-5 py-2.5 rounded-lg bg-primary text-surface font-medium hover:bg-accent hover:text-background transition-all"
          >
            Explore features
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes fly {
          0% {
            transform: translateX(-40%) translateY(10%) rotate(-10deg);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          50% {
            transform: translateX(30%) translateY(-10%) rotate(4deg);
          }
          100% {
            transform: translateX(140%) translateY(-24%) rotate(10deg);
            opacity: 0;
          }
        }

        @keyframes fadeTrail {
          0% {
            width: 0%;
            opacity: 0;
          }
          20% {
            opacity: 0.75;
          }
          50% {
            width: 70%;
            opacity: 0.9;
          }
          100% {
            width: 0%;
            opacity: 0;
          }
        }

        .plane-wrapper {
          position: relative;
          width: 260px;
          height: 80px;
        }

        .plane {
          position: absolute;
          left: 0;
          top: 22px;
          width: 76px;
          height: 76px;
          color: hsl(240, 57%, 60%);
          animation: fly 4s ease-in-out infinite;
          filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.15));
        }

        .trail {
          position: absolute;
          left: 6%;
          top: 50%;
          height: 3px;
          border-radius: 999px;
          background: linear-gradient(
            90deg,
            rgba(99, 102, 241, 0.5),
            rgba(99, 102, 241, 0.15),
            transparent
          );
          animation: fadeTrail 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
