'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

type Audit = {
  _id?: { $oid: string } | string;
  id?: string;
  reference?: string;
  isDraft?: boolean;
  isdraft?: boolean;
  expectedStart?: string;
  createdAt?: string;
};

const formatDate = (value?: string) => {
  if (!value) return "No date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No date";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

export default function DraftAuditsPage() {
  const [drafts, setDrafts] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const loadDrafts = async () => {
      try {
        const res = await fetch("/api/audits");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && Array.isArray(data)) {
          setDrafts(
            data.filter((audit: Audit) => audit?.isDraft === true || audit?.isdraft === true)
          );
        }
      } catch (_err) {
        // ignore fetch errors; UI will show empty state
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadDrafts();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-full w-full bg-background text-foreground flex items-center justify-center px-4 md:px-8 lg:px-12 py-10">
      <div className="w-full max-w-4xl rounded-2xl border-3 border-foreground bg-background/80 shadow-xl p-6 md:p-10 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Draft Audits</h1>
          <Link
            href="/dashboard"
            className="border-3 px-4 py-2 rounded-lg text-sm font-semibold hover:text-background hover:bg-primary border-primary bg-background text-primary hover:cursor-pointer"
          >
            Back to Dashboard
          </Link>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading drafts…</p>
        ) : drafts.length === 0 ? (
          <div className="flex flex-col gap-3">
            <p className="text-base font-medium">No draft audits found.</p>
            <Link
              href="/dashboard/schedule"
              className="w-fit border-3 px-4 py-2 rounded-lg text-sm font-semibold hover:text-background hover:bg-primary border-primary bg-background text-primary hover:cursor-pointer"
            >
              Create a draft
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {drafts.map((draft) => {
              const id = (draft._id as any)?.$oid ?? draft._id ?? draft.id ?? "";
              return (
                <li
                  key={id || draft.reference || crypto.randomUUID()}
                  className="flex items-center justify-between rounded-xl border border-border bg-surface/50 px-4 py-3"
                >
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold">
                      {draft.reference || "Untitled Draft"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(draft.expectedStart || draft.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {id && (
                      <Link
                        href={`/dashboard/schedule?draft=${id}`}
                        className="border-3 px-3 py-2 rounded-lg text-sm font-semibold hover:text-background hover:bg-primary border-primary bg-background text-primary hover:cursor-pointer"
                      >
                        Resume
                      </Link>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
