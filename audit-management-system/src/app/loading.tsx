import FourSquareServer from "@/components/FourSquareServer";

export default function Loading() {
  return (
    <div className="w-full bg-background text-foreground flex items-center justify-center px-6 py-16">
      <div className="flex flex-col items-center gap-4 bg-surface border border-border shadow-subtle rounded-xl px-8 py-10">
        <FourSquareServer />
        <div className="text-center">
          <p className="text-3xl font-semibold text-foreground">Loading</p>
          <p className="text-secondary text-2xl">
            <span>Preparing your </span>
            <span className="text-accent font-black">Clean</span>
            <span className="text-primary font-black">Audits</span>
            <span> experience...</span>
          </p>
        </div>
      </div>
    </div>
  );
}
