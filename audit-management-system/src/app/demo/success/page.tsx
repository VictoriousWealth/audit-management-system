"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function DemoSuccessPage() {
  return (
    <div className="w-full bg-background text-foreground flex items-center justify-center px-6">
      <div className="max-w-2xl w-full bg-surface border border-border rounded-2xl shadow-subtle p-10 text-center">
        <DotLottieReact
          src="https://lottie.host/5f1a26ad-d672-4360-bc10-999c78485db3/FxqtCt4186.lottie"
          loop
          autoplay
        />            

        <h1 className="text-4xl font-semibold text-primary mb-4">
          Your personalized demo is on the way
        </h1>
        <p className="text-text-secondary leading-relaxed mb-8">
          Thanks for reaching out. Our team is preparing a time-limited walkthrough tailored
          to your goals and will contact you shortly to sort it out.
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
