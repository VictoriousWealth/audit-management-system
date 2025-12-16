export type Auditee = { id?: string; name: string; contactEmail: string; contactNumber: string };

import { useEffect, useRef, useState } from "react";

type FetchedAuditee = {
  _id?: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  contactEmail?: string;
  contactNumber?: string;
};

type AuditeeSectionProps = {
  auditees: Auditee[];
  addAuditee: () => void;
  updateAuditee: (index: number, field: keyof Auditee, value: string) => void;
  selectedAuditorNames: string[];
};

export function AuditeeSection({
  auditees,
  addAuditee,
  updateAuditee,
  selectedAuditorNames,
}: AuditeeSectionProps) {
  const [fetchedAuditees, setFetchedAuditees] = useState<FetchedAuditee[]>([]);
  const [loadingAuditees, setLoadingAuditees] = useState(false);
  const [openSuggestionsIndex, setOpenSuggestionsIndex] = useState<number | null>(null);
  const wrapperRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [auditeeConflicts, setAuditeeConflicts] = useState<Record<number, string>>({});

  useEffect(() => {
    let cancelled = false;
    const loadAuditees = async () => {
      try {
        setLoadingAuditees(true);
        const res = await fetch("/api/users_generic");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && Array.isArray(data)) setFetchedAuditees(data);
      } catch (_err) {
        // ignore fetch errors; UI will show empty state
      } finally {
        if (!cancelled) setLoadingAuditees(false);
      }
    };
    loadAuditees();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-row gap-6 items-start w-full flex-wrap">
      {auditees.map((auditee, index) => {
        const takenNames = new Set(
          [
            ...auditees
              .filter((_, i) => i !== index)
              .map((a) => a.name.trim().toLowerCase()),
            ...selectedAuditorNames.map((name) => name.trim().toLowerCase()),
          ].filter(Boolean)
        );
        const filteredAuditees = auditee.name.trim()
          ? fetchedAuditees.filter((a) =>
              a.name.toLowerCase().includes(auditee.name.toLowerCase()) &&
              !takenNames.has(a.name.toLowerCase())
            )
          : fetchedAuditees.filter((a) => !takenNames.has(a.name.toLowerCase()));

        return (
        <div key={`auditee-${index}`} className="flex flex-col gap-4 w-xs">
          
          <div className="flex gap-4 items-end w-xs">
            <label className="flex flex-col gap-2 w-3xs">
              <span className="text-sm font-medium">Auditee name</span>
              <div
                className="relative"
                ref={(el) => {
                  if (el) wrapperRefs.current[index] = el;
                }}
              >
                <input
                  type="text"
                  name={`auditeeName-${index}`}
                  placeholder="Auditee Name"
                  value={auditee.name}
                  onChange={(e) => {
                    const nextName = e.target.value;
                    const isTaken = takenNames.has(nextName.trim().toLowerCase());
                    setAuditeeConflicts((prev) => {
                      const next = { ...prev };
                      if (isTaken) {
                        next[index] = "This person is already selected as an auditee or auditor.";
                      } else {
                        delete next[index];
                      }
                      return next;
                    });
                    updateAuditee(index, "id", "");
                    updateAuditee(index, "name", nextName);
                    setOpenSuggestionsIndex(index);
                  }}
                  onFocus={() => {
                    if (auditee.name.trim()) setOpenSuggestionsIndex(index);
                  }}
                  onBlur={(e) => {
                    const next = e.relatedTarget;
                    if (next && wrapperRefs.current[index]?.contains(next)) return;
                    setOpenSuggestionsIndex((current) =>
                      current === index ? null : current
                    );
                  }}
                  className="border-2 border-border rounded-lg px-3 py-2 bg-surface/70 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {loadingAuditees && (
                  <p className="text-xs text-muted-foreground">Loading auditees…</p>
                )}
                {!loadingAuditees &&
                  auditee.name &&
                  filteredAuditees.length === 0 && (
                    <p className="text-xs text-red-500">
                      No auditees found. An auditee must be registered before scheduling an audit.
                    </p>
                  )}
                {!loadingAuditees &&
                  openSuggestionsIndex === index &&
                  auditee.name &&
                  filteredAuditees.length > 0 && (
                    <div className="absolute z-10 mt-1 max-h-48 w-72 overflow-y-auto rounded-lg border border-border bg-background shadow-lg">
                      {filteredAuditees.slice(0, 8).map((option) => (
                          <button
                            type="button"
                            key={option._id ?? option.name}
                            onClick={() => {
                              setAuditeeConflicts((prev) => {
                                const next = { ...prev };
                                delete next[index];
                                return next;
                              });
                              updateAuditee(index, "id", option._id ?? "");
                              updateAuditee(index, "name", option.name);
                              const email = option.contactEmail ?? option.email ?? "";
                              const phone = option.contactNumber ?? option.phoneNumber ?? "";
                              updateAuditee(index, "contactEmail", email);
                              updateAuditee(index, "contactNumber", phone);
                              setOpenSuggestionsIndex(null);
                            }}
                            className="flex w-full flex-col items-start gap-1 px-3 py-2 text-left text-sm hover:bg-surface"
                          >
                            <span className="font-medium">{option.name}</span>
                            {(option.contactEmail ||
                              option.contactNumber ||
                              option.email ||
                              option.phoneNumber) && (
                              <span className="text-xs text-muted-foreground">
                                {[
                                  option.contactEmail ?? option.email,
                                  option.contactNumber ?? option.phoneNumber,
                                ]
                                  .filter(Boolean)
                                  .join(" • ")}
                              </span>
                            )}
                          </button>
                        ))}
                    </div>
                  )}
                {auditeeConflicts[index] && (
                  <p className="text-xs text-red-500">{auditeeConflicts[index]}</p>
                )}
              </div>
            </label>
            {index === 0 && (
              <button
                type="button"
                onClick={addAuditee}
                className="text-center border-3 px-4 py-1 rounded-lg text-xl font-black hover:text-background hover:bg-primary border-primary bg-background text-primary hover:cursor-pointer"
              >
                +
              </button>
            )}
          </div>
          <label className="flex flex-col gap-2 w-3xs">
            <span className="text-sm font-medium">Contact email</span>
            <input
              type="email"
              name={`contactEmail-${index}`}
              placeholder="name@email.com"
              value={auditee.contactEmail}
              onChange={(e) => updateAuditee(index, "contactEmail", e.target.value)}
              className="border-2 border-border rounded-lg px-3 py-2 bg-surface/70 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>
          <label className="flex flex-col gap-2 w-3xs">
            <span className="text-sm font-medium">Contact number</span>
            <input
              type="tel"
              name={`contactNumber-${index}`}
              placeholder="+1 (555) 000-0000"
              value={auditee.contactNumber}
              onChange={(e) => updateAuditee(index, "contactNumber", e.target.value)}
              className="border-2 border-border rounded-lg px-3 py-2 bg-surface/70 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>
          {index < auditees.length - 1 && <hr className="border-border/80 w-full" />}
        </div>
        );
      })}
    </div>
  );
}
