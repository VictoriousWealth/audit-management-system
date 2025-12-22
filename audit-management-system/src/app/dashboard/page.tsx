import Link from "next/link";
import WeekCalendar from "./WeekCalendar";

export default async function DashboardPage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const baseUrlWithProtocol = baseUrl.startsWith("http")
    ? baseUrl
    : `https://${baseUrl}`;

  const [auditsResponse, companiesResponse, usersResponse] = await Promise.all([
    fetch(`${baseUrlWithProtocol}/api/audits`, { cache: "no-store" }),
    fetch(`${baseUrlWithProtocol}/api/companies`, { cache: "no-store" }),
    fetch(`${baseUrlWithProtocol}/api/users_generic`, { cache: "no-store" }),
  ]);

  const normalizeId = (value: any) =>
    value?._id?.$oid ?? value?._id ?? value?.$oid ?? value ?? "";

  const [audits, companies, users] = await Promise.all([
    auditsResponse.ok ? auditsResponse.json() : Promise.resolve([]),
    companiesResponse.ok ? companiesResponse.json() : Promise.resolve([]),
    usersResponse.ok ? usersResponse.json() : Promise.resolve([]),
  ]);

  const companyNameById = new Map<string, string>();
  companies.forEach((company: any) => {
    const id = normalizeId(company);
    if (!id) return;
    const name = company.name ?? company.companyName ?? "";
    if (name) companyNameById.set(id, name);
  });

  const userNameById = new Map<string, string>();
  users.forEach((user: any) => {
    const id = normalizeId(user);
    if (!id) return;
    const name =
      user.name ??
      [user.firstName, user.middleNames, user.surname]
        .filter(Boolean)
        .join(" ")
        .trim();
    if (name) userNameById.set(id, name);
  });
  const draftAudits = audits.filter(
    (audit: any) => audit?.isdraft === true || audit?.isDraft === true
  );
  const firstDraft = draftAudits[0];
  const draftAuditId = firstDraft?._id?.$oid ?? firstDraft?._id ?? firstDraft?.id;

  const calendarAudits = audits
    .filter((audit: any) => audit?.isDraft !== true && audit?.isdraft !== true)
    .map((audit: any) => {
      const dateString =
        audit.actualStart || audit.expectedStart;
      const datetime = dateString ? new Date(dateString) : null;
      const companyName = companyNameById.get(normalizeId(audit.companyId));
      const leadAuditorName = userNameById.get(normalizeId(audit.leadAuditorId));
      return datetime
        ? {
            id: audit._id || audit.id || crypto.randomUUID(),
            reference: audit.reference || "Untitled Audit",
            datetime: datetime.toISOString(),
            companyName,
            leadAuditorName,
          }
        : null;
    })
    .filter(
      (audit: any): audit is {
        id: string;
        reference: string;
        datetime: string;
        companyName?: string;
        leadAuditorName?: string;
      } => !!audit
    );

  return (
    <div className="w-full bg-background text-foreground min-h-full flex flex-col items-center justify-content-center px-20 py-12">
      <div className="w-full flex flex-wrap items-center justify-between gap-4 mb-8">
        {firstDraft && (
          <Link
            href={`/dashboard/drafts${draftAuditId ? `?draft=${draftAuditId}` : ""}`}
            className="border-3 px-5 py-2 pl-7 pr-7 rounded-lg text-lg font-semibold hover:text-background hover:bg-primary border-primary bg-background text-primary hover:cursor-pointer"
          >
            View Draft Audits
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
          <h2 className="text-2xl font-semibold text-accent">Calendar View</h2>
        </div>
        <div className="bg-background border-t-3 border-foreground/80 flex items-center justify-center text-md h-full">
          <WeekCalendar audits={calendarAudits} />
        </div>
      </div>
    </div>
  );
}
