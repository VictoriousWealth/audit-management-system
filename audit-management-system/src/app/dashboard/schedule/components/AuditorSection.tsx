import { useEffect, useRef, useState } from "react";

type FetchedAuditor = {
  _id?: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  contactEmail?: string;
  contactNumber?: string;
};

type AuditorSectionProps = {
  leadAuditor: string;
  updateLeadAuditor: (value: string) => void;
  supportAuditors: string[];
  addSupportAuditor: () => void;
  updateSupportAuditor: (index: number, value: string) => void;
  auditeeNames: string[];
};

export function AuditorSection({
  leadAuditor,
  updateLeadAuditor,
  supportAuditors,
  addSupportAuditor,
  updateSupportAuditor,
  auditeeNames,
}: AuditorSectionProps) {
  const [leadConflict, setLeadConflict] = useState("");
  const [supportConflicts, setSupportConflicts] = useState<Record<number, string>>({});
  const [fetchedAuditors, setFetchedAuditors] = useState<FetchedAuditor[]>([]);
  const [loadingAuditors, setLoadingAuditors] = useState(false);
  const [openSuggestions, setOpenSuggestions] = useState<"lead" | number | null>(null);
  const wrapperRefs = useRef<{
    lead: HTMLDivElement | null;
    support: Record<number, HTMLDivElement | null>;
  }>({
    lead: null,
    support: {},
  });

  useEffect(() => {
    let cancelled = false;
    const loadAuditors = async () => {
      try {
        setLoadingAuditors(true);
        const res = await fetch("/api/users_generic");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && Array.isArray(data)) setFetchedAuditors(data);
      } catch (_err) {
        // ignore fetch errors; UI will show empty state
      } finally {
        if (!cancelled) setLoadingAuditors(false);
      }
    };
    loadAuditors();
    return () => {
      cancelled = true;
    };
  }, []);

  const isAuditee = (name: string) => {
    const normalized = name.trim().toLowerCase();
    if (!normalized) return false;
    return auditeeNames.some(
      (auditee) => auditee.trim().toLowerCase() === normalized
    );
  };

  const handleLeadChange = (value: string) => {
    if (isAuditee(value)) {
      setLeadConflict("Lead auditor cannot also be an auditee.");
    } else {
      setLeadConflict("");
    }
    updateLeadAuditor(value);
    setOpenSuggestions("lead");
  };

  const handleSupportChange = (index: number, value: string) => {
    if (isAuditee(value)) {
      setSupportConflicts((prev) => ({
        ...prev,
        [index]: "Support auditor cannot also be an auditee.",
      }));
    } else {
      setSupportConflicts((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    }
    updateSupportAuditor(index, value);
    setOpenSuggestions(index);
  };

  const takenAuditorNames = (currentKey: "lead" | number) => {
    const others = [
      ...auditeeNames.map((n) => n.trim().toLowerCase()),
      ...supportAuditors
        .map((n, i) => (currentKey === i ? "" : n.trim().toLowerCase()))
        .filter(Boolean),
    ];
    if (currentKey !== "lead" && leadAuditor.trim()) {
      others.push(leadAuditor.trim().toLowerCase());
    }
    if (currentKey === "lead") {
      supportAuditors.forEach((n) => n.trim() && others.push(n.trim().toLowerCase()));
    }
    return new Set(others.filter(Boolean));
  };

  const filteredOptions = (inputValue: string, currentKey: "lead" | number) => {
    const taken = takenAuditorNames(currentKey);
    const normalizedInput = inputValue.trim().toLowerCase();
    return normalizedInput
      ? fetchedAuditors.filter(
          (a) =>
            a.name.toLowerCase().includes(normalizedInput) &&
            !taken.has(a.name.trim().toLowerCase())
        )
      : fetchedAuditors.filter((a) => !taken.has(a.name.trim().toLowerCase()));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_auto] gap-4 items-end">
      <div className="flex flex-col gap-3">
        
        <label className="flex flex-col gap-2 w-full">
          <span className="text-sm font-medium">Lead auditor name</span>
          <div className="flex gap-3">
            <div
              className="relative w-full"
              ref={(el) => {
                if (el) wrapperRefs.current.lead = el;
              }}
            >
              <input
                type="text"
                name="leadAuditor"
                placeholder="Lead auditor"
                value={leadAuditor}
                onChange={(e) => handleLeadChange(e.target.value)}
                onFocus={() => {
                  if (leadAuditor.trim()) setOpenSuggestions("lead");
                }}
                onBlur={(e) => {
                  const next = e.relatedTarget;
                  if (next && wrapperRefs.current.lead?.contains(next)) return;
                  setOpenSuggestions((current) => (current === "lead" ? null : current));
                }}
                className="w-full border-2 border-border rounded-lg px-3 py-2 bg-surface/70 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {!loadingAuditors &&
                openSuggestions === "lead" &&
                filteredOptions(leadAuditor, "lead").length > 0 && (
                  <div className="absolute left-0 top-full z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-border bg-background shadow-lg">
                    {filteredOptions(leadAuditor, "lead")
                      .slice(0, 8)
                      .map((option) => (
                        <button
                          type="button"
                          key={option._id ?? option.name}
                          onClick={() => {
                            setLeadConflict("");
                            updateLeadAuditor(option.name);
                            setOpenSuggestions(null);
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
            </div>
            <button
              type="button"
              onClick={addSupportAuditor}
              className=" text-center border-3 px-4 py-1 rounded-lg text-xl font-black hover:text-background hover:bg-primary border-primary bg-background text-primary hover:cursor-pointer"
            >
              +
            </button>
          </div>
          {leadConflict && (
            <span className="text-xs text-red-500">{leadConflict}</span>
          )}
          {leadAuditor && !loadingAuditors && filteredOptions(leadAuditor, "lead").length === 0 && (
            <span className="text-xs text-red-500">
              No available auditors match that name.
            </span>
          )}
        </label>
                  
        <div className="flex flex-col gap-2">
          {supportAuditors.map((supportAuditor, index) => {
            const options = filteredOptions(supportAuditor, index);
            return (
              <label key={index} className="flex flex-col gap-2">
                <span className="text-sm font-medium">
                  Support auditor {supportAuditors.length > 1 ? `#${index + 1}` : ""}
                </span>
                <div
                  className="relative"
                  ref={(el) => {
                    if (el) wrapperRefs.current.support[index] = el;
                  }}
                >
                  <input
                    type="text"
                    name={`supportAuditor-${index}`}
                    placeholder="Support auditor"
                    value={supportAuditor}
                    onChange={(event) => handleSupportChange(index, event.target.value)}
                    onFocus={() => {
                      if (supportAuditor.trim()) setOpenSuggestions(index);
                    }}
                    onBlur={(e) => {
                      const next = e.relatedTarget;
                      if (next && wrapperRefs.current.support[index]?.contains(next)) return;
                      setOpenSuggestions((current) => (current === index ? null : current));
                    }}
                    className="border-2 border-border rounded-lg px-3 py-2 bg-surface/70 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {!loadingAuditors &&
                    openSuggestions === index &&
                    supportAuditor &&
                    options.length > 0 && (
                      <div className="absolute left-0 top-full z-10 mt-1 max-h-48 w-72 overflow-y-auto rounded-lg border border-border bg-background shadow-lg">
                        {options.slice(0, 8).map((option) => (
                          <button
                            type="button"
                            key={option._id ?? option.name}
                            onClick={() => {
                              setSupportConflicts((prev) => {
                                const next = { ...prev };
                                delete next[index];
                                return next;
                              });
                              updateSupportAuditor(index, option.name);
                              setOpenSuggestions(null);
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
                  {supportConflicts[index] && (
                    <span className="text-xs text-red-500">{supportConflicts[index]}</span>
                  )}
                  {supportAuditor && !loadingAuditors && options.length === 0 && (
                    <span className="text-xs text-red-500">No available auditors match that name.</span>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
