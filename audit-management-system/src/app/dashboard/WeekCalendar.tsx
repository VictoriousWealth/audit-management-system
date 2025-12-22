'use client';

import Link from "next/link";
import { useMemo, useState } from "react";

type CalendarAudit = {
  id: string;
  reference: string;
  datetime: string;
  companyName?: string;
  leadAuditorName?: string;
};

type CalendarAuditWithDate = Omit<CalendarAudit, "datetime"> & {
  datetime: Date;
};

const startOfWeek = (value: Date) => {
  const date = new Date(value);
  date.setDate(date.getDate() - date.getDay());
  date.setHours(0, 0, 0, 0);
  return date;
};

const endOfWeek = (value: Date) => {
  const date = new Date(value);
  date.setDate(date.getDate() + 6);
  date.setHours(23, 59, 59, 999);
  return date;
};

const weekLabelFormatter = new Intl.DateTimeFormat("en-US", {
  year: "2-digit",
  month: "short",
  day: "numeric",
});

const auditDateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export default function WeekCalendar({
  audits,
}: {
  audits: CalendarAudit[];
}) {
  const [weekStart, setWeekStart] = useState<Date>(() => startOfWeek(new Date()));

  const { label, currentWeekAudits } = useMemo(() => {
    const start = startOfWeek(weekStart);
    const end = endOfWeek(start);

    const weekAudits = audits
      .map<CalendarAuditWithDate | null>((audit) => {
        const datetime = new Date(audit.datetime);
        if (Number.isNaN(datetime.getTime())) return null;
        return {
          id: audit.id,
          reference: audit.reference,
          datetime,
          companyName: audit.companyName,
          leadAuditorName: audit.leadAuditorName,
        };
      })
      .filter(
        (audit): audit is CalendarAuditWithDate =>
          !!audit && audit.datetime >= start && audit.datetime <= end
      )
      .sort((a, b) => a.datetime.getTime() - b.datetime.getTime());

    const labelText = `${weekLabelFormatter.format(start)} – ${weekLabelFormatter.format(
      end
    )}`;

    return {
      label: labelText,
      currentWeekAudits: weekAudits,
    };
  }, [audits, weekStart]);

  return (
    <div className="w-full flex flex-col items-start py-8 h-full pt-0">
      <div className="w-full flex justify-center items-center gap-4 pt-2 border-b-3 border-primary pb-1.5">
        <button
          type="button"
          aria-label="Previous week"
          className="border-2 border-primary text-primary rounded-xl px-3 py-1 hover:bg-accent hover:text-background transition-colors"
          onClick={() =>
            setWeekStart((prev) => {
              const next = new Date(prev.getTime() - 7 * 24 * 60 * 60 * 1000);
              return startOfWeek(next);
            })
          }
        >
          ◀
        </button>
        <span className="text-lg font-semibold">{label}</span>
        <button
          type="button"
          aria-label="Next week"
          className="border-2 border-primary text-primary rounded-xl px-3 py-1 hover:bg-accent hover:text-background transition-colors"
          onClick={() =>
            setWeekStart((prev) => {
              const next = new Date(prev.getTime() + 7 * 24 * 60 * 60 * 1000);
              return startOfWeek(next);
            })
          }
        >
          ▶
        </button>
      </div>

      {currentWeekAudits.length > 0 ? (
        <ul className="w-full divide-y divide-border">
          {currentWeekAudits.map((audit) => (
            <li key={audit.id} className="border-primary/5 border-2 rounded-lg shadow-lg">
              <Link
                href={`/dashboard/audits/${audit.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-accent/10 transition-colors"
              >
                <span className="text-lg font-semibold text-accent">{audit.reference}</span>
                <div className="flex flex-col gap-1">
                  <span className="text-xs md:text-sm text-foreground/80">
                    Company: {audit.companyName ?? "Company not assigned"}
                  </span>
                  <span className="text-xs md:text-sm text-foreground/80">
                    Lead Auditor: {audit.leadAuditorName ?? "Lead auditor not assigned"}
                  </span>
                </div>
                <span className="text-sm md:text-base font-medium text-primary">
                  {auditDateFormatter.format(audit.datetime)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-3 py-4 w-full justify-center h-full">
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
  );
}
