import Link from "next/link";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const normalizeId = (value: any) =>
  value?._id?.$oid ?? value?._id ?? value?.$oid ?? value ?? "";

const formatDate = (value: any) => {
  if (!value) return "Not set";
  const date = typeof value === "string" ? new Date(value) : new Date(value.$date ?? value);
  return Number.isNaN(date.getTime()) ? "Not set" : dateFormatter.format(date);
};

const fetchJson = async (url: string) => {
  const res = await fetch(url, { cache: "no-store" });
  return res.ok ? res.json() : null;
};

export default async function AuditDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const baseUrlWithProtocol = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;

  const audit = await fetchJson(`${baseUrlWithProtocol}/api/audits/${id}`);

  if (!audit) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground px-6">
        <div className="max-w-lg w-full text-center space-y-4">
          <p className="text-xl font-semibold text-accent">Audit not found</p>
          <Link
            href="/dashboard"
            className="border-3 px-5 py-2 rounded-lg text-sm font-bold text-background bg-primary border-primary hover:bg-background hover:text-primary transition-colors inline-block"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const companyId = normalizeId(audit.companyId);
  const leadAuditorId = normalizeId(audit.leadAuditorId);
  const supportIds = Array.isArray(audit.supportAuditorIds)
    ? audit.supportAuditorIds.map(normalizeId).filter(Boolean)
    : [];
  const auditeeIds = Array.isArray(audit.auditeeIds)
    ? audit.auditeeIds.map(normalizeId).filter(Boolean)
    : [];

  const [company, leadAuditor, supportAuditors, auditees] = await Promise.all([
    companyId ? fetchJson(`${baseUrlWithProtocol}/api/companies/${companyId}`) : null,
    leadAuditorId ? fetchJson(`${baseUrlWithProtocol}/api/users_generic/${leadAuditorId}`) : null,
    supportIds.length
      ? Promise.all(
          supportIds.map((sid) => fetchJson(`${baseUrlWithProtocol}/api/users_generic/${sid}`))
        )
      : Promise.resolve([]),
    auditeeIds.length
      ? Promise.all(
          auditeeIds.map((aid) => fetchJson(`${baseUrlWithProtocol}/api/users_generic/${aid}`))
        )
      : Promise.resolve([]),
  ]);

  const supportNames = (supportAuditors || [])
    .map((u) => u?.name)
    .filter(Boolean) as string[];
  const auditeeNames = (auditees || [])
    .map((u) => u?.name)
    .filter(Boolean) as string[];

  return (
    <div className="min-h-screen w-full bg-background text-foreground px-6 py-10 flex justify-center">
      <div className="w-full max-w-4xl bg-surface/80 border-3 border-primary rounded-2xl shadow-lg p-8 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-foreground/70">Audit Reference</p>
            <h1 className="text-3xl font-semibold text-accent">{audit.reference ?? "Untitled Audit"}</h1>
          </div>
          <Link
            href="/dashboard"
            className="border-3 px-5 py-2 rounded-lg text-sm font-bold text-background bg-primary border-primary hover:bg-background hover:text-primary transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-border rounded-lg bg-background/60">
            <p className="text-xs uppercase tracking-wide text-foreground/60">Company</p>
            <p className="text-lg font-semibold">{company?.name ?? "Company not assigned"}</p>
          </div>
          <div className="p-4 border border-border rounded-lg bg-background/60">
            <p className="text-xs uppercase tracking-wide text-foreground/60">Lead Auditor</p>
            <p className="text-lg font-semibold">{leadAuditor?.name ?? "Lead auditor not assigned"}</p>
          </div>
          <div className="p-4 border border-border rounded-lg bg-background/60">
            <p className="text-xs uppercase tracking-wide text-foreground/60">Support Auditors</p>
            <p className="text-lg font-semibold">
              {supportNames.length ? supportNames.join(", ") : "None assigned"}
            </p>
          </div>
          <div className="p-4 border border-border rounded-lg bg-background/60">
            <p className="text-xs uppercase tracking-wide text-foreground/60">Auditees</p>
            <p className="text-lg font-semibold">
              {auditeeNames.length ? auditeeNames.join(", ") : "None assigned"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailCard label="Proposed Start" value={formatDate(audit.proposedStart)} />
          <DetailCard label="Proposed End" value={formatDate(audit.proposedEnd)} />
          <DetailCard label="Expected Start" value={formatDate(audit.expectedStart)} />
          <DetailCard label="Expected End" value={formatDate(audit.expectedEnd)} />
          <DetailCard label="Actual Start" value={formatDate(audit.actualStart)} />
          <DetailCard label="Actual End" value={formatDate(audit.actualEnd)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailCard label="Purpose" value={audit.purpose || "No purpose provided"} />
          <DetailCard label="Scope" value={audit.scope || "No scope provided"} />
          <DetailCard label="Request Letter Sent" value={formatDate(audit.requestLetterSentAt)} />
          <DetailCard label="Report Letter Sent" value={formatDate(audit.reportLetterSentAt)} />
          <DetailCard label="Closure Letter Sent" value={formatDate(audit.closureLetterSentAt)} />
          <DetailCard label="Closure Datetime" value={formatDate(audit.closureDatetime)} />
        </div>
      </div>
    </div>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 border border-border rounded-lg bg-background/60 flex flex-col gap-1">
      <p className="text-xs uppercase tracking-wide text-foreground/60">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
