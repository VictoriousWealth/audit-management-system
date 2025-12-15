export default function DashboardPage() {
  return (
    <div className="w-full bg-background text-foreground min-h-full flex flex-col items-center justify-content-center px-20 py-12">
      <div className="w-full flex flex-wrap items-center justify-between gap-4 mb-8">
        {["New Gemba", "New Self Inspection", "New Audit"].map((label) => (
          <button
            key={label}
            className="border-3 px-5 py-2 pl-7 pr-7 rounded-lg text-lg font-semibold hover:text-background hover:bg-primary border-primary bg-background text-primary hover:cursor-pointer"
          >
            {label}
          </button>
        ))}
      </div>
      
      <div className="rounded-2xl border-3 border-foreground bg-background/80 overflow-hidden w-full h-full">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-surface/70">
          <h2 className="text-xl md:text-2xl font-semibold">Calendar View</h2>
        </div>
        <div className="bg-background border-t-3 border-foreground/80 flex items-center justify-center text-md h-full">
          Calendar view placeholder
          {/* where all audits for this week relating to the user will be listed in chronological order  if none are presents*/}
        </div>
      </div>
    </div>
  );
}
