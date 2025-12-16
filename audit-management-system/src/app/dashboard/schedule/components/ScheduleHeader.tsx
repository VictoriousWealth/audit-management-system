import Link from "next/link";

export function ScheduleHeader() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold text-accent">Create An Audit Schedule</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Capture the key details to plan and start an audit.
        </p>
      </div>
      <Link
        href="/dashboard"
        className="border-3 px-5 py-2 pl-7 pr-7 rounded-lg text-sm font-black text-background bg-primary border-primary hover:bg-background hover:text-primary hover:cursor-pointer"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
