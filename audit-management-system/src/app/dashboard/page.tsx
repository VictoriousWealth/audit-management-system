import Link from "next/link";

export default async function DashboardPage() {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL!;

  const response = await fetch(
    `${baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`}/api/audits`,
    { cache: "no-store" }
  );
  const audits = response.ok ? await response.json() : [];
  const draftAudits = audits.filter(
    (audit: any) => audit?.isdraft === true || audit?.isDraft === true
  );
  const firstDraft = draftAudits[0];
  const draftAuditId = firstDraft?._id?.$oid ?? firstDraft?._id ?? firstDraft?.id;

  const weeklyAudits = audits
    .filter((audit: any) => audit?.isDraft !== true && audit?.isdraft !== true)
    .map((audit: any) => {
      const dateString =
        audit.actualStart || audit.expectedStart || audit.createdAt;
      const datetime = dateString ? new Date(dateString) : null;
      return datetime
        ? {
            id: audit._id || audit.id || crypto.randomUUID(),
            reference: audit.reference || "Untitled Audit",
            datetime,
          }
        : null;
    })
    .filter(
      (audit): audit is { id: string; reference: string; datetime: Date } =>
        !!audit &&
        audit.datetime >= startOfWeek &&
        audit.datetime <= endOfWeek
    )
    .sort((a, b) => a.datetime.getTime() - b.datetime.getTime());

  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="w-full bg-background text-foreground min-h-full flex flex-col items-center justify-content-center px-20 py-12">
      <div className="w-full flex flex-wrap items-center justify-between gap-4 mb-8">
        {firstDraft && (
          <Link
            href={`/dashboard/drafts${draftAuditId ? `?draft=${draftAuditId}` : ""}`}
            className="border-3 px-5 py-2 pl-7 pr-7 rounded-lg text-lg font-semibold hover:text-background hover:bg-primary border-primary bg-background text-primary hover:cursor-pointer"
          >
            View Draft Audit
          </Link>
        )}
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
          {weeklyAudits.length > 0 ? (
            <ul className="w-full max-w-4xl divide-y divide-border">
              {weeklyAudits.map((audit) => (
                <li
                  key={audit.id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <span className="text-lg font-semibold">
                    {audit.reference}
                  </span>
                  <span className="text-sm md:text-base font-medium text-primary">
                    {formatter.format(audit.datetime)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center gap-3 py-10">
              <p className="text-lg font-medium">Nothing to view here.</p>
              <Link
                href="/dashboard/schedule"
                className="border-3 px-5 py-2 pl-7 pr-7 rounded-lg text-lg font-semibold hover:text-background hover:bg-primary border-primary bg-background text-primary hover:cursor-pointer"
              >
                Schedule
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
